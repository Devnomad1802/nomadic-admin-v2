import { useState } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Chip, CircularProgress, Alert, TextField, InputAdornment, TablePagination, FormControlLabel,
  Switch, Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/Close";
import {
  useGetHostConversationsQuery,
  useLazyGetHostConversationQuery,
} from "../Redux/services/hostMessagesApi";

const RUST = "#CD482A";
const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

// Admin monitoring of on-platform host<->traveller chat. Read-only. Contact
// sharing is blocked at send time (never stored); flagged = moderation history.
const HostMessages = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [flagged, setFlagged] = useState(false);

  const { data, isLoading, isError, refetch } = useGetHostConversationsQuery({
    page: page + 1, limit: rowsPerPage, search, flagged,
  });
  const rows = data?.data || [];
  const total = data?.total || 0;

  const [loadThread, { data: thread, isFetching: threadLoading }] = useLazyGetHostConversationQuery();
  const [open, setOpen] = useState(false);

  const openThread = (id) => { setOpen(true); loadThread(id); };

  return (
    <Box sx={{ width: "100%", maxWidth: "xl", mx: "auto", px: 1, py: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111", mb: 0.5 }}>Host Messages</Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
        On-platform conversations between travellers and hosts (monitored for safety; contact-sharing is blocked automatically).
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small" placeholder="Search customer / email / trip"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ width: 320, maxWidth: "100%" }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 20 }} /></InputAdornment>) }}
        />
        <FormControlLabel
          control={<Switch checked={flagged} onChange={(e) => { setFlagged(e.target.checked); setPage(0); }} />}
          label="Flagged only"
        />
      </Box>

      {isLoading ? (
        <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>
      ) : isError ? (
        <Alert severity="error" action={<span onClick={refetch} style={{ cursor: "pointer", textDecoration: "underline" }}>Retry</span>}>Could not load conversations.</Alert>
      ) : rows.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "#888" }}>No conversations found.</Box>
      ) : (
        <>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#F3F4F6" }}>
                  {["Customer", "Host", "Trip", "Last message", "When", "Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: 13, color: "#667085" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c._id} hover sx={{ cursor: "pointer" }} onClick={() => openThread(c._id)}>
                    <TableCell sx={{ fontSize: 13 }}>
                      {c.customerName}<br /><span style={{ color: "#888", fontSize: 12 }}>{c.customerEmail}</span>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{c.hostName}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{c.tripName}</TableCell>
                    <TableCell sx={{ fontSize: 13, color: "#555", maxWidth: 280 }}>{c.lastMessage || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{fmt(c.lastAt)}</TableCell>
                    <TableCell>
                      {c.flagged && <Chip size="small" label="Flagged" color="error" variant="outlined" sx={{ mr: 0.5 }} />}
                      {c.unread > 0 && <Chip size="small" label={`${c.unread} unread`} color="warning" variant="outlined" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={total} page={page}
            onPageChange={(e, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[20, 50, 100]}
          />
        </>
      )}

      {/* Thread viewer */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 6 }}>
          {thread?.data ? `${thread.data.customer?.name} ↔ ${thread.data.hostName}` : "Conversation"}
          <Typography sx={{ fontSize: 12.5, color: "#888" }}>{thread?.data?.tripName}</Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ position: "absolute", right: 8, top: 8 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {threadLoading || !thread?.data ? (
            <Box sx={{ p: 3, textAlign: "center" }}><CircularProgress size={22} /></Box>
          ) : (
            <>
              {thread.data.flagged && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Moderation flags: {thread.data.moderation?.violations || 0} contact-sharing attempt(s).
                </Alert>
              )}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                {thread.data.messages.map((m, i) => {
                  const host = `${m.by}`.toLowerCase() === "host";
                  return (
                    <Box key={i} sx={{ alignSelf: host ? "flex-start" : "flex-end", maxWidth: "80%" }}>
                      <Box sx={{
                        background: host ? "#F1EADD" : "#FDECE6", color: "#221C17",
                        borderRadius: 2, px: 1.5, py: 1, fontSize: 14,
                      }}>{m.text}</Box>
                      <Typography sx={{ fontSize: 11, color: "#9b9b9b", mt: 0.3, textAlign: host ? "left" : "right" }}>
                        {host ? "Host" : "Customer"} · {fmt(m.at)}
                      </Typography>
                    </Box>
                  );
                })}
                {thread.data.messages.length === 0 && (
                  <Typography sx={{ color: "#888", textAlign: "center", py: 2 }}>No messages.</Typography>
                )}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontSize: 12, color: "#888" }}>
                Customer: {thread.data.customer?.email} · {thread.data.customer?.phone}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default HostMessages;
