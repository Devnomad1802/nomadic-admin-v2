import { useState } from "react";
import {
  Box, Button, Chip, Snackbar, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Divider, Grid,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import EditNoteIcon from "@mui/icons-material/EditNote";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  useGetHostApplicationsQuery,
  useUpdateHostApplicationMutation,
} from "../../Redux/services/hostsApi";

const TABS = ["new", "reviewing", "approved", "rejected", "converted"];
const CHIP = {
  new: { c: "#F97316", b: "#FFF1E8" },
  reviewing: { c: "#3B82F6", b: "#EAF1FE" },
  approved: { c: "#22C55E", b: "#EAFAF0" },
  rejected: { c: "#EF4444", b: "#FDECEC" },
  converted: { c: "#0F172A", b: "#E2E8F0" },
};

// One labelled read-only field in the viewer.
const Field = ({ label, value, full }) => (
  <Grid item xs={12} sm={full ? 12 : 6}>
    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, color: "#1e293b", mt: 0.3, whiteSpace: "pre-wrap" }}>{value || "—"}</Typography>
  </Grid>
);

const HostApplications = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const { data, isLoading } = useGetHostApplicationsQuery();
  const [updateApp] = useUpdateHostApplicationMutation();
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });
  const [viewApp, setViewApp] = useState(null);

  const apps = data?.data || [];
  const rows = apps.filter((a) => (a.status || "new") === tab);
  const countFor = (s) => apps.filter((a) => (a.status || "new") === s).length;

  const setStatus = async (app, status) => {
    try {
      await updateApp({ id: app._id, status }).unwrap();
      const extra = status === "reviewing" ? " Onboarding email sent." : "";
      setSnack({ open: true, msg: `Marked ${status}.${extra}`, sev: "success" });
      setViewApp(null);
    } catch (e) {
      setSnack({ open: true, msg: e?.data?.message || "Update failed", sev: "error" });
    }
  };

  // Open the self-onboarded draft host (if the applicant already submitted).
  const openDraft = (app) => {
    if (app.hostId) navigate(`/hosts/edit/${app.hostId}`);
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Host Applications</Typography>
      <Typography sx={{ fontSize: 13, color: "#667085", mb: 2 }}>
        Submissions from the &quot;Become a Host&quot; form. Move to Reviewing to email the secure
        onboarding link; the applicant&apos;s submission arrives as a draft host to approve.
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <Button key={t} onClick={() => setTab(t)} variant={tab === t ? "contained" : "outlined"}
            sx={{ textTransform: "capitalize", borderRadius: 2, fontSize: 13,
              ...(tab === t ? { background: "#EC3F18" } : { color: "#667085", borderColor: "#E2E8F0" }) }}>
            {t} ({countFor(t)})
          </Button>
        ))}
      </Box>

      <TableContainer sx={{ border: "1px solid #F3F3F3", borderRadius: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ background: "#F3F4F6" }}>
            <TableRow>
              {["Applicant", "Contact", "City", "Category", "Onboarding", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontSize: 12, fontWeight: 700, color: "#667085" }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>Loading…</TableCell></TableRow>}
            {!isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: "#94a3b8" }}>No {tab} applications.</TableCell></TableRow>
            )}
            {rows.map((a) => {
              const c = CHIP[a.status || "new"];
              const submitted = !!a.hostId; // draft host exists → onboarding done
              return (
                <TableRow key={a._id} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.fullName}</Typography>
                    <Chip label={a.status || "new"} size="small" sx={{ mt: 0.5, color: c.c, background: c.b, fontWeight: 600, fontSize: 11, textTransform: "capitalize" }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{a.email}<br />{a.mobile}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{a.city || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{a.category || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 12 }}>
                    {submitted
                      ? <Chip label="Submitted ✓" size="small" sx={{ color: "#22C55E", background: "#EAFAF0", fontWeight: 600, fontSize: 11 }} />
                      : a.onboardingToken
                        ? <Chip label={a.onboardingUsed ? "Used" : "Link sent"} size="small" sx={{ color: "#3B82F6", background: "#EAF1FE", fontWeight: 600, fontSize: 11 }} />
                        : <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>—</Typography>}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="View full application">
                        <IconButton size="small" onClick={() => setViewApp(a)}><VisibilityIcon fontSize="small" sx={{ color: "#334155" }} /></IconButton>
                      </Tooltip>
                      {submitted && (
                        <Tooltip title="Open draft host to review / approve">
                          <IconButton size="small" onClick={() => openDraft(a)}><EditNoteIcon fontSize="small" sx={{ color: "#22C55E" }} /></IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Move to Reviewing (sends onboarding email)">
                        <IconButton size="small" onClick={() => setStatus(a, "reviewing")}><SendIcon fontSize="small" sx={{ color: "#3B82F6" }} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" onClick={() => setStatus(a, "rejected")}><CloseIcon fontSize="small" sx={{ color: "#EF4444" }} /></IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Application viewer — every submitted field, structured. */}
      <Dialog open={!!viewApp} onClose={() => setViewApp(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {viewApp?.fullName}
          <Typography component="span" sx={{ ml: 1, fontSize: 12, color: "#94a3b8", textTransform: "capitalize" }}>· {viewApp?.status || "new"}</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {viewApp && (
            <Grid container spacing={2}>
              <Grid item xs={12}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#EC3F18" }}>Personal & Contact</Typography></Grid>
              <Field label="Full Name" value={viewApp.fullName} />
              <Field label="Email" value={viewApp.email} />
              <Field label="Mobile" value={viewApp.mobile} />
              <Field label="Website / Social" value={viewApp.website} />
              <Grid item xs={12}><Divider /></Grid>
              <Grid item xs={12}><Typography sx={{ fontSize: 12, fontWeight: 700, color: "#EC3F18" }}>Experience</Typography></Grid>
              <Field label="City / Location" value={viewApp.city} />
              <Field label="Category" value={viewApp.category} />
              <Field label="Years of Experience" value={viewApp.years} />
              <Field label="Typical Group Size" value={viewApp.groupSize} />
              <Field label="About" value={viewApp.about} full />
              {viewApp.adminNote ? <Field label="Admin Note" value={viewApp.adminNote} full /> : null}
              <Grid item xs={12}><Divider /></Grid>
              <Field label="Onboarding" value={viewApp.hostId ? "Draft submitted — review in Add/Edit Host" : viewApp.onboardingToken ? (viewApp.onboardingUsed ? "Link used" : "Link sent, awaiting submission") : "Not started"} full />
              <Field label="Submitted On" value={viewApp.createdAt ? new Date(viewApp.createdAt).toLocaleString() : "—"} />
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {viewApp?.hostId && (
            <Button onClick={() => openDraft(viewApp)} sx={{ textTransform: "none", color: "#22C55E" }}>Open Draft Host</Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setStatus(viewApp, "rejected")} sx={{ textTransform: "none", color: "#EF4444" }}>Reject</Button>
          <Button onClick={() => setStatus(viewApp, "reviewing")} variant="contained" sx={{ textTransform: "none", background: "#EC3F18" }}>
            Move to Reviewing
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HostApplications;
