import { useState } from "react";
import {
  Box, Button, Chip, Snackbar, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Tooltip, Typography, IconButton,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DoneIcon from "@mui/icons-material/Done";
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

const HostApplications = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("new");
  const { data, isLoading } = useGetHostApplicationsQuery();
  const [updateApp] = useUpdateHostApplicationMutation();
  const [snack, setSnack] = useState({ open: false, msg: "", sev: "success" });

  const apps = data?.data || [];
  const rows = apps.filter((a) => (a.status || "new") === tab);
  const countFor = (s) => apps.filter((a) => (a.status || "new") === s).length;

  const setStatus = async (app, status) => {
    try {
      await updateApp({ id: app._id, status }).unwrap();
      setSnack({ open: true, msg: `Marked ${status}.`, sev: "success" });
    } catch (e) {
      setSnack({ open: true, msg: e?.data?.message || "Update failed", sev: "error" });
    }
  };

  // Prefill the existing Add Host form from the application.
  const createHost = (app) => {
    navigate("/hosts/addHost", {
      state: {
        prefill: {
          hostName: app.fullName,
          hostTitle: app.fullName,
          emailAddress: app.email,
          phoneNumber: app.mobile,
          location: app.city,
          hostOverview: app.about,
        },
        applicationId: app._id,
      },
    });
  };

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Host Applications</Typography>
      <Typography sx={{ fontSize: 13, color: "#667085", mb: 2 }}>
        Submissions from the &quot;Become a Host&quot; form. Review, then Create Host to onboard + activate.
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
              {["Applicant", "Contact", "City", "Category", "Experience", "Actions"].map((h) => (
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
              return (
                <TableRow key={a._id} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{a.fullName}</Typography>
                    <Chip label={a.status || "new"} size="small" sx={{ mt: 0.5, color: c.c, background: c.b, fontWeight: 600, fontSize: 11, textTransform: "capitalize" }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{a.email}<br />{a.mobile}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{a.city || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{a.category || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{a.years || "—"} · {a.groupSize || "—"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Create Host from application">
                        <IconButton size="small" onClick={() => createHost(a)}><PersonAddIcon fontSize="small" sx={{ color: "#22C55E" }} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Mark reviewing">
                        <IconButton size="small" onClick={() => setStatus(a, "reviewing")}><DoneIcon fontSize="small" sx={{ color: "#3B82F6" }} /></IconButton>
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

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert severity={snack.sev} variant="filled">{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default HostApplications;
