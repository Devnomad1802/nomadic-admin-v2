/* eslint-disable react/prop-types */
import { Box, Button, Dialog, Grid, Slide, Typography, Chip } from "@mui/material";
import React, { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import SnowshoeingOutlinedIcon from "@mui/icons-material/SnowshoeingOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BusinessIcon from "@mui/icons-material/Business";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import html2pdf from "html2pdf.js";

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
export default function BookingModal({
  opens,
  setOpens,
  toggelModel, // eslint-disable-line no-unused-vars
  booking,
}) {
  const boxRef = useRef();

  const handleClose = () => setOpens(false);

  console.log("Booking .....,", booking);

  // Function to handle the download (can be added to a button later)
  // eslint-disable-next-line no-unused-vars
  const handleDownload = () => {
    const options = {
      margin: 1,
      filename: `booking-${booking?.bookingId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(boxRef.current).set(options).save();
  };

  // Calculate amounts
  // Try to get totalAmount from cardSectionData first, then fallback to paymentDetail.price
  const getTotalAmount = () => {
    if (booking?.cardData?.cardSectionData && booking?.cardData?.cardSectionData.length > 0) {
      const section = booking.cardData.cardSectionData[0];
      return Number(section.TitlePrice || section.titlePrice || 0) * (section.quantity || 1);
    }
    return Number(booking?.paymentDetail?.price || 0);
  };
  const totalAmount = getTotalAmount();
  const gstTax = Number(booking?.cardData?.gstTax || 0);
  const discount = Number(booking?.coupenDiscount || 0);
  const finalAmount = booking?.total || 0;

  const amountPaid = booking?.paymentStatus === "firstPayment"
    ? finalAmount
    : booking?.paymentStatus === "fullPayment"
      ? finalAmount
      : 0;

  const pendingAmount = booking?.paymentStatus === "firstPayment"
    ? totalAmount + gstTax - discount - finalAmount
    : 0;

  return (
    <Dialog
      open={opens}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="lg"
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "16px",
          p: 3,
          maxHeight: "90vh",
          backgroundColor: "#FAFAFA",
        },
      }}
    >
      <Box ref={boxRef}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#1F2937",
              fontFamily: "Ubuntu",
            }}
          >
            Booking Summary
          </Typography>
          <Button
            onClick={handleClose}
            sx={{
              minWidth: "auto",
              p: 0.5,
              color: "#6B7280",
              "&:hover": { backgroundColor: "#F3F4F6" },
            }}
          >
            <CloseIcon />
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Trip Details Card */}
            <Box
              sx={{
                backgroundColor: "#FFF5F0",
                borderRadius: "12px",
                p: 3,
                mb: 2,
                border: "1px solid #FFE4D6",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                {booking?.paymentDetail?.title || "Trip Details"}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "start", gap: 1, mb: 2 }}>
                <FmdGoodOutlinedIcon sx={{ fontSize: "20px", color: "#F97316", mt: 0.3 }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280", mb: 0.5 }}>
                    Destination
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.paymentDetail?.location || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "start", gap: 1, mb: 2 }}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: "20px", color: "#F97316", mt: 0.3 }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280", mb: 0.5 }}>
                    Travel Date
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.cardData?.cardDate?.batchDate
                      ? new Date(booking.cardData.cardDate.batchDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                        }
                      )
                      : "N/A"}
                    {booking?.cardData?.cardDate?.endSelectDate && (
                      <>
                        {" - "}
                        {new Date(booking.cardData.cardDate.endSelectDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "start", gap: 1, mb: 2 }}>
                <FmdGoodOutlinedIcon sx={{ fontSize: "20px", color: "#F97316", mt: 0.3 }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280", mb: 0.5 }}>
                    Pick Up/Drop Off
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.paymentDetail?.pickUp} - {booking?.paymentDetail?.dropOff}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
                <SnowshoeingOutlinedIcon sx={{ fontSize: "20px", color: "#F97316", mt: 0.3 }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280", mb: 0.5 }}>
                    Duration & Travelers
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.cardData?.cardDate?.numberOfDays || booking?.paymentDetail?.days}D/{booking?.paymentDetail?.nights}N • {booking?.cardData?.numberOfTravelers} Travelers
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Customer Details Card */}
            <Box
              sx={{
                backgroundColor: "#EFF6FF",
                borderRadius: "12px",
                p: 3,
                mb: 2,
                border: "1px solid #DBEAFE",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Customer Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PersonOutlineIcon sx={{ fontSize: "18px", color: "#3B82F6" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Name</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.userName}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <EmailOutlinedIcon sx={{ fontSize: "18px", color: "#3B82F6" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Email</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <PhoneOutlinedIcon sx={{ fontSize: "18px", color: "#3B82F6" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Phone</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    +{booking?.phone}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventAvailableIcon sx={{ fontSize: "18px", color: "#3B82F6" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Booking Date</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.DateOfBooking
                      ? new Date(booking.DateOfBooking).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Host Details Card */}
            <Box
              sx={{
                backgroundColor: "#F0FDF4",
                borderRadius: "12px",
                p: 3,
                border: "1px solid #DCFCE7",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Host Details
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <BusinessIcon sx={{ fontSize: "18px", color: "#10B981" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Host Name</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.paymentDetail?.host?.hostName || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <BadgeIcon sx={{ fontSize: "18px", color: "#10B981" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Host ID</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    {booking?.userId?.slice(-8) || "N/A"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletIcon sx={{ fontSize: "18px", color: "#10B981" }} />
                <Box>
                  <Typography sx={{ fontSize: "12px", color: "#6B7280" }}>Commission</Typography>
                  <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                    ₹{((totalAmount * (booking?.paymentDetail?.commissionRate || 15)) / 100).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* Payment Summary Card */}
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                p: 3,
                mb: 2,
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Payment Summary
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>Total Amount</Typography>
                <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                  ₹{totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>GST</Typography>
                <Typography sx={{ fontSize: "14px", color: "#1F2937", fontWeight: 500 }}>
                  ₹{gstTax.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>Discount</Typography>
                <Typography sx={{ fontSize: "14px", color: "#10B981", fontWeight: 500 }}>
                  -₹{discount.toFixed(0)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  pt: 2,
                  borderTop: "2px solid #E5E7EB",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: "16px", color: "#1F2937", fontWeight: 600 }}>
                  Final Amount
                </Typography>
                <Typography sx={{ fontSize: "18px", color: "#1F2937", fontWeight: 700 }}>
                  ₹{finalAmount.toFixed(0)}
                </Typography>
              </Box>

              {/* Amount Paid Section */}
              {amountPaid > 0 && (
                <Box
                  sx={{
                    backgroundColor: "#D1FAE5",
                    borderRadius: "8px",
                    p: 2,
                    mb: 2,
                    border: "1px solid #A7F3D0",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: "18px", color: "#10B981" }} />
                    <Typography sx={{ fontSize: "14px", color: "#065F46", fontWeight: 600 }}>
                      Amount Paid
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "20px", color: "#065F46", fontWeight: 700, mb: 0.5 }}>
                    ₹{amountPaid.toFixed(0)}
                  </Typography>
                  <Typography sx={{ fontSize: "12px", color: "#047857" }}>
                    Payment Type: {booking?.paymentStatus === "fullPayment" ? "Full Payment (100%)" : "Partial Payment (30%)"}
                  </Typography>
                </Box>
              )}

              {/* Pending Payment Section */}
              {pendingAmount > 0 && (
                <Box
                  sx={{
                    backgroundColor: "#FEF3C7",
                    borderRadius: "8px",
                    p: 2,
                    border: "1px solid #FDE68A",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: "18px", color: "#F59E0B" }} />
                    <Typography sx={{ fontSize: "14px", color: "#92400E", fontWeight: 600 }}>
                      Pending Payment
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "20px", color: "#92400E", fontWeight: 700, mb: 0.5 }}>
                    ₹{pendingAmount.toFixed(0)}
                  </Typography>
                  <Typography sx={{ fontSize: "11px", color: "#B45309" }}>
                    {booking?.cardData?.cardDate?.batchDate
                      ? `Due by: ${new Date(new Date(booking.cardData.cardDate.batchDate).getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                      : "Due date not available"}
                  </Typography>
                  <Typography sx={{ fontSize: "10px", color: "#B45309", mt: 0.5, fontStyle: "italic" }}>
                    * Must be paid 15 days before departure
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Payout Information Card */}
            <Box
              sx={{
                backgroundColor: "#F5F3FF",
                borderRadius: "12px",
                p: 3,
                mb: 2,
                border: "1px solid #EDE9FE",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Payout Information
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>Payout Status</Typography>
                <Chip
                  label={booking?.paymentStatus === "fullPayment" ? "Pending" : "Pending"}
                  size="small"
                  sx={{
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    fontSize: "11px",
                    fontWeight: 600,
                    height: "20px",
                  }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>Commission</Typography>
                <Typography sx={{ fontSize: "14px", color: "#7C3AED", fontWeight: 500 }}>
                  ₹{((totalAmount * (booking?.paymentDetail?.commissionRate || 15)) / 100).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: "14px", color: "#6B7280" }}>Host Payout</Typography>
                <Typography sx={{ fontSize: "14px", color: "#7C3AED", fontWeight: 500 }}>
                  ₹{(totalAmount - (totalAmount * (booking?.paymentDetail?.commissionRate || 15)) / 100).toFixed(2)}
                </Typography>
              </Box>
            </Box>

            {/* Booking Status Card */}
            <Box
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: "12px",
                p: 3,
                border: "1px solid #E5E7EB",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#1F2937",
                  mb: 2,
                }}
              >
                Booking Status
              </Typography>

              <Chip
                label={booking?.paymentStatus === "fullPayment" ? "CONFIRMED" : "PENDING"}
                sx={{
                  backgroundColor: booking?.paymentStatus === "fullPayment" ? "#D1FAE5" : "#FEF3C7",
                  color: booking?.paymentStatus === "fullPayment" ? "#065F46" : "#92400E",
                  fontSize: "14px",
                  fontWeight: 700,
                  height: "36px",
                  borderRadius: "8px",
                  px: 3,
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Footer Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3,
            pt: 3,
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "#F97316",
              color: "#FFFFFF",
              borderRadius: "8px",
              px: 4,
              py: 1,
              fontSize: "14px",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#EA580C",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
