import { useState, useMemo } from "react";
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper,
  Chip, CircularProgress, Alert, TextField, InputAdornment, TablePagination, FormControlLabel,
  Switch, Dialog, DialogTitle, DialogContent, IconButton, Divider, Select, MenuItem,
  FormControl, InputLabel,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseIcon from "@mui/icons-material/Close";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import RichMessage from "../Components/common/RichMessage";
import {
  useGetHostConversationsQuery,
  useLazyGetHostConversationQuery,
} from "../Redux/services/hostMessagesApi";
import { useGetAllHostsQuery } from "../Redux/services/hostsApi";

const RUST = "#CD482A";
const fmt = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

// Admin monitoring of on-platform host<->traveller chat. Read-only, host-centric:
// pick a host to track every conversation they are having with travellers.
// Contact sharing is blocked at send time (never stored); flagged = moderation history.
const HostMessages = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [search, setSearch] = useState("");
  const [flagged, setFlagged] = useState(false);
  const [hostId, setHostId] = useState(""); // "" = all hosts

  // Host list for the filter dropdown.
  const { data: hostsRaw } = useGetAllHostsQuery();
  const hosts = useMemo(() => {
    const list = Array.isArray(hostsRaw?.data) ? hostsRaw.data : Array.isArray(hostsRaw) ? hostsRaw : [];
    return list
      .map((h) => ({ id: h._id, name: h.hostTitle || h.hostName || h.displayName || "Unnamed host" }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [hostsRaw]);
  const selectedHost = hosts.find((h) => h.id === hostId);

  const { data, isLoading, isError, refetch } = useGetHostConversationsQuery({
    page: page + 1, limit: rowsPerPage, search, flagged, hostId,
  });
  const rows = data?.data || [];
  const total = data?.total || 0;

  const [loadThread, { data: thread, isFetching: threadLoading }] = useLazyGetHostConversationQuery();
  const [open, setOpen] = useState(false);
  const [histOpen, setHistOpen] = useState({}); // messageIndex -> bool
  const openThread = (id) => { setOpen(true); setHistOpen({}); loadThread(id); };

  return (
    <Box sx={{ width: "100%", maxWidth: "xl", mx: "auto", px: 1, py: 2 }}>
      <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111", mb: 0.5 }}>Host Messages</Typography>
      <Typography sx={{ fontSize: 14, color: "#666", mb: 2 }}>
        Track every on-platform conversation a host is having with travellers. Read-only; contact-sharing is blocked automatically.
      </Typography>

      {/* Filter bar — host first (host-centric) */}
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
        <FormControl size="small" sx={{ minWidth: 240 }}>
          <InputLabel id="host-filter-label">Host</InputLabel>
          <Select
            labelId="host-filter-label" label="Host" value={hostId}
            onChange={(e) => { setHostId(e.target.value); setPage(0); }}
          >
            <MenuItem value=""><em>All hosts</em></MenuItem>
            {hosts.map((h) => (<MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>))}
          </Select>
        </FormControl>
        <TextField
          size="small" placeholder="Search customer / email / trip"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          sx={{ width: 300, maxWidth: "100%" }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 20 }} /></InputAdornment>) }}
        />
        <FormControlLabel
          control={<Switch checked={flagged} onChange={(e) => { setFlagged(e.target.checked); setPage(0); }} />}
          label="Flagged only"
        />
      </Box>

      {/* Context heading */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <ForumRoundedIcon sx={{ fontSize: 18, color: RUST }} />
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333" }}>
          {selectedHost ? `${selectedHost.name} · ${total} conversation${total === 1 ? "" : "s"}` : `All hosts · ${total} conversation${total === 1 ? "" : "s"}`}
        </Typography>
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
                  {["Host", "Customer", "Trip", "Last message", "Msgs", "When", "Status"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: 13, color: "#667085" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c._id} hover sx={{ cursor: "pointer" }} onClick={() => openThread(c._id)}>
                    <TableCell sx={{ fontSize: 13, fontWeight: 600, color: "#221C17" }}>{c.hostName}</TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {c.customerName}<br /><span style={{ color: "#888", fontSize: 12 }}>{c.customerEmail}</span>
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>{c.tripName}</TableCell>
                    <TableCell sx={{ fontSize: 13, color: "#555", maxWidth: 260 }}>{c.lastMessage || "—"}</TableCell>
                    <TableCell sx={{ fontSize: 13, color: "#555" }}>{c.messageCount ?? "—"}</TableCell>
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
          {thread?.data ? `${thread.data.hostName} ↔ ${thread.data.customer?.name}` : "Conversation"}
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
                  const hist = m.history || [];
                  return (
                    <Box key={i} sx={{ alignSelf: host ? "flex-start" : "flex-end", maxWidth: "82%" }}>
                      <Box sx={{
                        background: m.deleted ? "#F3F4F6" : host ? "#F1EADD" : "#FDECE6",
                        color: m.deleted ? "#8a8a8a" : "#221C17",
                        border: m.deleted ? "1px dashed #d0d0d0" : "none",
                        fontStyle: m.deleted ? "italic" : "normal",
                        borderRadius: 2, px: 1.5, py: 1, fontSize: 14,
                      }}>
                        {m.deleted
                          ? `Deleted by ${m.deletedBy || "host"}: "${m.text}"`
                          : <RichMessage text={m.text} />}
                      </Box>
                      <Box sx={{ display: "flex", gap: 0.8, alignItems: "center", mt: 0.3, justifyContent: host ? "flex-start" : "flex-end", flexWrap: "wrap" }}>
                        <Typography sx={{ fontSize: 11, color: "#9b9b9b" }}>
                          {host ? "Host" : "Customer"} · {fmt(m.at)}
                        </Typography>
                        {m.edited && !m.deleted && <Chip size="small" label="Edited" variant="outlined" sx={{ height: 18, fontSize: 10 }} />}
                        {m.deleted && <Chip size="small" color="error" label="Deleted" variant="outlined" sx={{ height: 18, fontSize: 10 }} />}
                        {hist.length > 0 && (
                          <Box
                            component="span" onClick={() => setHistOpen((s) => ({ ...s, [i]: !s[i] }))}
                            sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, fontSize: 10.5, color: RUST, cursor: "pointer" }}
                          >
                            <HistoryRoundedIcon sx={{ fontSize: 13 }} /> {histOpen[i] ? "Hide" : "View"} history ({hist.length})
                          </Box>
                        )}
                      </Box>
                      {histOpen[i] && hist.length > 0 && (
                        <Box sx={{ mt: 0.6, pl: 1, borderLeft: "2px solid #E6DDCF" }}>
                          {hist.map((h, hi) => (
                            <Box key={hi} sx={{ mb: 0.6 }}>
                              <Typography sx={{ fontSize: 10.5, color: "#9b9b9b" }}>
                                {h.action === "delete" ? "Deleted" : "Before edit"} · {h.editorRole} · {fmt(h.at)}
                              </Typography>
                              <Typography sx={{ fontSize: 12.5, color: "#555", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{h.text}</Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
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
