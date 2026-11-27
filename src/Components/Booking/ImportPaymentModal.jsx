import { useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Chip,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  usePreviewImportPaymentMutation,
  useConfirmImportPaymentMutation,
  useGetUsersQuery,
  useGetTripsQuery,
} from "../../Redux/services";
import AddCustomerModal from "../User/AddCustomerModal";

// Normalise whatever shape the trips/users endpoints return.
const asArray = (d) =>
  Array.isArray(d) ? d : d?.data || d?.trips || d?.users || [];

// addsection arrives as a JSON string of [{ heading, array:[{Title,TitlePrice,...}] }].
const parseSections = (raw) => {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
// selectDate arrives as a JSON string of [{ BatchDate }].
const parseBatches = (raw) => {
  try {
    const v = JSON.parse(raw || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// The admin theme sets palette.text.primary = #fff (dark-first); on these white
// form surfaces that makes labels/values invisible. Pin readable colors here.
const field = {
  "& .MuiOutlinedInput-root": { height: 40, borderRadius: "6px", fontSize: 13, background: "#fff", color: "#111" },
  "& .MuiInputLabel-root": { color: "#667085" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#58C5DA" },
};
const INK = "#1D2939"; // readable default for all modal text (overrides the white theme default)

export default function ImportPaymentModal({ open, onClose }) {
  const [ref, setRef] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [expected, setExpected] = useState(null);
  const [eligible, setEligible] = useState(null); // {ok, reason, alreadyAllocated}
  const [customerSearch, setCustomerSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [tripId, setTripId] = useState("");
  const [batchIndex, setBatchIndex] = useState(0);
  const [qty, setQty] = useState({}); // "si-ii" -> number
  const [couponCode, setCouponCode] = useState("");
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");

  const [preview, { isLoading: previewing }] = usePreviewImportPaymentMutation();
  const [confirm, { isLoading: confirming }] = useConfirmImportPaymentMutation();

  // Customer search (role=customer); skip until the admin types 2+ chars.
  const { data: usersData, isFetching: usersFetching } = useGetUsersQuery(
    { role: "customer", search: customerSearch },
    { skip: !open || customerSearch.trim().length < 2 }
  );
  const customers = asArray(usersData);

  const { data: tripsData } = useGetTripsQuery(undefined, { skip: !open });
  const trips = asArray(tripsData);
  const trip = useMemo(() => trips.find((t) => `${t._id}` === `${tripId}`), [trips, tripId]);
  const sections = useMemo(() => parseSections(trip?.addsection), [trip]);
  const batches = useMemo(() => parseBatches(trip?.selectDate), [trip]);

  // plink_… is a payment LINK id; anything else is treated as a payment id.
  const refBody = () => {
    const v = ref.trim();
    return v.startsWith("plink_") ? { paymentLinkId: v } : { paymentId: v };
  };
  const quantities = () => {
    const out = {};
    Object.entries(qty).forEach(([k, val]) => {
      const n = Number(val) || 0;
      if (n > 0) out[k] = n;
    });
    return out;
  };

  const resetAll = () => {
    setRef(""); setEvidence(null); setExpected(null); setEligible(null);
    setCustomerSearch(""); setCustomer(null); setTripId(""); setBatchIndex(0);
    setQty({}); setCouponCode(""); setResult(null); setErr("");
  };
  const close = () => { resetAll(); onClose?.(); };

  // Step 1 — fetch masked authoritative evidence.
  const onLookup = async () => {
    setErr(""); setEvidence(null); setExpected(null); setEligible(null); setResult(null);
    if (!ref.trim()) { setErr("Enter a Razorpay payment id (pay_…) or link id (plink_…)."); return; }
    try {
      const res = await preview(refBody()).unwrap();
      setEvidence(res.evidence);
      setEligible({ ok: res.eligible, reason: res.eligibilityReason, alreadyAllocated: res.alreadyAllocated, allocatedTo: res.alreadyAllocatedTo });
    } catch (e) {
      setErr(e?.data?.error || "Could not look up this payment.");
    }
  };

  // Step 2 — recheck expected-vs-received for the chosen trip/selection.
  const onCheckAmount = async () => {
    setErr(""); setExpected(null);
    if (!tripId || Object.keys(quantities()).length === 0) {
      setErr("Pick a trip and at least one traveller/category first."); return;
    }
    try {
      const res = await preview({ ...refBody(), tripId, quantities: quantities(), couponCode }).unwrap();
      setExpected(res.expected);
      setEligible({ ok: res.eligible, reason: res.eligibilityReason, alreadyAllocated: res.alreadyAllocated, allocatedTo: res.alreadyAllocatedTo });
    } catch (e) {
      setErr(e?.data?.error || "Could not compute the expected amount.");
    }
  };

  // Step 3 — confirm (creates the imported booking; no new charge).
  const onConfirm = async () => {
    setErr("");
    if (!customer?._id) { setErr("Select the customer this payment belongs to."); return; }
    if (!tripId) { setErr("Select the trip."); return; }
    if (Object.keys(quantities()).length === 0) { setErr("Select at least one traveller/category."); return; }
    try {
      const res = await confirm({
        ...refBody(),
        userId: customer._id,
        tripId,
        batchIndex,
        quantities: quantities(),
        couponCode,
      }).unwrap();
      setResult(res.data);
    } catch (e) {
      const code = e?.data?.code;
      if (code === "AMOUNT_MISMATCH") {
        setErr(`Amount mismatch — expected ${money(e.data?.expected?.fullAmount)} (or advance ${money(e.data?.expected?.firstPaymentAmount)}), received ${money(e.data?.received)}. Not confirmed. Fix the selection or send to reconciliation.`);
      } else if (code === "ALREADY_ALLOCATED") {
        setErr(`This payment is already attached to booking ${e.data?.bookingId}.`);
      } else {
        setErr(e?.data?.error || "Could not import this payment.");
      }
    }
  };

  const canConfirm =
    eligible?.ok && !eligible?.alreadyAllocated && customer && tripId &&
    Object.keys(quantities()).length > 0 && !confirming;

  return (
    <Dialog open={!!open} onClose={close} maxWidth="md" fullWidth PaperProps={{ sx: { color: INK } }}>
      <AddCustomerModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={(c) => { if (c) setCustomer(c); setAddOpen(false); }} />
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18, color: INK }}>
        Import existing payment
        <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.5 }}>
          Attach an already-captured Razorpay payment to a booking. No new charge is created.
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ background: "#F9FAFB" }}>
        {result ? (
          <Alert severity="success" sx={{ mb: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>Booking confirmed from imported payment.</Typography>
            <Typography sx={{ fontSize: 13 }}>
              Booking ID: <b>{result.bookingId}</b> · {result.paymentType === "firstPayment" ? "Advance paid" : "Fully paid"} ·
              {" "}Invoice: <b>{result.invoiceNumber || "—"}</b> · Amount {money(result.amount)} of {money(result.fullAmount)}
            </Typography>
          </Alert>
        ) : (
          <>
            {err && <Alert severity="error" sx={{ mb: 1.5 }}>{err}</Alert>}

            {/* 1 — payment reference */}
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>1 · Razorpay payment / link id</Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                size="small" fullWidth placeholder="pay_… or plink_…"
                value={ref} onChange={(e) => setRef(e.target.value)} sx={field}
              />
              <Button variant="contained" onClick={onLookup} disabled={previewing} sx={{ textTransform: "none", whiteSpace: "nowrap" }}>
                {previewing ? <CircularProgress size={18} color="inherit" /> : "Look up"}
              </Button>
            </Box>

            {evidence && (
              <Box sx={{ background: "#fff", border: "1px solid #E7E7E7", borderRadius: "8px", p: 1.5, mb: 2 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
                  <Typography sx={{ fontSize: 13 }}><b>{money(evidence.amount)}</b> {evidence.currency}</Typography>
                  <Chip size="small" label={evidence.status} color={evidence.status === "captured" ? "success" : "default"} />
                  <Typography sx={{ fontSize: 12, color: "#667085" }}>{evidence.capturedAt ? new Date(evidence.capturedAt).toLocaleString("en-IN") : "—"}</Typography>
                  {evidence.method && <Typography sx={{ fontSize: 12, color: "#667085" }}>{evidence.method}</Typography>}
                  {Number(evidence.amountRefunded) > 0 && <Chip size="small" color="warning" label={`refunded ${money(evidence.amountRefunded)}`} />}
                </Box>
                <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.5 }}>
                  {evidence.contactEmail || "—"} · {evidence.contactPhone || "—"}
                </Typography>
                {!eligible?.ok && <Alert severity="warning" sx={{ mt: 1, py: 0 }}>{eligible?.reason || "Not eligible to import."}</Alert>}
                {eligible?.alreadyAllocated && <Alert severity="error" sx={{ mt: 1, py: 0 }}>Already allocated to booking {eligible?.allocatedTo?.bookingId} ({eligible?.allocatedTo?.source}).</Alert>}
              </Box>
            )}

            {evidence && eligible?.ok && !eligible?.alreadyAllocated && (
              <>
                <Divider sx={{ my: 1.5 }} />
                {/* 2 — customer */}
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>2 · Customer</Typography>
                {customer ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Chip label={`${customer.name || "—"} · ${customer.email || customer.phone || ""}`} onDelete={() => setCustomer(null)} sx={{ color: INK, "& .MuiChip-label": { color: INK } }} />
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <TextField
                        size="small" fullWidth placeholder="Search customer by name / email / phone (2+ chars)"
                        value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} sx={field}
                        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18 }} /></InputAdornment>) }}
                      />
                      <Button size="small" variant="outlined" onClick={() => setAddOpen(true)} sx={{ textTransform: "none", whiteSpace: "nowrap" }}>New customer</Button>
                    </Box>
                    {usersFetching && <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.5 }}>Searching…</Typography>}
                    {customers.slice(0, 6).map((u) => (
                      <Box key={u._id} onClick={() => setCustomer(u)}
                        sx={{ cursor: "pointer", p: 1, borderBottom: "1px solid #F0F0F0", "&:hover": { background: "#F3F4F6" } }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{u.name || "(no name)"}</Typography>
                        <Typography sx={{ fontSize: 12, color: "#667085" }}>{u.email || "—"} · {u.phone || "—"}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* 3 — trip / batch / categories */}
                <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>3 · Trip &amp; selection</Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                  <TextField
                    select size="small" label="Trip" value={tripId}
                    onChange={(e) => { setTripId(e.target.value); setBatchIndex(0); setQty({}); setExpected(null); }}
                    sx={{ ...field, minWidth: 260 }}
                  >
                    <MenuItem value="">— select —</MenuItem>
                    {trips.map((t) => (<MenuItem key={t._id} value={t._id}>{t.title}</MenuItem>))}
                  </TextField>
                  {batches.length > 0 && (
                    <TextField select size="small" label="Batch" value={batchIndex}
                      onChange={(e) => setBatchIndex(Number(e.target.value))} sx={{ ...field, minWidth: 200 }}>
                      {batches.map((b, i) => (<MenuItem key={i} value={i}>{b.BatchDate || `Batch ${i + 1}`}</MenuItem>))}
                    </TextField>
                  )}
                  <TextField size="small" label="Coupon (optional)" value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)} sx={{ ...field, minWidth: 160 }} />
                </Box>

                {sections.map((sec, si) => (
                  <Box key={si} sx={{ mb: 1 }}>
                    {sec?.heading && <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#344054", mt: 1 }}>{sec.heading}{si === 0 ? " (travellers)" : ""}</Typography>}
                    {(Array.isArray(sec?.array) ? sec.array : []).map((item, ii) => {
                      const key = `${si}-${ii}`;
                      return (
                        <Box key={key} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.5 }}>
                          <Typography sx={{ fontSize: 13, flex: 1 }}>{item.Title || `Option ${ii + 1}`} <span style={{ color: "#667085" }}>· {money(item.TitlePrice)}</span></Typography>
                          <TextField type="number" size="small" value={qty[key] || ""} inputProps={{ min: 0 }}
                            onChange={(e) => setQty({ ...qty, [key]: e.target.value })} sx={{ ...field, width: 90 }} />
                        </Box>
                      );
                    })}
                  </Box>
                ))}

                <Button size="small" variant="outlined" onClick={onCheckAmount} disabled={previewing} sx={{ textTransform: "none", mt: 1 }}>
                  {previewing ? <CircularProgress size={16} /> : "Check expected amount"}
                </Button>

                {expected && (
                  <Box sx={{ mt: 1.5, background: "#fff", border: "1px solid #E7E7E7", borderRadius: "8px", p: 1.5 }}>
                    <Typography sx={{ fontSize: 13 }}>Full price: <b>{money(expected.fullAmount)}</b>{expected.firstPaymentAmount ? <> · Advance: <b>{money(expected.firstPaymentAmount)}</b></> : null}</Typography>
                    <Typography sx={{ fontSize: 13 }}>Received: <b>{money(expected.receivedAmount)}</b> · Match:{" "}
                      <Chip size="small" label={expected.match}
                        color={expected.match === "full" ? "success" : expected.match === "partial" ? "warning" : "error"} />
                    </Typography>
                    {expected.match === "partial" && <Typography sx={{ fontSize: 12, color: "#667085" }}>Remaining balance: {money(expected.remainingBalance)}</Typography>}
                    {!expected.paymentType && <Alert severity="error" sx={{ mt: 1, py: 0 }}>Amount does not match — this will be rejected on confirm (needs reconciliation).</Alert>}
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={close} sx={{ textTransform: "none" }}>{result ? "Close" : "Cancel"}</Button>
        {!result && (
          <Button variant="contained" onClick={onConfirm} disabled={!canConfirm} sx={{ textTransform: "none" }}>
            {confirming ? <CircularProgress size={18} color="inherit" /> : "Import &amp; confirm booking"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
