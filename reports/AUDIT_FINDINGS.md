# Admin Dashboard KPI Audit — Findings

**Date:** 2026-11-20 · **Scope:** `nomadic-admin-v2` + supporting `nomadic-server-v2`
**Screenshot baseline:** Bookings 0 · Trips 4 · Hosts 6 · Customers 2 · Enquiries 18 · New Enquiries 9

## KPI source-to-screen map

| Card | Source (endpoint) | Correct count field | Status |
|---|---|---|---|
| Total Bookings | `POST /getAllBookings` (paginated, limit 20) | `totalTrips` (countDocuments) | **FIXED** — was `data.length` (≤20) |
| Total Trips | `GET /GetAllTrips` (no pagination) | `data.length` | VERIFIED correct |
| Total Hosts | `GET /host?includeHidden=true` | `pagination.totalItems` | **FIXED** — see below |
| Total Customers | `GET /auth/users?role=customer` | `total` (countDocuments) | VERIFIED correct |
| Total Enquiries | `GET /getAllEnquries?range=All` (no pagination) | `data.length` | VERIFIED correct |
| ~~New Enquiries~~ → Total Revenue | `GET /analytics/platform-revenue` | `data.revenue` | **NEW** (replaces New Enquiries card) |

## VERIFIED root causes

1. **Total Hosts 6 vs expected 8 — counting the wrong entity.**
   The card counted *host login identities* (`User` docs with `role:"Host"`). The brief's
   definition is *unique host profiles* in the Hosts module (`Host` collection).
   `GET /host?includeHidden=true` returns `pagination.totalItems` = every host profile
   (including admin-hidden and pending). Hosts that have a profile but no activated login
   identity were missing from the old count — the likely source of the 6-vs-8 gap.
   **Fix:** card now reads `pagination.totalItems`. It will show the true profile count
   from the DB (not forced to 8). *Live-DB value not verifiable from this environment.*

2. **Pagination under-counting.** `getAllUsers` (limit 10) and `getAllBookings` (limit 20)
   are paginated. Counting the returned array under-reported totals. Fixed to use the
   servers' own total-count fields.

## VERIFIED — no defect
- Total Trips, Total Customers, Total Enquiries use non-paginated / total-backed sources.
- Enquiries and Host Messages are the **same `Enquire` collection** (host messages = Enquire
  docs carrying `chat[]` + `hostId`). No separate table → no double-counting, but cleanup
  must be done once, carefully (see dry-run).

## Revenue (new card)
No commission field exists on bookings. The platform's earned commission is derived:
`paid (booking.total) × trip.commissionRate%`, over eligible bookings only
(`isEarningBooking`: paid/advance, non-test, non-cancelled/refunded). Canonical formula
already used in `controllers/payouts.js`. See `REVENUE_DEFINITION.md`.

## NEEDS ACCESS
- Exact live counts (true host-profile number, demo-record identification) require prod DB /
  admin access. Code fixes make the cards authoritative; numbers confirm on deploy.
