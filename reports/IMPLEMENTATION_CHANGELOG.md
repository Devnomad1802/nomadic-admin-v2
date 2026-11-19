# Implementation Changelog

Branch: `feat/admin-revenue-and-hosts` (both repos). No merge / deploy / deletion performed.

## nomadic-server-v2
- `utils/bookingRevenue.js` — added `platformCommissionPaise(bookings, rateFor)`: integer-paise
  earned-commission sum over `isEarningBooking` bookings; missing rate → 0.
- `controllers/analytics.js` — added `getPlatformRevenue` (admin): eligible = earning +
  non-test; commission per booking via per-trip `commissionRate`; returns
  `{ revenue, revenuePaise, eligibleBookings, bookingsCounted, bookingsMissingRate, currency }`.
- `routes/analytics.js` — `GET /api/analytics/platform-revenue` (isAdmin).
- `scripts/platformRevenue.test.mjs` — 9 unit checks (zero, variable rate, refund/cancel,
  unpaid, missing rate, partial advance, paise rounding, mixed reconcile). **All pass.**
- `scripts/messageCleanupDryRun.mjs` — read-only Enquire inventory + redacted manifest. No
  deletion path.

## nomadic-admin-v2
- `src/Redux/services/analytics.js` — `getPlatformRevenue` query + `useGetPlatformRevenueQuery`.
- `src/Pages/Dashboard.jsx`
  - **Total Hosts** now from `useGetAllHostsQuery` → `pagination.totalItems` (host profiles,
    incl. hidden/pending) instead of `User role:"Host"`.
  - **Total Bookings** → `totalTrips` (real count, not the 20-row page).
  - **Total Customers** → role-scoped `total`.
  - **New Enquiries card removed; Total Revenue added** (INR `₹1,70,000` format, ₹0 when none).
  - Value cell made shrink-safe (nowrap + ellipsis) for currency strings.

## Evidence
- server: `node --check` on all edited files ✓; revenue tests 9/9 ✓.
- admin-v2: `npm run build` (vite) ✓.
- Enquiry workflow, booking/payment flows untouched. New Enquiries **records** untouched
  (only the KPI card was swapped).

## Remaining / risks
- Live KPI values confirm only after admin-v2 deploy + **server droplet deploy** (revenue +
  host endpoints are server-side). Droplet deploy is manual.
- Revenue GST/settlement semantics pending owner confirmation (see `REVENUE_DEFINITION.md`).
- Cleanup execution not built — awaits dry-run review + approval.
