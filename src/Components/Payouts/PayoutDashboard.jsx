import { Box, Grid, Typography } from "@mui/material";
import GenericCard from "../../smallComponents/GenericCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useGetPayoutQuery } from "../../Redux/services/payoutApi";

// Per-booking payout/commission (mirrors PayoutTable.calculatePayoutDetails).
const parseJson = (s) => { try { return JSON.parse(s); } catch { return null; } };
const calcPayout = (b) => {
  const pd = parseJson(b?.paymentDetail);
  const cd = parseJson(b?.cardData);
  const totalAmount = (cd && cd.AmountTotal) || b?.total || 0;
  const rate = pd && pd.commissionRate ? parseFloat(pd.commissionRate) : 15;
  const commission = (totalAmount * rate) / 100;
  return { commission, payoutAmount: totalAmount - commission };
};

const PayoutDashboard = () => {
  // Real data: full-payment bookings eligible for host payout.
  const { data: payoutData } = useGetPayoutQuery();
  const rows = Array.isArray(payoutData) ? payoutData : payoutData?.data || [];

  const payoutStats = rows.reduce(
    (a, b) => {
      const { commission, payoutAmount } = calcPayout(b);
      const processed = b?.payoutId?.razorpayStatus === "processed";
      a.totalCommission += commission;
      if (processed) {
        a.totalPayouts += payoutAmount;
        a.completedPayouts += 1;
      } else {
        a.pendingPayouts += payoutAmount;
      }
      return a;
    },
    { totalPayouts: 0, pendingPayouts: 0, totalCommission: 0, completedPayouts: 0 }
  );

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const cardData = [
    {
      value: formatCurrency(payoutStats.totalPayouts),
      label: "Total Payouts",
      icon: AttachMoneyIcon,
      iconColor: "#2196F3", // Blue
      valueColor: "#393938",
      labelColor: "#737373",
    },
    {
      value: formatCurrency(payoutStats.pendingPayouts),
      label: "Pending Payouts",
      icon: AccessTimeIcon,
      iconColor: "#FFA500", // Orange/Yellow
      valueColor: "#393938",
      labelColor: "#737373",
    },
    {
      value: formatCurrency(payoutStats.totalCommission),
      label: "Total Commission",
      icon: AccountBalanceWalletIcon,
      iconColor: "#00C30F", // Green
      valueColor: "#393938",
      labelColor: "#737373",
    },
    {
      value: payoutStats.completedPayouts.toString(),
      label: "Completed Payouts",
      icon: CheckCircleIcon,
      iconColor: "#00C30F", // Green
      valueColor: "#393938",
      labelColor: "#737373",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        sx={{
            color: "#393938",
            fontFamily: "Ubuntu",
            fontSize: "19px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
            mb: 3,
          }}
      >
        Payout Overview
      </Typography>
      
      <Grid container spacing={3}>
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <GenericCard
              value={card.value}
              label={card.label}
              icon={card.icon}
              iconColor={card.iconColor}
              valueColor={card.valueColor}
              labelColor={card.labelColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PayoutDashboard;
