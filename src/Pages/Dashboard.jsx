import { Box, Button, Grid, Typography } from "@mui/material";
import DashboardTable from "../Components/Dashboard/DashboardTable";
import { useGetUsersQuery } from "../Redux/services/authApis";
import { useGetAllHostsQuery } from "../Redux/services/hostsApi";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBookingQuery,
  useGetAllEnquriesQuery,
  useGetTripsQuery,
  useGetPlatformRevenueQuery,
} from "../Redux/services";
import DeleteModel from "../smallComponents/DeleteModal";

// Indian-format INR, no decimals (₹1,70,000). Paise handled server-side.
const inr = (rupees) =>
  "₹" + Math.round(Number(rupees) || 0).toLocaleString("en-IN");

const Dashboard = () => {
  // Total Hosts = unique host PROFILES in the Hosts module (includeHidden=true
  // → counts hidden + pending too), not host login identities. pagination
  // .totalItems is the authoritative full count, unaffected by page size.
  const { error, isLoading, data: hostsRes } = useGetAllHostsQuery();
  // Customers = non-admin, non-host accounts; server `total` from the
  // role-scoped query (not capped by the users endpoint's pagination).
  const { data: customersRes } = useGetUsersQuery({ role: "customer" });

  const { data: enquir } = useGetAllEnquriesQuery({ range: "All" });
  const { data: bookings } = useGetAllBookingQuery();
  const { data: trips } = useGetTripsQuery();
  const { data: revenueRes } = useGetPlatformRevenueQuery();

  const hostCount = hostsRes?.pagination?.totalItems;
  const customerCount = customersRes?.total;

  // Bookings endpoint is paginated — `data` is one page, `totalTrips` is the
  // true count. Enquiries + Trips endpoints return the full list.
  const bookingCount = bookings?.totalTrips ?? bookings?.total ?? bookings?.data?.length;
  const enquiries = enquir?.data ?? [];

  // Platform revenue = earned commission (rupees) computed server-side; ₹0 when
  // there are no qualifying paid bookings (never a placeholder).
  const revenueRupees = revenueRes?.data?.revenue;

  const loading = isLoading;
  const dash = (v) => (loading ? "…" : error ? "—" : v ?? 0);
  const dashMoney = (v) => (loading ? "…" : error ? "—" : inr(v ?? 0));

  const navigate = useNavigate();
  const array = [
    { heading: "Total Bookings", text: dash(bookingCount), link: "/bookings" },
    { heading: "Total Trips", text: dash(trips?.data?.length), link: "/trip" },
    { heading: "Total Hosts", text: dash(hostCount), link: "/hosts" },
    { heading: "Total Customers", text: dash(customerCount), link: "/user" },
    { heading: "Total Enquiries", text: dash(enquiries.length), link: "/enquire" },
    { heading: "Total Revenue", text: dashMoney(revenueRupees), link: "/analytics" },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        px: 1,
        maxWidth: "xl",
      }}
    >
      <Grid container spacing={2}>
        {array.map(({ heading, text, link }, index) => (
          <Grid item key={index} xs={6} sm={4} lg={2}>
            <Box
              onClick={() => link && navigate(link)}
              sx={{
                color: "#000",
                border: "2px solid #E5E7EB",
                background: "#F8F8F8",
                width: "100%",
                height: "110px",
                borderRadius: "16px",
                cursor: link ? "pointer" : "default",
                transition: "border-color .15s, box-shadow .15s",
                "&:hover": link ? { borderColor: "#CD482A", boxShadow: "0 2px 10px rgba(0,0,0,.06)" } : {},
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    color: "#3E92CC",
                    fontFamily: "Ubuntu",
                    fontSize: { xs: "13px", md: "15px" },
                    fontWeight: 400,
                    lineHeight: "130%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {heading}
                </Typography>
                <Typography
                  sx={{
                    color: "#7DCD85",
                    fontFamily: "Ubuntu",
                    fontSize: { xs: "22px", md: "30px" },
                    fontWeight: 500,
                    lineHeight: "130%",
                    mt: 1,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {text}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 4,
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
          Todays Bookings
        </Typography>
        <Button
          sx={{
            color: "#EC3F18",
            display: "inline-flex",
            padding: "12px 30px",
            alignItems: "center",
            gap: "36px",
            border: "1px solid #EC3F18",
            borderRadius: "32px",
          }}
        >
          View All
        </Button>
      </Box>
      <DashboardTable />
      <DeleteModel />
    </Box>
  );
};

export default Dashboard;
