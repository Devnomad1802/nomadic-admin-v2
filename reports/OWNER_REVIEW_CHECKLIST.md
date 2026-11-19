# Owner Review Checklist

Validate on the preview / after deploy. No technical steps needed.

## KPI cards (Dashboard → Overview)
- [ ] Six cards show, in order: Total Bookings, Total Trips, Total Hosts, Total Customers,
      Total Enquiries, **Total Revenue**. "New Enquiries" card is gone.
- [ ] **Total Hosts** matches the number of host profiles in the **Hosts** page list
      (open Hosts, count rows incl. any hidden). If Hosts page shows 8, the card should show 8.
- [ ] **Total Customers** matches the Customers page count.
- [ ] **Total Bookings** matches the Bookings page total (not capped at 20).
- [ ] **Total Enquiries** matches the Enquiries list count.
- [ ] **Total Revenue** shows ₹0 while there are no paid bookings. Create one test paid booking
      (test mode) → it must **not** change revenue (test excluded). A real paid booking on a trip
      with a commission rate should increase it by `paid × rate%`.
- [ ] Cards are readable on phone, tablet, desktop; clicking a card opens its page.

## Revenue definition
- [ ] Confirm commission base = paid amount (tax-exclusive) is acceptable, or tell us to net GST.
- [ ] Confirm "earned at payment" vs "settled/paid-out" is what you want shown.

## Cleanup (not done yet)
- [ ] Review the dry-run manifest counts (PROTECTED_NOV vs candidates vs review).
- [ ] Approve the exact scope before any deletion. Confirm a DB backup was taken.
- [ ] After any approved cleanup: November enquiries/messages still present; counts dropped by
      exactly the approved number.

## Safety confirmations
- [ ] Booking / payment flows unchanged.
- [ ] Host V2 and public website unaffected.
