# Message / Enquiry Cleanup — Dry-Run Plan

**Status: NOTHING DELETED.** This describes the read-only audit and the approval gate.
Enquiries and Host Messages are the **same `Enquire` collection**, so one dry-run covers both.

## Retention policy (owner-confirmed)
- Timezone: **Asia/Kolkata** (UTC+5:30, no DST).
- Cutoff: **2026-11-01 00:00 IST** = `2026-10-31T18:30:00Z`.
- **Preserve** every doc with any activity on/after the cutoff — including a November message
  inside an older thread. Keep the whole conversation container and all its Nov messages.
- Only docs whose **newest** activity is before the cutoff are candidates.
- Uncertain docs → **REVIEW**, never auto-delete.

## Dry-run script
`nomadic-server-v2/scripts/messageCleanupDryRun.mjs` — read-only, writes nothing.
```
node -r dotenv/config scripts/messageCleanupDryRun.mjs
```
Output: counts + a redacted manifest JSON (`reports/cleanup/message-cleanup-manifest-*.json`).

### Classification
| Class | Meaning | Proposed action |
|---|---|---|
| `PROTECTED_NOV` | has ≥1 activity ≥ cutoff | **KEEP** (never touch) |
| `PRE_NOV_DEMO_CANDIDATE` | all activity pre-cutoff + demo markers (test/demo/sample names, `booking_fallback`) | propose archive/delete |
| `PRE_NOV_REVIEW` | all activity pre-cutoff, no clear demo marker | **manual review** before any action |

Manifest fields (redacted): `id, class, hostId, customer(initial+***), source, messages,
novMessages, preNovMessages, newestActivityIST`.

## Execution gate (NOT built, awaiting approval)
No delete/archive code path exists yet. Before any destructive step:
1. Run the dry-run on prod; share counts + manifest.
2. Owner approves the exact scope (demo-only vs all pre-Nov) and confirms REVIEW items.
3. `mongodump` backup of the `Enquire` collection.
4. Prefer **soft-delete/archive** (recoverable) over hard delete; transactional, batched,
   with post-run reconciliation (Nov docs count unchanged) and rollback from backup.

## KPI impact
Removing pre-Nov demo enquiries lowers **Total Enquiries** (and admin Enquiries/Host Messages
lists) by exactly the approved candidate count. **Total Revenue is unaffected** (enquiries
carry no payments). November records and counts remain intact.
