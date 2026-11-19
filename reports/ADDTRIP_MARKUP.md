# Add Trip — Host Markup Pricing

## Decision taken
"Markup is commission" — reuse the host's existing `commissionRate` as the markup %.
**No rename, no new field, no routing change.** `selling = B2B × (1 + commissionRate/100)`.

## What changed (nomadic-admin-v2, Add Trip)
- **Select Host moved to Basic Details, directly below Title.** On select it shows
  `Host markup: X%`, or an explicit missing-markup warning (never defaults to a number).
  The old Host accordion selector is replaced by a pointer note (association preserved —
  still saved via `formData.host`).
- **Each booking item row** now has **Host B2B Price (₹)** (input) + **Selling Price
  (₹, excl. GST)** (read-only, computed) + a breakdown line
  `B2B ₹30,000 + 15% markup (₹4,500) = ₹34,500`.
- The computed selling price is written into the existing `TitlePrice` field, so all
  downstream booking/checkout math is unchanged. B2B is only used when entered —
  **editing a legacy trip never zeroes an existing price**.
- `hostB2BPrice` + `markupRate` are persisted per item (addSection is stored as free-form
  JSON → no backend schema change).
- Changing the host **recomputes** every item's selling price from the new markup.
- The Price→section auto-sync no longer clobbers a B2B-computed selling price.
- **Validation:** publishing is blocked if any item has a B2B price but no host / no
  markup / an invalid number.

## Pricing function
`src/utils/pricing.js` — `computeSelling(b2b, markup%)`, paise-safe (integer paise, then
2dp rupees), non-negative/NaN/∞ guarded, GST never folded in. 14 unit checks pass
(`src/utils/pricing.test.mjs`), incl. the brief's ₹30,000→₹34,500 and ₹28,500→₹32,775.

## Edit flow — DONE
`UpdateTrip.jsx` now has full parity with Add Trip: host select below Title (restores the
saved host via `hostDisplayName`), per-item Host B2B + read-only Selling + breakdown,
host-change recompute, legacy-price safety, and the same publish-time validation. Trips saved
with `hostB2BPrice` reload it; legacy trips show their existing price with a "enter B2B to
recompute" hint.

## Still open (separate, needs approval)
2. **Booking-time snapshot** — persisting `hostB2BPrice/markupRate/markupAmount/
   sellingPriceExclTax` onto the *booking* at checkout (so later host-rate changes can't
   rewrite historical earnings) is a backend booking-flow change, not done here. Selling
   price is already snapshotted in the booking today; the B2B/markup breakdown is not.
3. **Multiple hosts** — pricing uses the first selected host's markup (UI is single-select).
4. **Server-side authority** — selling price is computed client-side and stored in
   TitlePrice; the server trusts the stored value (as today). A shared server pricing fn +
   recompute-on-save could be added if you want the server to re-derive.

## Not changed
Booking/checkout totals, payments, coupons, GST config, host payouts, public trip pricing.
