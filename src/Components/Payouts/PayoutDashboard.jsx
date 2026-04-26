import { Box, Grid, Typography } from "@mui/material";
import GenericCard from "../../smallComponents/GenericCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const PayoutDashboard = () => {
  // Mock data - replace with actual API data
  const payoutStats = {
    totalPayouts: 128476.65,
    pendingPayouts: 28049.15,
    totalCommission: 22672.35,
    completedPayouts: 2,
  };

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
