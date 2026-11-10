import { Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, Chip, Button, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "../Redux/services";

// Host LOGIN identities (role "Host") — distinct from the Hosts section, which
// manages host profiles/trips/onboarding. No PAN/GST/bank/token data shown.
const HostUsers = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetUsersQuery({ role: "host" });
  const users = data?.users || [];

  return (
    <Box sx={{ width: "100%", maxWidth: "xl", mx: "auto", px: 1, py: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111", mb: 0.5 }}>Host Users</Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
        Host dashboard login accounts. Manage host profiles &amp; trips under{" "}
        <Button size="small" sx={{ textTransform: "none", p: 0, minWidth: 0 }} onClick={() => navigate("/hosts")}>Hosts</Button>.
      </Typography>

      {isLoading ? (
        <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>
      ) : isError ? (
        <Alert severity="error" action={<Button onClick={refetch}>Retry</Button>}>Could not load host users.</Alert>
      ) : users.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>No host login accounts yet.</Box>
      ) : (
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
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell sx={{ fontSize: 13 }}>{u.name || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{u.email || "—"}</TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{u.phone || "—"}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={u.isVerified ? "Active" : "Not activated"}
                      color={u.isVerified ? "success" : "default"}
                      variant={u.isVerified ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell>
                    <Button size="small" sx={{ textTransform: "none" }} onClick={() => navigate("/hosts")}>View in Hosts</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HostUsers;
