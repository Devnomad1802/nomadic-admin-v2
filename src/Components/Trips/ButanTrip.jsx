/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import MenuItem from "@mui/material/MenuItem";
import BookingModal from "../Booking/BookingModal";
import { useGetBookingsByTripIdMutation } from "../../Redux/services/TripApis";
import { TripOriginRounded } from "@mui/icons-material";

export const inputStyle2 = {
  "& input::-webkit-outer-spin-button,\n input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: "0",
  },
  width: "100%",
  "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },
  "& .css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },

  "& .MuiOutlinedInput-root": {
    background: "#fff",

    "& fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&:hover fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #E7E7E7",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#253A47", // Change this to the desired placeholder color
    },
    color: "#000",
    height: "40px",
    borderRadius: "5px",
    fontFamily: "Ubuntu",
    textAlign: "left",
    fontWeight: "500",
    width: "100%",
    fontSize: "13px",
  },
};

const rows = [
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    bookingid: "ASDFTG58696996",
    username: "John Doe",
    userid: "6785899",
    amount: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
];
const type = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Batch",
    label: "Batch",
  },
  {
    value: "Customized",
    label: "Customized",
  },
];
const status = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Upcoming",
    label: "Upcoming",
  },
  {
    value: "Completed",
    label: "Completed",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
];
const ButanTrip = ({ trip }) => {
  const tripId = trip;
  const [getBookingsByTripId] = useGetBookingsByTripIdMutation();
  const [TripBookingData, setTripBookingData] = useState([]);
  console.log("TripBooking Data.....", TripBookingData);

  const userBoking = useCallback(async () => {
    const res = await getBookingsByTripId({ tripId }).unwrap();
    const updatedBookingArray = res?.data.map((booking) => ({
      ...booking,
      cardData: JSON.parse(booking.cardData),
      paymentDetail: JSON.parse(booking.paymentDetail),
    }));
    setTripBookingData(updatedBookingArray);
  }, [getBookingsByTripId, tripId]);

  useEffect(() => {
    userBoking();
  }, [userBoking]);

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [gender, setGender] = useState({
    value: "Male",
    label: "Male",
  });
  const [booking, setBooking] = useState({});

  // SignUpModal
  const [opens, setOpens] = useState(false);
  const toggelModel = () => {
    setOpens(!opens);
  };

  return (
    <>
      <BookingModal
        opens={opens}
        setOpens={setOpens}
        toggelModel={toggelModel}
        booking={booking}
      />
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "500px",
          width: "100%",
        }}
      >
        <TableContainer
          sx={{
            "& .MuiTableCell-root": {
              // background: "#202E3C",
              border: "none",
            },
          }}
        >
          <Table
            sx={{
              minWidth: 1700,
              "& .MuiTableCell-root": {
                border: "1px solid #F3F3F3",
                my: 2,
              },
            }}
            aria-label="simple table"
          >
            <TableHead
              sx={{
                background: "#F3F4F6",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "80px",
                    width: "200px",
                    background: "#F3F4F6",
                    borderRadius: "8px 8px 0px 0px",
                  }}
                  align="center"
                >
                  Booking ID
                  <TextField
                    sx={inputStyle2}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ fontSize: "20px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "80px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  User Name
                  <TextField
                    size="small"
                    sx={inputStyle2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ fontSize: "20px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: "13px",
                    fontWeight: "bold",
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "80px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  User ID
                  <TextField
                    size="small"
                    sx={inputStyle2}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon sx={{ fontSize: "20px" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>{" "}
                <TableCell
                  sx={{
                    color: "#667085",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    Amount
                  </Typography>
                  <Box sx={{ height: "40px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }} ss>
                    No of Travellers
                  </Typography>
                  <Box sx={{ height: "40px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    height: "100px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    No of Days
                  </Typography>
                  <Box sx={{ height: "40px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "100px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    Date of Trip
                  </Typography>
                  <Box sx={{ height: "40px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "100px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    Date of Booking
                  </Typography>
                  <Box sx={{ height: "40px" }} />
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "100px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    Type
                  </Typography>
                  <Box sx={{ height: "48px", pt: 0.8 }}>
                    <TextField
                      sx={inputStyle2}
                      id="outlined-select-currency"
                      select
                      defaultValue="All"
                      size="small"
                      helperText="Please select your currency"
                    >
                      {type.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            color: "#000",
                            fontSize: "13px",
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    borderLeft: "none!important",
                    borderTop: "none!important",
                    color: "#667085",
                    // height: "100px",
                    background: "#F3F4F6",
                    width: "190px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
                    Status
                  </Typography>
                  <Box sx={{ height: "48px", pt: 0.8 }}>
                    <TextField
                      sx={inputStyle2}
                      id="outlined-select-currency"
                      select
                      defaultValue="All"
                      size="small"
                      helperText="Please select your currency"
                    >
                      {status.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            color: "#000",
                            fontSize: "13px",
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "#fff" }}>
              {TripBookingData &&
                TripBookingData?.map((row, index) => (
                  <TableRow
                    onClick={() => {
                      setBooking(row);
                      setOpens(true);
                    }}
                    key={index}
                    sx={{
                      border: "1px solid #E5E7EB",
                      color: "#fff",
                      "&:last-child td, &:last-child th": {},
                    }}
                  >
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        // borderRight: "1px solid #008080 !important",
                        borderRadius: index === 4 ? "0px 0px 0px 30px" : "",
                        fontSize: "13px",
                        color: "#6D7280 !important",
                        fontWeight: "400",
                        height: "50px",
                        width: "200px",
                        textDecoration: "underline",
                      }}
                    >
                      {row?.bookingId}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        // borderRight: "1px solid #008080 !important",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.userName}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        // borderRight: "1px solid #008080 !important",
                      }}
                    >
                      {/* {row.bitcoin1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.userId}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.cardData?.AmountTotal}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.cardData?.numberOfTravelers}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.paymentDetail?.days}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.cardData?.cardDate?.batchDate
                          ? new Date(
                              row?.cardData?.cardDate?.batchDate
                            ).toLocaleDateString("en", {
                              weekday: "short",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.DateOfBooking
                          ? new Date(row?.DateOfBooking).toLocaleDateString(
                              "en",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row.datetrip}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        borderRight: "none !important",
                        borderRadius: index === 4 ? "0px 0px 30px 0px" : "",
                      }}
                    >
                      {/* {row.bitcoinSV1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row.bookingdate}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default ButanTrip;
