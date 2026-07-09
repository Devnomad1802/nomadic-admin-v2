import { useMemo, useState } from "react";
import {
  Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Snackbar, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useGetTripsQuery, useUpdateTripStatusMutation } from "../../Redux/services/TripApis";
import { baseImage } from "../../Redux/utils";

const TABS = ["pending", "changes_requested", "rejected", "approved"];
const LABEL = {
  pending: "Pending",
  changes_requested: "Changes Requested",
  rejected: "Rejected",
  approved: "Approved",
};
const CHIP = {
  pending: { color: "#F97316", bg: "#FFF1E8" },
  changes_requested: { color: "#3B82F6", bg: "#EAF1FE" },
  rejected: { color: "#EF4444", bg: "#FDECEC" },
  approved: { color: "#22C55E", bg: "#EAFAF0" },
};

const imgSrc = (url) => (!url ? "" : /^https?:\/\//.test(url) ? url : `${baseImage}${url}`);

const Proposals = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetTripsQuery();
  const [updateTripStatus, { isLoading: saving }] = useUpdateTripStatusMutation();

  const [tab, setTab] = useState("pending");
  const [dialog, setDialog] = useState(null); // { trip, action }
  const [feedback, setFeedback] = useState("");
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  const trips = data?.data || [];
  // Only real host proposals carry an explicit Status. Legacy/admin trips
  // (no Status) are NOT proposals and must never appear in this queue.
  const rows = useMemo(() => trips.filter((t) => t.Status === tab), [trips, tab]);
  const countFor = (s) => trips.filter((t) => t.Status === s).length;

  const apply = async (trip, Status, adminFeedback = "") => {
    try {
      await updateTripStatus({ tripId: trip._id, Status, adminFeedback }).unwrap();
      setSnack({ open: true, msg: `Trip ${LABEL[Status].toLowerCase()}.`, sev: "success" });
    } catch (e) {
      setSnack({ open: true, msg: e?.data?.error || "Update failed", sev: "error" });
    }
  };

  const openDialog = (trip, action) => {
    setFeedback("");
    setDialog({ trip, action });
  };
  const submitDialog = async () => {
    if (!dialog) return;
    const Status = dialog.action === "reject" ? "rejected" : "changes_requested";
    await apply(dialog.trip, Status, feedback);
    setDialog(null);
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Trip Proposals</Typography>
      <Typography sx={{ fontSize: 13, color: "#667085", mb: 2 }}>
        Host-submitted trips awaiting review. Approving publishes the trip live (host link kept).
      </Typography>

      {/* Tabs */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <Button
            key={t}
            onClick={() => setTab(t)}
            variant={tab === t ? "contained" : "outlined"}
            sx={{
              textTransform: "none", borderRadius: 2, fontSize: 13,
              ...(tab === t ? { background: "#EC3F18" } : { color: "#667085", borderColor: "#E2E8F0" }),
            }}
          >
            {LABEL[t]} ({countFor(t)})
          </Button>
        ))}
      </Box>

      <TableContainer sx={{ border: "1px solid #F3F3F3", borderRadius: 2 }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ background: "#F3F4F6" }}>
            <TableRow>
              {["Trip", "Host", "Location", "Price", "Status", "Actions"].map((h) => (
                <TableCell key={h} sx={{ fontSize: 12, fontWeight: 700, color: "#667085" }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4 }}>Loading…</TableCell></TableRow>
            )}
            {!isLoading && rows.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: "#94a3b8" }}>
                No {LABEL[tab].toLowerCase()} proposals.
              </TableCell></TableRow>
            )}
            {rows.map((trip) => {
              const c = CHIP[trip.Status || "pending"];
              const hostName = trip.host?.hostTitle || trip.host?.hostName || trip.host?.name || "—";
              return (
                <TableRow key={trip._id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      {imgSrc(trip.cardImage || trip.bannerImage) ? (
                        <img src={imgSrc(trip.cardImage || trip.bannerImage)} alt="" width={44} height={44}
                          style={{ borderRadius: 8, objectFit: "cover" }} />
                      ) : (
                        <Box sx={{ width: 44, height: 44, borderRadius: 2, background: "#FFE2DC" }} />
                      )}
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{trip.title || "Untitled"}</Typography>
                        <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                          {trip.days || "?"}D/{trip.nights || "?"}N · {trip.categories?.[0] || "Trip"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{hostName}</TableCell>
                  <TableCell sx={{ fontSize: 13, color: "#667085" }}>{trip.location || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 600 }}>₹{trip.price || 0}</TableCell>
                  <TableCell>
                    <Chip label={LABEL[trip.Status || "pending"]} size="small"
                      sx={{ color: c.color, background: c.bg, fontWeight: 600, fontSize: 11 }} />
                    {trip.adminFeedback && (
                      <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 0.5, maxWidth: 180 }}>
                        {trip.adminFeedback}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Edit before approval">
                        <IconButton size="small" onClick={() => navigate("/trip/tripTabs", { state: { tripData: trip } })}>
                          <EditIcon fontSize="small" sx={{ color: "#667085" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Request changes">
                        <IconButton size="small" onClick={() => openDialog(trip, "changes")}>
                          <EditNoteIcon fontSize="small" sx={{ color: "#3B82F6" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" onClick={() => openDialog(trip, "reject")}>
                          <CancelIcon fontSize="small" sx={{ color: "#EF4444" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approve">
                        <IconButton size="small" disabled={saving} onClick={() => apply(trip, "approved")}>
                          <CheckCircleIcon fontSize="small" sx={{ color: "#22C55E" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject / request-changes feedback dialog */}
      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {dialog?.action === "reject" ? "Reject proposal" : "Request changes"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 13, color: "#667085", mb: 1.5 }}>
            This note is sent back to the host as feedback.
          </Typography>
          <TextField fullWidth multiline minRows={3} placeholder="Reason / changes needed…"
            value={feedback} onChange={(e) => setFeedback(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)} sx={{ textTransform: "none", color: "#667085" }}>Cancel</Button>
          <Button onClick={submitDialog} disabled={saving} variant="contained"
            sx={{ textTransform: "none", background: dialog?.action === "reject" ? "#EF4444" : "#3B82F6" }}>
            {dialog?.action === "reject" ? "Reject" : "Send request"}
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

export default Proposals;
