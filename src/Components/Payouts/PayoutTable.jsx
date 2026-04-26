import { useState } from "react";
import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorIcon from "@mui/icons-material/Error";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Toastify from "../../smallComponents/Toastify";
import {
  useGetPayoutQuery,
  useProcessPayoutMutation,
} from "../../Redux/services/payoutApi";

const PayoutTable = () => {
  const { data: payoutData, isLoading, error } = useGetPayoutQuery();
  const [processPayout] = useProcessPayoutMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [processingPayoutId, setProcessingPayoutId] = useState(null);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    type: "info",
  });

  // Debug logging
  console.log("payoutData structure:", payoutData);
  console.log("payoutData type:", typeof payoutData);
  console.log("isArray:", Array.isArray(payoutData));

  // Helper function to parse JSON data safely
  const parseJsonSafely = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  // Helper function to calculate commission and payout amount
  const calculatePayoutDetails = (payout) => {
    const paymentDetail = parseJsonSafely(payout.paymentDetail);
    const cardData = parseJsonSafely(payout.cardData);

    if (!paymentDetail || !cardData) {
      return {
        tripName: "Unknown Trip",
        hostName: "Unknown Host",
        totalAmount: payout.total || 0,
        commission: 0,
        payoutAmount: payout.total || 0,
        commissionRate: 0,
      };
    }

    const totalAmount = cardData.AmountTotal || payout.total || 0;
    const commissionRate = paymentDetail.commissionRate
      ? parseFloat(paymentDetail.commissionRate)
      : 15; // Default 15%
    const commission = (totalAmount * commissionRate) / 100;
    const payoutAmount = totalAmount - commission;

    return {
      tripName: paymentDetail.title || "Unknown Trip",
      hostName: paymentDetail.host?.hostName || "Unknown Host",
      totalAmount,
      commission,
      payoutAmount,
      commissionRate,
    };
  };

  // Process payouts data - handle different data structures
  const processedPayouts = (() => {
    if (!payoutData) {
      console.log("No payoutData available");
      return [];
    }

    // Handle different possible data structures
    let dataArray = [];

    if (Array.isArray(payoutData)) {
      dataArray = payoutData;
      console.log("Data is direct array with", dataArray.length, "items");
    } else if (payoutData.data && Array.isArray(payoutData.data)) {
      dataArray = payoutData.data;
      console.log(
        "Data found in payoutData.data with",
        dataArray.length,
        "items"
      );
    } else if (payoutData.payouts && Array.isArray(payoutData.payouts)) {
      dataArray = payoutData.payouts;
      console.log(
        "Data found in payoutData.payouts with",
        dataArray.length,
        "items"
      );
    } else if (payoutData.results && Array.isArray(payoutData.results)) {
      dataArray = payoutData.results;
      console.log(
        "Data found in payoutData.results with",
        dataArray.length,
        "items"
      );
    } else {
      console.warn("Unexpected payoutData structure:", payoutData);
      console.log("Available keys:", Object.keys(payoutData || {}));
      return [];
    }

    if (dataArray.length === 0) {
      console.log("No data items found in array");
      return [];
    }

    try {
      return dataArray
        .map((payout, index) => {
          try {
            const details = calculatePayoutDetails(payout);
            const cardData = parseJsonSafely(payout.cardData);

            return {
              _id: payout._id || `unknown-${index}`,
              bookingId: payout.bookingId || "N/A",
              tripName: details.tripName,
              bookedDate: payout.DateOfBooking
                ? new Date(payout.DateOfBooking).toLocaleDateString()
                : "N/A",
              hostName: details.hostName,
              hostId: payout.userId || "N/A",
              totalAmount: details.totalAmount,
              commission: details.commission,
              payoutAmount: details.payoutAmount,
              commissionRate: details.commissionRate,
              status:
                payout.paymentStatus === "fullPayment" ? "paid" : "pending",
              payoutDate:
                payout.paymentStatus === "fullPayment" && payout.DateOfBooking
                  ? new Date(payout.DateOfBooking).toLocaleDateString()
                  : null,
              payoutId: payout.payoutId || null, // Keep the original payoutId object
              payoutIdString: payout.bookingId || "N/A", // For display purposes
              travelers: cardData?.numberOfTravelers || 1,
              gstTax: cardData?.gstTax || 0,
              coupenDiscount: payout.coupenDiscount || 0,
              userName: payout.userName || "N/A",
              email: payout.email || "N/A",
              phone: payout.phone || "N/A",
            };
          } catch (itemError) {
            console.error(
              `Error processing payout item ${index}:`,
              itemError,
              payout
            );
            return null;
          }
        })
        .filter((item) => item !== null); // Remove any null items from errors
    } catch (mapError) {
      console.error("Error mapping payout data:", mapError);
      return [];
    }
  })();

  // Filter payouts based on search term, status, and date
  const filteredPayouts = processedPayouts.filter((payout) => {
    // Search filter
    const matchesSearch =
      payout.payoutIdString?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.tripName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.userName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || payout.status === statusFilter;

    // Date filter
    const matchesDate = !dateFilter || payout.bookedDate.includes(dateFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
      case "processed":
        return "#00C30F";
      case "pending":
        return "#FFA500";
      case "processing":
        return "#2196F3";
      case "failed":
        return "#F44336";
      case "unpaid":
        return "#FF0000";
      default:
        return "#6D7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
      case "processed":
        return <CheckCircleIcon sx={{ fontSize: "16px" }} />;
      case "pending":
        return <AccessTimeIcon sx={{ fontSize: "16px" }} />;
      case "processing":
        return <AccessTimeIcon sx={{ fontSize: "16px" }} />;
      case "failed":
        return <ErrorIcon sx={{ fontSize: "16px" }} />;
      case "unpaid":
        return <ErrorIcon sx={{ fontSize: "16px" }} />;
      default:
        return null;
    }
  };

  const getStatusChip = (status) => (
    <Chip
      icon={getStatusIcon(status)}
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      sx={{
        backgroundColor: getStatusColor(status),
        color: "white",
        fontSize: "12px",
        fontWeight: 500,
        height: "28px",
        borderRadius: "14px",
        "& .MuiChip-icon": {
          color: "white",
          fontSize: "14px",
        },
        "& .MuiChip-label": {
          px: 1.5,
        },
      }}
    />
  );

  const handleProcessPayout = async (payoutid, bookingId) => {
    setProcessingPayoutId(bookingId); // Set the specific payout being processed
    try {
      console.log("Processing payout with bookingId:", bookingId, bookingId);
      const response = await processPayout({ bookingId }).unwrap();
      console.log("response...", response);
      setAlertState({
        open: true,
        message: "Payout processed successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error processing payout:", error);
      setAlertState({
        open: true,
        message: error?.data?.message || "Failed to process payout",
        type: "error",
      });
    } finally {
      setProcessingPayoutId(null); // Clear the processing state
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting payouts data...");
    setAlertState({
      open: true,
      message: "Export functionality will be implemented",
      type: "info",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error loading payouts: {error.message || "Something went wrong"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: "100%", overflow: "hidden" }}>
      {/* Header with Title */}
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            color: "#393938",
            fontFamily: "Ubuntu",
            fontSize: { xs: "20px", sm: "24px" },
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "140%",
            mb: 2,
          }}
        >
          All Payouts ({filteredPayouts.length})
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, sm: 3 },
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          p: { xs: 2, sm: 4 },
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #F3F4F6",
          justifyContent: { xs: "center", sm: "space-between" },
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3 },
            alignItems: "center",
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "center", sm: "flex-start" },
          }}
        >
          {/* Search Input */}
          <TextField
            placeholder="Search payouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: "#737373", fontSize: "20px" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: "100%", sm: "280px" },
              width: { xs: "100%", sm: "auto" },
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                color: "#393938",
                borderRadius: "8px",
                height: "44px",
                fontSize: "14px",
                "& fieldset": {
                  borderColor: "#E7E7E7",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3B82F6",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                "&::placeholder": {
                  color: "#9CA3AF",
                  opacity: 1,
                },
              },
            }}
          />

          {/* Status Dropdown */}
          <FormControl sx={{ minWidth: 140 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              displayEmpty
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                height: "44px",
                background: "#fff",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#393938",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E7E7E7",
                  borderWidth: "1px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3B82F6",
                  borderWidth: "2px",
                },
                "& .MuiSelect-select": {
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiSelect-icon": {
                  color: "#737373",
                  fontSize: "20px",
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "8px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "1px solid #E7E7E7",
                    marginTop: "4px",
                    "& .MuiMenuItem-root": {
                      fontSize: "14px",
                      color: "#393938",
                      padding: "12px 16px",
                      "&:hover": {
                        backgroundColor: "#F8F9FA",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "#EBF4FF",
                        color: "#3B82F6",
                        "&:hover": {
                          backgroundColor: "#DBEAFE",
                        },
                      },
                    },
                  },
                },
              }}
            >
              <MenuItem value="all" sx={{ fontWeight: 500 }}>
                All Status
              </MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
            </Select>
          </FormControl>

          {/* Date Picker */}
          <TextField
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon
                    sx={{ color: "#737373", fontSize: "20px" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: "160px",
              "& .MuiOutlinedInput-root": {
                background: "#fff",
                color: "#393938",
                borderRadius: "8px",
                height: "44px",
                fontSize: "14px",
                "& fieldset": {
                  borderColor: "#E7E7E7",
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: "#D1D5DB",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#3B82F6",
                  borderWidth: "2px",
                },
              },
              "& .MuiInputBase-input": {
                padding: "12px 14px",
                "&::-webkit-calendar-picker-indicator": {
                  color: "#737373",
                  fontSize: "18px",
                  cursor: "pointer",
                },
              },
            }}
          />
        </Box>

        {/* Export Button */}
        <Button
          variant="contained"
          startIcon={<DownloadIcon sx={{ fontSize: "18px" }} />}
          onClick={handleExport}
          sx={{
            background: "linear-gradient(135deg, #FF6B35 0%, #EC3F18 100%)",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            height: "44px",
            px: 3,
            fontSize: "14px",
            fontWeight: 500,
            boxShadow: "0px 2px 4px rgba(255, 107, 53, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #E55A2B 0%, #D6360E 100%)",
              boxShadow: "0px 4px 8px rgba(255, 107, 53, 0.4)",
              transform: "translateY(-1px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Export
        </Button>
      </Box>

      {/* Payouts Table */}
      <TableContainer
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
          overflow: "auto",
          maxHeight: "70vh",
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
            "&:hover": {
              background: "#a8a8a8",
            },
          },
        }}
      >
        <Table
          sx={{
            minWidth: 1600,
            tableLayout: "auto",
            width: "max-content",
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background: "#F8F9FA",
                height: "56px",
                "& .MuiTableCell-root": {
                  borderBottom: "1px solid #E7E7E7",
                },
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "180px",
                  minWidth: "180px",
                  whiteSpace: "nowrap",
                }}
              >
                Payout ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "150px",
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                }}
              >
                Booking ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "200px",
                  minWidth: "200px",
                  whiteSpace: "nowrap",
                }}
              >
                User ID
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "150px",
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                }}
              >
                Date of Booking
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "250px",
                  minWidth: "250px",
                  whiteSpace: "nowrap",
                }}
              >
                Booking Details
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "200px",
                  minWidth: "200px",
                  whiteSpace: "nowrap",
                }}
              >
                Host
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "220px",
                  minWidth: "220px",
                  whiteSpace: "nowrap",
                }}
              >
                Amount Breakdown
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "120px",
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "150px",
                  minWidth: "150px",
                  whiteSpace: "nowrap",
                }}
              >
                Payout Date
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: "#393938",
                  py: 2,
                  px: 3,
                  fontSize: "14px",
                  height: "56px",
                  verticalAlign: "middle",
                  width: "120px",
                  minWidth: "120px",
                  whiteSpace: "nowrap",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayouts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  sx={{
                    textAlign: "center",
                    py: 6,
                    px: 3,
                    height: "120px",
                    verticalAlign: "middle",
                  }}
                >
                  <Typography sx={{ color: "#737373", fontSize: "16px" }}>
                    No payouts found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredPayouts.map((payout, index) => (
                <TableRow
                  key={payout._id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: "#f8f9fa" },
                    height: "72px",
                    "& .MuiTableCell-root": {
                      borderBottom:
                        index === filteredPayouts.length - 1
                          ? "none"
                          : "1px solid #E7E7E7",
                      py: 2,
                      px: 3,
                      verticalAlign: "top",
                      height: "72px",
                    },
                  }}
                >
                  <TableCell sx={{ width: "180px", minWidth: "180px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          mb: 0.5,
                          wordBreak: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {payout.payoutIdString}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#737373",
                          wordBreak: "break-word",
                        }}
                      >
                        {payout._id.slice(-8)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "150px", minWidth: "150px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.bookingId}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "200px", minWidth: "200px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.userName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#737373",
                          wordBreak: "break-word",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {payout.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "150px", minWidth: "150px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.bookedDate}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "250px", minWidth: "250px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.tripName}
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarTodayIcon
                          sx={{ fontSize: "14px", color: "#737373" }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#737373",
                            wordBreak: "break-word",
                          }}
                        >
                          Travelers: {payout.travelers}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "200px", minWidth: "200px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: "#393938",
                          fontSize: "14px",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.hostName}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#737373",
                          wordBreak: "break-word",
                        }}
                      >
                        ({payout.hostId.slice(-8)})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "220px", minWidth: "220px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#393938",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        Total: {formatCurrency(payout.totalAmount)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#EC3F18",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        Commission: {formatCurrency(payout.commission)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#00C30F",
                          fontWeight: 500,
                          wordBreak: "break-word",
                        }}
                      >
                        Payout: {formatCurrency(payout.payoutAmount)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "120px", minWidth: "120px" }}>
                    <Box sx={{ pt: 1 }}>
                      {getStatusChip(
                        payout?.payoutId?.razorpayStatus || "unpaid"
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "150px", minWidth: "150px" }}>
                    <Box sx={{ pt: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          color: "#393938",
                          mb: 0.5,
                          wordBreak: "break-word",
                        }}
                      >
                        {payout.payoutDate || "-"}
                      </Typography>
                      {payout.payoutId?.payoutId && (
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#737373",
                            wordBreak: "break-word",
                          }}
                        >
                          {payout.payoutId.payoutId}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "120px", minWidth: "120px" }}>
                    <Box sx={{ pt: 1 }}>
                      {(() => {
                        const status =
                          payout?.payoutId?.razorpayStatus || "unpaid";
                        console.log("status...", status);

                        if (status === "paid" || status === "processed") {
                          return (
                            <Chip
                              icon={
                                <CheckCircleIcon sx={{ fontSize: "14px" }} />
                              }
                              label="Completed"
                              size="small"
                              sx={{
                                backgroundColor: "#00C30F20",
                                color: "#00C30F",
                                fontSize: "12px",
                                fontWeight: 500,
                                "& .MuiChip-icon": {
                                  color: "#00C30F",
                                },
                              }}
                            />
                          );
                        } else if (status === "processing") {
                          return (
                            <Button
                              variant="contained"
                              size="small"
                              disabled={true}
                              sx={{
                                backgroundColor: "#2196F3",
                                color: "white",
                                textTransform: "none",
                                fontSize: "12px",
                                borderRadius: "6px",
                                height: "32px",
                                px: 2,
                                "&:disabled": {
                                  backgroundColor: "#2196F3 !important",
                                  color: "white !important",
                                  opacity: 0.9,
                                  cursor: "disabled",
                                },
                              }}
                            >
                              Processing...
                            </Button>
                          );
                        } else if (status === "failed") {
                          return (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<SendIcon />}
                              onClick={() =>
                                handleProcessPayout(
                                  payout.bookingId,
                                  payout._id
                                )
                              }
                              disabled={processingPayoutId === payout._id}
                              sx={{
                                backgroundColor: "#FFA500",
                                color: "white",
                                textTransform: "none",
                                fontSize: "12px",
                                borderRadius: "6px",
                                height: "32px",
                                px: 2,
                                "&:hover": {
                                  backgroundColor: "#FF8C00",
                                },
                                "&:disabled": {
                                  backgroundColor: "#ccc",
                                },
                              }}
                            >
                              {processingPayoutId === payout._id
                                ? "Retrying..."
                                : "Retry"}
                            </Button>
                          );
                        } else {
                          // unpaid or pending
                          return (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<SendIcon />}
                              onClick={() =>
                                handleProcessPayout(
                                  payout.bookingId,
                                  payout._id
                                )
                              }
                              disabled={processingPayoutId === payout._id}
                              sx={{
                                backgroundColor: "#00C30F",
                                color: "white",
                                textTransform: "none",
                                fontSize: "12px",
                                borderRadius: "6px",
                                height: "32px",
                                px: 2,
                                "&:hover": {
                                  backgroundColor: "#00A00E",
                                },
                                "&:disabled": {
                                  backgroundColor: "#ccc",
                                },
                              }}
                            >
                              {processingPayoutId === payout._id
                                ? "Processing..."
                                : "Process"}
                            </Button>
                          );
                        }
                      })()}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Toast Notifications */}
      <Toastify setAlertState={setAlertState} alertState={alertState} />
    </Box>
  );
};

export default PayoutTable;
