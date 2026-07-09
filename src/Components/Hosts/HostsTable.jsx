import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import KeyIcon from "@mui/icons-material/Key";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  Box,
  Chip,
  // FormControlLabel,
  IconButton,
  InputAdornment,
  // Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useActivateHostMutation,
  useDeleteHostMutation,
  useGetAllHostsQuery,
  useUpdateStatusMutation,
} from "../../Redux/services/hostsApi";
import GenericDeleteModal from "../../smallComponents/GenericDeleteModal";
import Toastify from "../../smallComponents/Toastify";

const HostsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // RTK Query hooks
  const { data: hosts = [], isLoading, error } = useGetAllHostsQuery();
  const [updateStatus] = useUpdateStatusMutation();
  const [deleteHost] = useDeleteHostMutation();
  const [activateHost, { isLoading: activating }] = useActivateHostMutation();

  // Approve + create/link the host's dashboard login + email credentials.
  const handleActivate = async (host) => {
    try {
      const res = await activateHost(host._id).unwrap();
      const pw = res?.data?.tempPassword;
      setAlertState({
        open: true,
        type: res?.data?.emailSent ? "success" : "warning",
        message: pw
          ? `Activated. Email failed — share manually: ${host.emailAddress} / ${pw}`
          : res?.message || "Host activated.",
      });
    } catch (err) {
      setAlertState({
        open: true,
        type: "error",
        message: err?.data?.message || "Activation failed.",
      });
    }
  };

  // Handle status toggle. Rejection asks for a reason — it is shown to the
  // host in their dashboard verification banner.
  const handleStatusToggle = async (hostId, currentStatus) => {
    try {
      const newStatus = currentStatus === "approved" ? "rejected" : "approved";
      let rejectionReason;
      if (newStatus === "rejected") {
        rejectionReason = window.prompt("Reason for rejection (shown to the host):") || "";
      }
      await updateStatus({ id: hostId, status: newStatus, rejectionReason }).unwrap();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle host deletion
  const handleDeleteHost = async (hostId) => {
    return await deleteHost(hostId).unwrap();
  };

  // Filter hosts based on search term
  const filteredHosts = hosts?.data?.filter(
    (host) =>
      host.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "#00C30F";
      case "pending":
        return "#FFA500";
      case "rejected":
        return "#FF0000";
      default:
        return "#6D7280";
    }
  };

  const getStatusChip = (status) => (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      sx={{
        backgroundColor: getStatusColor(status),
        color: "white",
        fontSize: "12px",
        fontWeight: 500,
      }}
    />
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Loading hosts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography color="error">
          Error loading hosts. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
         
          sx={{
            color: "#393938",
            fontFamily: "Ubuntu",
            fontSize: "19px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          All Hosts ({filteredHosts.length})
        </Typography>
        <TextField
          placeholder="Search hosts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: "#737373" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "300px",
            "& .MuiOutlinedInput-root": {
              background: "#fff",
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Hosts Table */}
      <TableContainer
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ background: "#F8F9FA" }}>
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Host Name
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Contact Info
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Location
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#393938", width: "200px" }}>
                Specialties
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Commission
              </TableCell>
              {/* <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Status
              </TableCell> */}
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Verification
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#393938" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHosts.map((host) => (
              <TableRow key={host._id} hover>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontWeight: 500, color: "#393938" }}>
                      {host.hostName}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#737373" }}>
                      PAN: {host.panNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#393938" }}>
                      {host.emailAddress}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#737373" }}>
                      {host.phoneNumber}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography sx={{ fontSize: "14px", color: "#393938" }}>
                      {host.city}, {host.state}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#737373" }}>
                      {host.location}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {host.specialties.slice(0, 1).map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        sx={{
                          backgroundColor: "#E7E7E7",
                          color: "#393938",
                          fontSize: "10px",
                        }}
                      />
                    ))}
                    {host.specialties.length > 1 && (
                      <Chip
                        label={`+${host.specialties.length - 1}`}
                        size="small"
                        sx={{
                          backgroundColor: "#EC3F18",
                          color: "white",
                          fontSize: "10px",
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "#EC3F18", fontWeight: 500 }}>
                    {host.commissionRate}%
                  </Typography>
                </TableCell>
                {/* <TableCell>{getStatusChip(host.status)}</TableCell> */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {/* <FormControlLabel
                      control={
                        <Switch
                          checked={host.isVerified}
                          onChange={() =>
                            handleStatusToggle(host._id, host.status)
                          }
                          sx={{
                            "& .MuiSwitch-switchBase.Mui-checked": {
                              color: "#EC3F18",
                            },
                            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                              {
                                backgroundColor: "#EC3F18",
                              },
                          }}
                        />
                      }
                      label=""
                    /> */}
                    <Chip
                      label={host.isVerified ? "Verified" : "Unverified"}
                      size="small"
                      sx={{
                        backgroundColor: host.isVerified
                          ? "#00C30F"
                          : "#FFA500",
                        color: "white",
                        fontSize: "10px",
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title={host.user ? "Dashboard login active" : "Activate host login (approve + email credentials)"}>
                      <span>
                        <IconButton
                          size="small"
                          disabled={!!host.user || activating}
                          onClick={() => handleActivate(host)}
                          sx={{ color: host.user ? "#22C55E" : "#3B82F6" }}
                        >
                          <KeyIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="Edit Host">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/hosts/edit/${host._id}`)
                        }
                        sx={{ color: "#EC3F18" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Manage Reviews">
                      <IconButton
                        size="small"
                        onClick={() =>
                          navigate(`/hosts/${host._id}/reviews`)
                        }
                        sx={{ color: "#393938" }}
                      >
                        <RateReviewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Host">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedHost(host);
                          setDeleteModalOpen(true);
                        }}
                        sx={{ color: "#FF0000" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Modal */}
      <GenericDeleteModal
        delModal={deleteModalOpen}
        setDelModal={setDeleteModalOpen}
        itemId={selectedHost?._id}
        onDelete={handleDeleteHost}
        entityType="host"
        itemName={selectedHost?.hostName}
      />

      {/* Toast Notifications */}
      <Toastify setAlertState={setAlertState} alertState={alertState} />
    </Box>
  );
};

export default HostsTable;
