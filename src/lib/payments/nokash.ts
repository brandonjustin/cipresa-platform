import { createHmac } from 'node:crypto';
import type { InitiatePaymentParams, PaymentProvider, PaymentResult, PaymentStatus } from './types';

// Implements NOKASH's "Payin" API (doc v.June 2025 / Postman collection
// "API Payin v407 - NOKASH"). For CM, GET /lapas-on-trans/transaction-options/payin?country=CM
// confirms payment_method is one of MTN_MOMO, ORANGE_MONEY, EUM — only the
// first two are wired up as selectable operators here. The HMAC algorithm
// (HMAC-SHA256, hex digest, signed with i_space_key) is transcribed directly
// from the doc's "Initiate the payment" section.

const NOKASH_STATUS_MAP: Record<string, PaymentStatus> = {
  PENDING: 'pending',
  SUCCESS: 'confirmed',
  FAILED: 'failed',
  TIMEOUT: 'failed',
  CANCELED: 'cancelled',
};

export function mapNokashStatus(status: string): PaymentStatus {
  return NOKASH_STATUS_MAP[status] ?? 'pending';
}

interface NokashResponseEnvelope<T> {
  status: string;
  message?: string;
  data: T | null;
}

interface NokashPayinData {
  id: string;
  status: string;
  amount: string | number;
  orderId: string;
  phone?: string;
  va_bank_code?: string;
  va_bank_name?: string;
  va_account_number?: string;
  va_expiry_date_in_utc?: string;
  user_name?: string;
  user_email?: string;
  statusReason?: string | null;
}

function getConfig() {
  const baseUrl = process.env.NOKASH_API_URL || 'https://api.nokash.app';
  const iSpaceKey = process.env.NOKASH_I_SPACE_KEY;
  const appSpaceKey = process.env.NOKASH_APP_SPACE_KEY;
  if (!iSpaceKey || !appSpaceKey) {
    throw new Error('NOKASH_I_SPACE_KEY / NOKASH_APP_SPACE_KEY are not configured.');
  }
  return { baseUrl, iSpaceKey, appSpaceKey };
}

export function signPayinRequest(params: { orderId: string; amount: string; userPhone: string; appSpaceKey: string; iSpaceKey: string }) {
  const payload = `${params.orderId}:${params.amount}:${params.userPhone}:${params.appSpaceKey}`;
  return createHmac('sha256', params.iSpaceKey).update(payload).digest('hex');
}

function toPaymentResult(data: NokashPayinData): PaymentResult {
  return {
    providerReference: data.id,
    status: mapNokashStatus(data.status),
    message: data.statusReason ?? undefined,
    raw: data,
  };
}

// Nokash's "Error Handling Guide" (documented alongside the Payout API but
// stated to cover their shared trans/* response format) splits non-OK
// statuses into three families: *_BAD_INFOS is a real, immediate failure;
// *_UNKNOW and *_ERROR mean "platform misbehaving" and their own guidance is
// to NOT treat those as a definite failure — the payin may still succeed.
// The one *_ERROR exception they carve out is an MNO/provider outage, which
// is meant to fail immediately (its message names the unavailable
// provider/method). We only ever see this on initiate() — checkStatus()
// already defaults ambiguous responses to 'pending'.
function isDefiniteInitiateFailure(status: string, message: string | undefined): boolean {
  if (status.endsWith('_BAD_INFOS')) return true;
  if (status.endsWith('_ERROR') && /not available/i.test(message ?? '')) return true;
  return false;
}

async function initiate(params: InitiatePaymentParams): Promise<PaymentResult> {
  const { baseUrl, iSpaceKey, appSpaceKey } = getConfig();
  const amount = String(Math.round(params.amount));

  const isBankTransfer = params.country === 'NG';
  const body: Record<string, unknown> = {
    i_space_key: iSpaceKey,
    app_space_key: appSpaceKey,
    order_id: params.orderId,
    amount,
    country: params.country,
    callback_url: params.callbackUrl,
    ...(isBankTransfer
      ? {
          payment_type: 'NG_BANKTRANSFER',
          payment_method: 'BANK_TRANSFER',
          user_data: { user_email: params.email, user_name: params.fullName },
        }
      : {
          payment_type: 'CM_MOBILEMONEY',
          payment_method: params.mobileMoneyOperator ?? 'MTN_MOMO',
          user_data: { user_phone: params.phone },
        }),
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!isBankTransfer && params.phone) {
    headers['hmac-signature'] = signPayinRequest({
      orderId: params.orderId,
      amount,
      userPhone: params.phone,
      appSpaceKey,
      iSpaceKey,
    });
  }

  const res = await fetch(`${baseUrl}/lapas-on-trans/trans/api-payin-request/407`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as NokashResponseEnvelope<NokashPayinData>;

  if (json.status !== 'REQUEST_OK' || !json.data) {
    return {
      providerReference: '',
      status: isDefiniteInitiateFailure(json.status, json.message) ? 'failed' : 'pending',
      message: json.message || json.status,
      raw: json,
    };
  }

  return toPaymentResult(json.data);
}

async function checkStatus(providerReference: string): Promise<PaymentResult> {
  const { baseUrl } = getConfig();

  const res = await fetch(
    `${baseUrl}/lapas-on-trans/trans/310/status-request?transaction_id=${encodeURIComponent(providerReference)}`,
    { method: 'POST' }
  );

  const json = (await res.json()) as NokashResponseEnvelope<NokashPayinData>;

  if (json.status !== 'REQUEST_OK' || !json.data) {
    return {
      providerReference,
      status: 'pending',
      message: json.message || json.status,
      raw: json,
    };
  }

  return toPaymentResult({ ...json.data, id: providerReference });
}

export const nokashProvider: PaymentProvider = { initiate, checkStatus };
