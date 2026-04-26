import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import BookingModal from "./BookingModal";

import MenuItem from "@mui/material/MenuItem";
import { useGetAllBookingQuery } from "../../Redux/services";

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
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996 ",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
    travellers: "3",
    days: "7D/6N",
    datetrip: "22 June 2024",
    bookingdate: "1:00pm, 12 April 2024",
    type: "Batch",
    status: "Active",
  },
  {
    stage: "ASDFTG58696996",
    tokenPrice: "John Doe",
    per: "Explore Bhutan",
    amountOfTokens: "6785899",
    usdValue: "$450",
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
const BookingTable = () => {
  const { error, isLoading, data: responseData } = useGetAllBookingQuery();
  const [bookingArray, setBookingArray] = useState([]);
  console.log("bookingArray....", bookingArray);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    tripName: "",
  });

  console.log("filters....", filters);

  const getFilteredBookings = () => {
    return bookingArray?.filter((booking) => {
      const matchesName = filters.name
        ? booking.userName.toLowerCase().includes(filters.name.toLowerCase())
        : true;
      const matchesEmail = filters.email
        ? booking.email.toLowerCase().includes(filters.email.toLowerCase())
        : true;
      const matchesPhone = filters.phone
        ? booking.phone.includes(filters.phone)
        : true;
      const matchesTripName = filters.tripName
        ? booking.paymentDetail.title
          .toLowerCase()
          .includes(filters.tripName.toLowerCase())
        : true;

      return matchesName && matchesEmail && matchesPhone && matchesTripName;
    });
  };
  const filteredBookings = getFilteredBookings();

  console.log("filteredBookings....", filteredBookings);

  console.log("bookingArray...", bookingArray);
  useEffect(() => {
    if (responseData?.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      const updatedBookingArray = responseData.data.map((booking) => {
        // Handle cardData - check if it's a string or already an object
        let parsedCardData = booking.cardData;
        if (typeof booking.cardData === 'string') {
          try {
            parsedCardData = JSON.parse(booking.cardData);
          } catch (e) {
            console.error('Error parsing cardData:', e);
            parsedCardData = booking.cardData;
          }
        }

        // Handle paymentDetail - check if it's a string or already an object
        let parsedPaymentDetail = booking.paymentDetail;
        if (typeof booking.paymentDetail === 'string') {
          try {
            parsedPaymentDetail = JSON.parse(booking.paymentDetail);
          } catch (e) {
            console.error('Error parsing paymentDetail:', e);
            parsedPaymentDetail = booking.paymentDetail;
          }
        }

        return {
          ...booking,
          cardData: parsedCardData,
          paymentDetail: parsedPaymentDetail,
        };
      });
      setBookingArray(updatedBookingArray);
    } else {
      setBookingArray([]);
    }
  }, [isLoading, error, responseData]);

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
                >
                  User Name
                  <TextField
                    size="small"
                    name="name"
                    onChange={(e) =>
                      setFilters({ ...filters, name: e.target.value })
                    }
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
                  Email
                  <TextField
                    size="small"
                    name="email"
                    onChange={(e) =>
                      setFilters({ ...filters, email: e.target.value })
                    }
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
                  Phone
                  <TextField
                    size="small"
                    sx={inputStyle2}
                    name="phone"
                    onChange={(e) =>
                      setFilters({ ...filters, phone: e.target.value })
                    }
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
                  Trip Name
                  <TextField
                    size="small"
                    name="tripName"
                    onChange={(e) =>
                      setFilters({ ...filters, tripName: e.target.value })
                    }
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
                    color: "#667085",
                    background: "#F3F4F6",
                    width: "200px",
                  }}
                  align="center"
                >
                  <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                    Pending Amount
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
                  <Typography sx={{ fontSize: "13px", fontWeight: "bold" }}>
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
              {!isLoading && (!filteredBookings || filteredBookings.length === 0) ? (
                <TableRow>
                  <TableCell
                    colSpan={12}
                    align="center"
                    sx={{
                      border: "none",
                      py: 8,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#6D7280",
                        fontSize: "16px",
                        fontWeight: "400",
                      }}
                    >
                      No bookings available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings?.map((row, index) => (
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
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.email}
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
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.phone}
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
                          whiteSpace: "nowrap", // Prevents text from wrapping to the next line
                          overflow: "hidden", // Hides text that overflows the container
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row?.paymentDetail?.title}
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
                        {row?.total.toFixed(0)}
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
                        {row?.paymentStatus === "firstPayment" ? (
                          <>
                            {(
                              row?.cardData?.AmountTotal +
                              row?.cardData?.gstTax -
                              Number(row?.coupenDiscount) -
                              row?.total
                            ).toFixed(0)}
                          </>
                        ) : (
                          0
                        )}
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
                            "en-US", // Specify locale as "en-US"
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
                        {/* {row.bookingdate} */}
                        Completed
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default BookingTable;
