import { Box, Button, Grid, Typography } from "@mui/material";
import DashboardTable from "../Components/Dashboard/DashboardTable";
import { useGetUsersQuery } from "../Redux/services/authApis";
import { useNavigate } from "react-router-dom";
import {
  useGetAllBookingQuery,
  useGetAllEnquriesQuery,
  useGetTripsQuery,
} from "../Redux/services";
import DeleteModel from "../smallComponents/DeleteModal";

// Count genuinely-new enquiries. "New" = status not yet replied/closed, i.e.
// status === "new" (case-insensitive) or no reply recorded. Replying/closing
// moves it out of this count. Excludes November-is-all-new over-counting.
const isNewEnquiry = (e) => {
  const s = (e?.status ?? "").toLowerCase();
  if (s === "replied" || s === "closed") return false;
  return s === "new" || (!e?.Reply && !s);
};

const Dashboard = () => {
  // Hosts and customers use role-scoped queries so each count comes from the
  // server's authoritative `total` (countDocuments) and is NOT capped by the
  // users endpoint's pagination (default limit 10).
  const { error, isLoading, data: hostsRes } = useGetUsersQuery({ role: "host" });
  const { data: customersRes } = useGetUsersQuery({ role: "customer" });

  const { data: enquir } = useGetAllEnquriesQuery({ range: "All" });
  const { data: bookings } = useGetAllBookingQuery();
  const { data: trips } = useGetTripsQuery();

  const hostCount = hostsRes?.total;
  const customerCount = customersRes?.total;

  // Bookings endpoint is paginated — `data` is one page, `totalTrips` is the
  // true count. Enquiries + Trips endpoints return the full list.
  const bookingCount = bookings?.totalTrips ?? bookings?.total ?? bookings?.data?.length;

  const enquiries = enquir?.data ?? [];
  const newEnquiryCount = enquiries.filter(isNewEnquiry).length;

  const loading = isLoading;
  const dash = (v) => (loading ? "…" : error ? "—" : v ?? 0);

  const navigate = useNavigate();
  const array = [
    { heading: "Total Bookings", text: dash(bookingCount), link: "/bookings" },
    { heading: "Total Trips", text: dash(trips?.data?.length), link: "/trip" },
    { heading: "Total Hosts", text: dash(hostCount), link: "/hosts" },
    { heading: "Total Customers", text: dash(customerCount), link: "/user" },
    { heading: "Total Enquiries", text: dash(enquiries.length), link: "/enquire" },
    { heading: "New Enquiries", text: dash(newEnquiryCount), link: "/enquire" },
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
                    fontSize: { xs: "28px", md: "34px" },
                    fontWeight: 500,
                    lineHeight: "130%",
                    mt: 1,
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
