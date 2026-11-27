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
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import {
  useCreateAssistedLinkMutation,
  useCancelAssistedLinkMutation,
  useGetAssistedLinkStatusMutation,
  useGetUsersQuery,
  useGetTripsQuery,
} from "../../Redux/services";

const asArray = (d) => (Array.isArray(d) ? d : d?.data || d?.trips || d?.users || []);
const parseJson = (raw) => { try { const v = JSON.parse(raw || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const field = { "& .MuiOutlinedInput-root": { height: 40, borderRadius: "6px", fontSize: 13, background: "#fff" } };

const SUPPORT = "support@nomadictownies.com";

export default function CreatePaymentLinkModal({ open, onClose }) {
  const [customerSearch, setCustomerSearch] = useState("");
  const [customer, setCustomer] = useState(null);
  const [tripId, setTripId] = useState("");
  const [batchIndex, setBatchIndex] = useState(0);
  const [qty, setQty] = useState({});
  const [couponCode, setCouponCode] = useState("");
  const [paymentType, setPaymentType] = useState("full"); // "full" | "firstPayment"
  const [link, setLink] = useState(null); // server response data
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  const [createLink, { isLoading: creating }] = useCreateAssistedLinkMutation();
  const [cancelLink, { isLoading: cancelling }] = useCancelAssistedLinkMutation();
  const [checkStatus, { isLoading: checking }] = useGetAssistedLinkStatusMutation();

  const { data: usersData, isFetching: usersFetching } = useGetUsersQuery(
    { role: "customer", search: customerSearch },
    { skip: !open || customerSearch.trim().length < 2 }
  );
  const customers = asArray(usersData);
  const { data: tripsData } = useGetTripsQuery(undefined, { skip: !open });
  const trips = asArray(tripsData);
  const trip = useMemo(() => trips.find((t) => `${t._id}` === `${tripId}`), [trips, tripId]);
  const sections = useMemo(() => parseJson(trip?.addsection), [trip]);
  const batches = useMemo(() => parseJson(trip?.selectDate), [trip]);

  const quantities = () => {
    const out = {};
    Object.entries(qty).forEach(([k, v]) => { const n = Number(v) || 0; if (n > 0) out[k] = n; });
    return out;
  };

  const resetAll = () => {
    setCustomerSearch(""); setCustomer(null); setTripId(""); setBatchIndex(0);
    setQty({}); setCouponCode(""); setPaymentType("full"); setLink(null); setStatus(null); setErr("");
  };
  const close = () => { resetAll(); onClose?.(); };

  const onGenerate = async () => {
    setErr(""); setStatus(null);
    if (!customer?._id) { setErr("Select the customer."); return; }
    if (!tripId) { setErr("Select the trip."); return; }
    if (Object.keys(quantities()).length === 0) { setErr("Select at least one traveller/category."); return; }
    try {
      const res = await createLink({
        userId: customer._id, tripId, batchIndex,
        quantities: quantities(), couponCode, paymentType,
      }).unwrap();
      setLink(res.data);
    } catch (e) {
      setErr(e?.data?.error || "Could not create the payment link.");
    }
  };

  const onCancel = async () => {
    if (!link?.bookingId) return;
    setErr("");
    try {
      await cancelLink({ bookingId: link.bookingId }).unwrap();
      setLink(null); setStatus(null);
    } catch (e) {
      setErr(e?.data?.error || "Could not cancel the link.");
    }
  };

  const onCheck = async () => {
    if (!link?.bookingId) return;
    setErr("");
    try {
      const res = await checkStatus(link.bookingId).unwrap();
      setStatus(res.data);
    } catch (e) {
      setErr(e?.data?.error || "Could not fetch status.");
    }
  };

  const batchDate = batches?.[batchIndex]?.BatchDate || "";
  const shareText = () =>
    `Hi${customer?.name ? " " + customer.name : ""}, here's your payment link for ${link?.trip || "your Nomadic Townies trip"}` +
    `${batchDate ? ` (${batchDate})` : ""}: ${link?.shortUrl}\n` +
    `Amount: ${money(link?.amount)} INR${link?.paymentType === "firstPayment" ? " (advance)" : ""}. ` +
    `Link valid 7 days. Questions? ${SUPPORT}`;

  const copy = async () => {
    try { await navigator.clipboard.writeText(link?.shortUrl || ""); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };
  const waHref = () => {
    const phone = (customer?.phone || "").replace(/[^\d]/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(shareText())}`;
  };
  const mailHref = () =>
    `mailto:${customer?.email || ""}?subject=${encodeURIComponent("Your Nomadic Townies payment link")}&body=${encodeURIComponent(shareText())}`;

  const paidAndDone = status?.bookingPaymentStatus && status.bookingPaymentStatus !== "created";

  return (
    <Dialog open={!!open} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Create payment link
        <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.5 }}>
          Server-priced assisted booking. The customer pays the link; the booking confirms only after a verified payment.
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ background: "#F9FAFB" }}>
        {err && <Alert severity="error" sx={{ mb: 1.5 }}>{err}</Alert>}

        {!link ? (
          <>
            {/* 1 — customer */}
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>1 · Customer</Typography>
            {customer ? (
              <Box sx={{ mb: 2 }}>
                <Chip label={`${customer.name || "—"} · ${customer.email || customer.phone || ""}`} onDelete={() => setCustomer(null)} />
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <TextField size="small" fullWidth placeholder="Search customer by name / email / phone (2+ chars)"
                  value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} sx={field}
                  InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18 }} /></InputAdornment>) }} />
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

            <Divider sx={{ my: 1.5 }} />
            {/* 2 — trip / batch / categories */}
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 0.5 }}>2 · Trip &amp; selection</Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <TextField select size="small" label="Trip" value={tripId}
                onChange={(e) => { setTripId(e.target.value); setBatchIndex(0); setQty({}); }} sx={{ ...field, minWidth: 260 }}>
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
                onChange={(e) => setCouponCode(e.target.value)} sx={{ ...field, minWidth: 150 }} />
              <TextField select size="small" label="Payment" value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)} sx={{ ...field, minWidth: 150 }}>
                <MenuItem value="full">Full</MenuItem>
                <MenuItem value="firstPayment">Advance</MenuItem>
              </TextField>
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
          </>
        ) : (
          <>
            {/* 3 — generated link */}
            <Alert severity="success" sx={{ mb: 1.5 }}>
              Payment link created — {link.paymentType === "firstPayment" ? "advance" : "full"} {money(link.amount)} of {money(link.fullAmount)}.
            </Alert>
            <Box sx={{ background: "#fff", border: "1px solid #E7E7E7", borderRadius: "8px", p: 1.5, mb: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <TextField size="small" fullWidth value={link.shortUrl} InputProps={{ readOnly: true }} sx={field} />
                <Tooltip title={copied ? "Copied!" : "Copy link"}>
                  <IconButton onClick={copy}><ContentCopyRoundedIcon fontSize="small" /></IconButton>
                </Tooltip>
                <Tooltip title="Share on WhatsApp">
                  <IconButton component="a" href={waHref()} target="_blank" rel="noopener"><WhatsAppIcon fontSize="small" sx={{ color: "#25D366" }} /></IconButton>
                </Tooltip>
                <Tooltip title="Share by email">
                  <IconButton component="a" href={mailHref()}><EmailRoundedIcon fontSize="small" /></IconButton>
                </Tooltip>
              </Box>
              <Typography sx={{ fontSize: 12, color: "#667085", mt: 1 }}>
                {customer?.name} · {customer?.email || "—"} · {customer?.phone || "—"} · {link.trip}{batchDate ? ` · ${batchDate}` : ""}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#98A2B3", mt: 0.5 }}>
                Delivery is manual (copy / WhatsApp / email). Sharing here does not guarantee the customer received it.
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button size="small" variant="outlined" startIcon={checking ? <CircularProgress size={14} /> : <RefreshRoundedIcon />} onClick={onCheck} sx={{ textTransform: "none" }}>
                Check status
              </Button>
              {status && (
                <Chip size="small"
                  color={paidAndDone ? "success" : status.linkStatus === "cancelled" ? "default" : "warning"}
                  label={paidAndDone ? `Paid · ${status.bookingPaymentStatus}` : `Link: ${status.linkStatus || "—"} · booking: ${status.bookingPaymentStatus || "—"}`} />
              )}
            </Box>
            {paidAndDone && <Alert severity="success" sx={{ mt: 1.5 }}>Payment received — booking confirmed. Invoice issued automatically.</Alert>}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {!link ? (
          <>
            <Button onClick={close} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button variant="contained" onClick={onGenerate} disabled={creating} sx={{ textTransform: "none" }}>
              {creating ? <CircularProgress size={18} color="inherit" /> : "Generate link"}
            </Button>
          </>
        ) : (
          <>
            <Button onClick={close} sx={{ textTransform: "none" }}>Close</Button>
            {!paidAndDone && (
              <>
                <Button color="error" onClick={onCancel} disabled={cancelling} sx={{ textTransform: "none" }}>
                  {cancelling ? <CircularProgress size={18} /> : "Cancel link"}
                </Button>
                <Button variant="outlined" onClick={() => { setLink(null); setStatus(null); }} sx={{ textTransform: "none" }}>
                  New link
                </Button>
              </>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
