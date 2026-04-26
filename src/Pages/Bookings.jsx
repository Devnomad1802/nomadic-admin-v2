import { Box, Container } from "@mui/material";
import BookingTable from "../Components/Booking/BookingTable";

const Bookings = () => {
  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        px: 1,
        maxWidth: "xl",
      }}
    >
      <BookingTable />
    </Box>
  );
};
export default Bookings;
