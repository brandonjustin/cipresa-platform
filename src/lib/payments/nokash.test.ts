import { describe, expect, it } from 'vitest';
import { mapNokashStatus, signPayinRequest } from './nokash';

describe('mapNokashStatus', () => {
  it('maps known NOKASH statuses to our PaymentStatus', () => {
    expect(mapNokashStatus('PENDING')).toBe('pending');
    expect(mapNokashStatus('SUCCESS')).toBe('confirmed');
    expect(mapNokashStatus('FAILED')).toBe('failed');
    expect(mapNokashStatus('TIMEOUT')).toBe('failed');
    expect(mapNokashStatus('CANCELED')).toBe('cancelled');
  });

  it('falls back to pending for an unrecognized status', () => {
    expect(mapNokashStatus('SOMETHING_NEW')).toBe('pending');
  });
});

describe('signPayinRequest', () => {
  const base = { orderId: 'order-1', amount: '1000', userPhone: '237600000000', appSpaceKey: 'app-key', iSpaceKey: 'integrator-key' };

  it('produces a deterministic hex HMAC for the same inputs', () => {
    const a = signPayinRequest(base);
    const b = signPayinRequest(base);
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
  });

  it('changes when any signed field changes', () => {
    const original = signPayinRequest(base);
    expect(signPayinRequest({ ...base, amount: '2000' })).not.toBe(original);
    expect(signPayinRequest({ ...base, orderId: 'order-2' })).not.toBe(original);
    expect(signPayinRequest({ ...base, userPhone: '237611111111' })).not.toBe(original);
  });
});
