import { Box } from "@mui/material";
import PayoutTable from "../Components/Payouts/PayoutTable";
import PayoutDashboard from "../Components/Payouts/PayoutDashboard";

const Payouts = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <PayoutDashboard />
      <PayoutTable />
    </Box>
  );
};

export default Payouts;
