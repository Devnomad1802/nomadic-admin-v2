import { Box, Button, Grid, Typography } from "@mui/material";
import DashboardTable from "../Components/Dashboard/DashboardTable";
import { useGetUsersQuery } from "../Redux/services/authApis";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUsers } from "../Redux/slices";
import {
  useGetAllBookingQuery,
  useGetAllEnquriesQuery,
  useGetTripsQuery,
} from "../Redux/services";
import DeleteModel from "../smallComponents/DeleteModal";

const Dashboard = () => {
  const { error, isLoading, data: responseData } = useGetUsersQuery();
  const [usersArray, setUsersArray] = useState([]);

  const { data: enquir } = useGetAllEnquriesQuery({ range: "All" });
  const { data: bookings } = useGetAllBookingQuery();
  const { data: trips } = useGetTripsQuery();
  useEffect(() => {
    if (!isLoading && !error && responseData) {
      const filteredUsers = responseData?.users.filter(
        (user) => user.role !== "Admin"
      );
      setUsersArray(filteredUsers);
    }
  }, [isLoading, error, responseData]);
  const array = [
    {
      heading: "Total Bookings",
      text: bookings?.data.length,
    },
    {
      heading: "Total Trips",
      text: trips?.data.length,
    },
    {
      heading: "Total Users",
      text: usersArray?.length,
    },
    {
      heading: "Total Enuires",
      text: enquir?.data.length,
    },
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
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: "20px 0px",
        }}
      >
        {array.map(({ heading, text }, index) => (
          <Grid item key={index} xs={12} sm={5.8} lg={2.8}>
            <Box
              sx={{
                color: "#000",
                border: "2px solid #E5E7EB ",
                background: "#F8F8F8",
                width: "100%",
                height: "127px",
                borderRadius: "20px",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  sx={{
                    color: "#3E92CC",
                    fontFamily: "Ubuntu",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "140%",
                  }}
                >
                  {heading}
                </Typography>
                <Box>
                  <Typography
                    sx={{
                      color: "#7DCD85",
                      fontFamily: "Ubuntu",
                      fontSize: "40px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                      mt: 1,
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
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
