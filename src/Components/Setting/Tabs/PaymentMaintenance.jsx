import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Switch, TextField, Button, Divider, Chip, Stack,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Alert, CircularProgress, FormControlLabel,
} from "@mui/material";
import {
  useGetPaymentSettingsQuery,
  useUpdatePaymentSettingsMutation,
} from "../../../Redux/services/paymentSettingsApi";

const BRAND = "#CD482A";
const E164 = /^\+[1-9]\d{7,14}$/;

// Small labelled read-only diagnostic row.
const Diag = ({ label, ok, text }) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ py: 0.5 }}>
    <Chip
      size="small"
      label={text ?? (ok ? "Yes" : "No")}
      color={ok === undefined ? "default" : ok ? "success" : "warning"}
      variant={ok ? "filled" : "outlined"}
    />
    <Typography sx={{ fontSize: 13, color: "#555" }}>{label}</Typography>
  </Stack>
);

const PaymentMaintenance = () => {
  const { data, isLoading, isError, refetch } = useGetPaymentSettingsQuery();
  const [save, { isLoading: saving }] = useUpdatePaymentSettingsMutation();

  // Local editable form state, seeded from the server once loaded.
  const [form, setForm] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [msg, setMsg] = useState(null); // { type, text }

  useEffect(() => {
    if (data) {
      setForm({
        paymentMaintenance: data.paymentMaintenance,
        whatsappNumber: data.whatsappNumber || "",
        noticeHeading: data.noticeHeading || "",
        noticeBody: data.noticeBody || "",
        noticeCtaLabel: data.noticeCtaLabel || "",
      });
    }
  }, [data]);

  const waError = useMemo(
    () => !!form?.whatsappNumber && !E164.test(form.whatsappNumber.trim()),
    [form?.whatsappNumber]
  );

  if (isLoading || !form) {
    return <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>;
  }
  if (isError) {
    return <Alert severity="error" action={<Button onClick={refetch}>Retry</Button>}>Could not load payment settings.</Alert>;
  }

  const d = data.diagnostics || {};
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const doSave = async (next = form) => {
    setMsg(null);
    try {
      await save(next).unwrap();
      setMsg({ type: "success", text: "Saved." });
    } catch (e) {
      setMsg({ type: "error", text: e?.data?.error || "Could not save. Check the fields and try again." });
    }
  };

  // Toggling the switch: turning OFF opens a confirmation (real payments may be
  // accepted); turning ON applies immediately.
  const onToggle = (checked) => {
    if (checked === false) { setConfirmOpen(true); return; }
    const next = { ...form, paymentMaintenance: true };
    setForm(next);
    doSave(next);
  };
  const confirmDisable = () => {
    setConfirmOpen(false);
    const next = { ...form, paymentMaintenance: false };
    setForm(next);
    doSave(next);
  };

  const on = form.paymentMaintenance;

  return (
    <Box sx={{ maxWidth: 760, py: 1 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111", mb: 0.5 }}>
        Payment Maintenance
      </Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
        When ON, customers can browse and prepare an enquiry, but cannot make online
        payments. Browsing and login stay available. This is not site downtime.
      </Typography>

      {/* Status + toggle */}
      <Box sx={{ p: 2, borderRadius: 2, border: "1px solid #eee", background: on ? "#FFF7ED" : "#ECFDF5", mb: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Box>
            <Typography sx={{ fontWeight: 700, color: on ? "#9A3412" : "#065F46" }}>
              {on ? "Payments are OFF (maintenance ON)" : "Payments are LIVE (maintenance OFF)"}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#666" }}>
              {on ? "No online payment can be initiated by customers." : "Customers can be charged for real. Ensure live readiness."}
            </Typography>
          </Box>
          <FormControlLabel
            control={<Switch checked={on} onChange={(e) => onToggle(e.target.checked)} />}
            label={on ? "Maintenance ON" : "Maintenance OFF"}
            sx={{ m: 0 }}
          />
        </Stack>
      </Box>

      {msg && <Alert severity={msg.type} sx={{ mb: 2 }} onClose={() => setMsg(null)}>{msg.text}</Alert>}

      {/* WhatsApp + copy */}
      <Typography sx={{ fontWeight: 700, color: "#111", mb: 1 }}>Customer enquiry</Typography>
      <TextField
        fullWidth size="small" label="Official WhatsApp number (E.164)"
        placeholder="+919812345678"
        value={form.whatsappNumber}
        onChange={(e) => set("whatsappNumber", e.target.value)}
        error={waError}
        helperText={waError ? "Must be E.164, e.g. +919812345678" : "Leave blank to show a safe fallback instead of WhatsApp."}
        sx={{ mb: 2 }}
      />
      <TextField fullWidth size="small" label="Notice heading" value={form.noticeHeading}
        onChange={(e) => set("noticeHeading", e.target.value)} sx={{ mb: 2 }} inputProps={{ maxLength: 140 }} />
      <TextField fullWidth size="small" label="Notice body" value={form.noticeBody} multiline minRows={3}
        onChange={(e) => set("noticeBody", e.target.value)} sx={{ mb: 2 }} inputProps={{ maxLength: 600 }} />
      <TextField fullWidth size="small" label="CTA label" value={form.noticeCtaLabel}
        onChange={(e) => set("noticeCtaLabel", e.target.value)} sx={{ mb: 2 }} inputProps={{ maxLength: 40 }} />

      <Button variant="contained" onClick={() => doSave()} disabled={saving || waError}
        sx={{ background: BRAND, "&:hover": { background: "#B83F23" }, textTransform: "none", fontWeight: 700 }}>
        {saving ? "Saving…" : "Save changes"}
      </Button>

      <Divider sx={{ my: 3 }} />

      {/* Diagnostics (read-only) */}
      <Typography sx={{ fontWeight: 700, color: "#111", mb: 1 }}>Diagnostics</Typography>
      <Diag label="Payment maintenance" ok={!d.paymentMaintenance} text={d.paymentMaintenance ? "ON" : "OFF"} />
      <Diag label="WhatsApp configured" ok={d.whatsappConfigured} />
      <Diag label="Razorpay live keys present" ok={d.liveReady} />
      <Diag label="Isolated test sandbox ready (staging only)" ok={d.testSandboxReady} />
      <Diag label={`Authorized test account: ${d.authorizedTestEmail || "—"}`} ok={undefined} text="info" />
      <Typography sx={{ fontSize: 12, color: "#888", mt: 1 }}>
        Last updated: {d.updatedAt ? new Date(d.updatedAt).toLocaleString() : "—"}
        {d.updatedByEmail ? ` by ${d.updatedByEmail}` : ""}
      </Typography>

      {/* Audit */}
      {Array.isArray(data.auditLog) && data.auditLog.length > 0 && (
        <>
          <Typography sx={{ fontWeight: 700, color: "#111", mt: 3, mb: 1 }}>Recent changes</Typography>
          <Stack spacing={0.5}>
            {data.auditLog.map((a, i) => (
              <Typography key={i} sx={{ fontSize: 12.5, color: "#555" }}>
                {a.at ? new Date(a.at).toLocaleString() : ""} — {a.detail || a.action}
                {a.byEmail ? ` (${a.byEmail})` : ""}
              </Typography>
            ))}
          </Stack>
        </>
      )}

      {/* Confirm turning maintenance OFF */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Turn payment maintenance OFF?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This lets customers make <b>real online payments</b>. Only proceed if Razorpay
            live credentials are verified and the booking flow is ready. Payments are
            blocked again as soon as you turn maintenance back ON.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmDisable} variant="contained" color="warning">
            Yes, enable payments
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentMaintenance;
