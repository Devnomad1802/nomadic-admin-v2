import { useMemo, useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Chip, Button, CircularProgress, Alert, TextField, InputAdornment,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { useGetAllHostsQuery } from "../Redux/services/hostsApi";

// Host Users = the host-to-login lifecycle for EVERY host profile (not only
// those that already have a dashboard login). "Active" means the dashboard login
// gate (dashboardAccess) is on — never a default from merely having a profile.
// Hosts manages profiles/trips; this manages access. No PAN/GST/bank/token here.
const accessOf = (h) => {
  if (h?.status === "rejected") return { label: "Rejected", color: "error", variant: "outlined" };
  if (h?.status === "draft" || h?.status === "pending") return { label: "Pending review", color: "warning", variant: "outlined" };
  if (h?.dashboardAccess === true) return { label: "Active", color: "success", variant: "filled" };
  return { label: "Not activated", color: "default", variant: "outlined" };
};

const HostUsers = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetAllHostsQuery();
  const [search, setSearch] = useState("");

  const hosts = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((h) =>
      [h.hostTitle, h.hostName, h.displayName, h.emailAddress, h.phoneNumber]
        .some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [data, search]);

  return (
    <Box sx={{ width: "100%", maxWidth: "xl", mx: "auto", px: 1, py: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111", mb: 0.5 }}>Host Users</Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
        Dashboard access for every host profile. Manage profiles &amp; trips under{" "}
        <Button size="small" sx={{ textTransform: "none", p: 0, minWidth: 0 }} onClick={() => navigate("/hosts")}>Hosts</Button>.
        &nbsp;“Active” = dashboard login enabled.
      </Typography>

      <TextField
        size="small" placeholder="Search name / email / phone"
        value={search} onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: 320, maxWidth: "100%" }}
        InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 20 }} /></InputAdornment>) }}
      />

      {isLoading ? (
        <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>
      ) : isError ? (
        <Alert severity="error" action={<Button onClick={refetch}>Retry</Button>}>Could not load host users.</Alert>
      ) : hosts.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>No host profiles found.</Box>
      ) : (
        <>
          <Typography sx={{ fontSize: 12.5, color: "#888", mb: 1 }}>{hosts.length} host profile(s)</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#F3F4F6" }}>
                  {["Name", "Email", "Phone", "Access", ""].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: 13, color: "#667085" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {hosts.map((h) => {
                  const acc = accessOf(h);
                  return (
                    <TableRow key={h._id} hover>
                      <TableCell sx={{ fontSize: 13 }}>{h.hostTitle || h.hostName || h.displayName || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{h.emailAddress || "—"}</TableCell>
                      <TableCell sx={{ fontSize: 13 }}>{h.phoneNumber || h.altPhone || "Not provided"}</TableCell>
                      <TableCell>
                        <Chip size="small" label={acc.label} color={acc.color} variant={acc.variant} />
                      </TableCell>
                      <TableCell>
                        <Button size="small" sx={{ textTransform: "none" }} onClick={() => navigate(`/hosts/edit/${h._id}`)}>
                          View in Hosts
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default HostUsers;
