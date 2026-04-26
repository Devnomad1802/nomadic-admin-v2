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
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import MenuItem from "@mui/material/MenuItem";
import { useGetAllEnquriesQuery } from "../Redux/services";
import { inputStyle2 } from "./Reviews";
import EnquireModal from "../smallComponents/EnquireModal";
import { useNavigate } from "react-router-dom";
import DeleteModel from "../smallComponents/DeleteModal";

const status = [
  {
    value: "All",
    label: "All",
  },
  {
    value: "7days",
    label: "7 Days",
  },
  {
    value: "30days",
    label: "30 Days",
  },
];
const Enquire = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState({});
  const [delModal, setDelModal] = useState(false);
  const [deletripId, setDeleteTripId] = useState("");
  const [selectedValue, setSelectedValue] = useState("All");
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const matchingLabels = status.filter((item) => item.value === selectedValue);
  const {
    error,
    isLoading,
    data: responseData,
  } = useGetAllEnquriesQuery({ range: selectedValue });

  const [enquirArray, setEnquirArray] = useState([]);
  const [enquireDetail, setEnquireDetail] = useState({});

  useEffect(() => {
    setEnquirArray(responseData?.data);
  }, [isLoading, error, responseData]);

  const [opens, setOpens] = useState(false);
  const toggelModel = () => {
    setOpens(!opens);
  };

  const viewApplication = (id, row) => {
    setBooking(row);
    setOpens(true);
    setEnquireDetail(row);
  };

  // const [deleteApplication] = useDeleteApplicationMutation();

  const deleteApp = async (id) => {
    setDelModal(true);
    setDeleteTripId(id);
    // try {
    //   const res = await deleteApplication({ _id: userId }).unwrap();
    //   console.log("res.....", res);
    //   showToast(`${res?.message}`, "success");
    // } catch (error) {
    //   console.log("error", error);
    //   showToast(`${error?.data?.message}`, "error");
    // }
  };

  const iconArray = [
    { icon: <ArticleIcon />, name: "View", fun: viewApplication },
    {
      icon: <DeleteIcon sx={{ color: "red" }} />,
      name: "Delete",
      fun: deleteApp,
    },
  ];

  return (
    <>
      <EnquireModal
        opens={opens}
        setOpens={setOpens}
        toggelModel={toggelModel}
        enquireDetail={enquireDetail}
      />
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
        <DeleteModel
          delModal={delModal}
          setDelModal={setDelModal}
          deletripId={deletripId}
        />
        s
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
              minWidth: 1200,
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
                  Name
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
                  Email
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
                  Phone
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
                  Enquired Date
                  <Box sx={{ height: "40px" }} />
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
                    Message
                    <Box sx={{ height: "40px" }} />
                  </Typography>
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
                    Sort By
                  </Typography>
                  <Box sx={{ height: "48px", pt: 0.8 }}>
                    <TextField
                      sx={inputStyle2}
                      id="outlined-select-currency"
                      select
                      defaultValue="All"
                      size="small"
                      helperText="Please select your currency"
                      value={selectedValue} // Set the value attribute to the selected value
                      onChange={handleChange} // Call the handleChange function on change
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
                    Manage
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "#fff" }}>
              {enquirArray?.map((row, index) => (
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
                    {row?.Name}
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
                      {row?.Email}
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
                      {row?.Phone}
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
                      {new Date(row?.Date).toLocaleDateString("en", {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
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
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {row?.Message}
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
                      {matchingLabels.map((item) => (
                        <Typography
                          key={item.value}
                          sx={{
                            color: "#6D7280",
                            fontSize: "13px",
                            fontWeight: "300",
                          }}
                        >
                          {item.label}
                        </Typography>
                      ))}
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
                      {iconArray.map((item, iconIndex) => (
                        <Tooltip
                          key={iconIndex}
                          placement="top"
                          title={item?.name}
                        >
                          <IconButton onClick={() => item.fun(row?._id, row)}>
                            {item?.icon}
                          </IconButton>
                        </Tooltip>
                      ))}
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

export default Enquire;
