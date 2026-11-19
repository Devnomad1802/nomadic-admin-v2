# Total Revenue — Definition

**Revenue = Nomadic Townies' earned platform commission** (not gross trip sales, not the
host's share).

## Formula
Per eligible booking: `commission = paidAmount × trip.commissionRate%`.
Total revenue = Σ over all eligible bookings, computed in **integer paise** then divided by
100 for display (decimal-safe; no floating-point money drift).

Implementation: `utils/bookingRevenue.js → platformCommissionPaise(bookings, rateFor)`,
exposed via `GET /api/analytics/platform-revenue` (admin-only).

## Qualifying bookings (`isEarningBooking` + non-test)
Counted when **all** hold:
- `paymentStatus ∈ {firstPayment, fullPayment, paid, completed, success}` (actually paid, incl. advance)
- `status`/`paymentStatus` **not** in `{cancelled, refunded, failed, rejected}`
- `mode !== "test"` (sandbox bookings excluded)

Excluded: unpaid `created` (abandoned checkout), test-mode, cancelled, refunded, failed.

## Commission base & adjustments (defaults applied)
- **Base = paid amount as stored** (`booking.total`). For advance payments, commission is on
  the amount actually paid, not the full trip price.
- **Refunds / cancellations:** handled by exclusion — a refunded/cancelled booking drops out
  entirely (no partial-refund amount field exists on the booking model).
- **Rate source:** per-trip `commissionRate` (percent). No global/assumed rate. A booking whose
  trip is missing or has no rate contributes **0** (reported as `bookingsMissingRate`).
- **Zero state:** no qualifying booking → **₹0** (explicit, never a placeholder).

## Owner decisions still open (assumptions documented, change if needed)
1. **Tax (GST):** commission is computed on the stored paid amount **as-is (tax-exclusive
   assumption)**. If revenue should be net of GST, confirm the GST field and we subtract it.
2. **Settlement vs earned:** current card shows *earned* commission at payment time, not
   *settled/paid-out*. Confirm if you want settled-only.
3. **Commission rate semantics:** assumes `trip.commissionRate` is a percent (e.g. `15` = 15%).

## Reconciliation
`revenuePaise` reconciles to the per-booking sum. Unit tests
(`scripts/platformRevenue.test.mjs`, 9 checks) cover zero bookings, variable rates, refunds,
unpaid, missing rate, partial advance, paise rounding, and a mixed batch. Current prod
bookings = 0 → revenue **₹0** (verified behaviour, not mocked).
