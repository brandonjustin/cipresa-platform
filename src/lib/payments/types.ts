export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface InitiatePaymentParams {
  orderId: string;
  amount: number;
  currency: 'XOF' | 'XAF' | 'NGN';
  country: 'CM' | 'NG';
  phone?: string;
  /** CM mobile money operator; ignored for NG (bank transfer). Defaults to MTN_MOMO. */
  mobileMoneyOperator?: 'MTN_MOMO' | 'ORANGE_MONEY';
  email?: string;
  fullName?: string;
  callbackUrl: string;
}

export interface PaymentResult {
  /** The provider's own transaction id — what we poll/verify against later. */
  providerReference: string;
  status: PaymentStatus;
  /** Human-readable detail surfaced to the buyer when relevant (e.g. failure reason). */
  message?: string;
  raw: unknown;
}

/**
 * Provider-agnostic payment interface. Nokash is the only implementation
 * today (src/lib/payments/nokash.ts); a Stripe/Flutterwave implementation
 * could be added later without touching any caller of this interface.
 */
export interface PaymentProvider {
  initiate(params: InitiatePaymentParams): Promise<PaymentResult>;
  checkStatus(providerReference: string): Promise<PaymentResult>;
}
