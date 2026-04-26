import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import MenuItem from "@mui/material/MenuItem";
import BookingModal from "../Components/Booking/BookingModal";
import { Link, useNavigate } from "react-router-dom";
import { useGetAllBlogsQuery } from "../Redux/services";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteBlog from "../Components/Blogs/DeleteBlog";

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
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
  {
    blogtitle: "Waterfalls In Sri Lanka: ..",
    author: "John Doe",
    location: "Sri Lanka",
    posteddate: "1:00pm, 12 April 2024",
    status: "Active",
  },
];

const status = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "Active",
    label: "Active",
  },
  {
    value: "Non Active",
    label: "Non Active",
  },
];

const Blogs = () => {
  const { error, isLoading, data: responseData } = useGetAllBlogsQuery();
  const [delModal, setDelModal] = useState(false);

  const [blogsData, setBlogsData] = useState([]);
  const [deletripId, setDeleteTripId] = useState("");

  console.log("blogsData", blogsData);
  useEffect(() => {
    setBlogsData(responseData?.data);
  }, [isLoading, error, responseData]);
  const navigate = useNavigate();

  const viewApplication = (id, row) => {
    navigate("/blogs/publishBlog", {
      state: { RowData: row },
    });
  };
  const deleteApp = (id) => {
    setDelModal(true);
    setDeleteTripId(id);
  };

  const iconArray = [
    {
      icon: <ArticleIcon />,
      name: "View",
      fun: viewApplication,
    },
    {
      icon: <DeleteIcon sx={{ color: "red" }} />,
      name: "Delete",
      fun: deleteApp,
    },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          px: 1,
          maxWidth: "xl",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "500px",
        }}
      >
        <DeleteBlog
          delModal={delModal}
          setDelModal={setDelModal}
          deletripId={deletripId}
        />
        <TableContainer
          sx={{
            "& .MuiTableCell-root": {
              border: "none",
            },
          }}
        >
          <Table
            sx={{
              minWidth: 1000,
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
                  Blog Title
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
                  Author
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
                  Location
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
                  Posted Date
                  <Box sx={{ height: "40px" }} />
                </TableCell>{" "}
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
                  Manage
                  <Box sx={{ height: "40px" }} />
                </TableCell>{" "}
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "#fff" }}>
              {blogsData &&
                blogsData?.map((row, index) => (
                  <TableRow
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
                      }}
                    >
                      {row?.title}
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
                        {row?.author}
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
                      {/* {row.bitcoinCash1} */}
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        {row?.location}
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
                        {row?.Date
                          ? new Date(row?.Date).toLocaleDateString("en", {
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
                        {row.status}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        border: "none !important",
                        borderRadius: "none",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6D7280",
                          fontSize: "13px",
                          fontWeight: "300",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#6D7280",
                            fontSize: "13px",
                            fontWeight: "300",
                          }}
                        >
                          {iconArray.map((item, iconIndex) => (
                            <Tooltip
                              key={iconIndex}
                              placement="top"
                              title={item?.name}
                            >
                              <IconButton
                                onClick={() => item.fun(row?._id, row)}
                              >
                                {item?.icon}
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Typography>
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

export default Blogs;
