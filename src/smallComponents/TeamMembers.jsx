import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, IconButton, Tooltip, Typography } from "@mui/material";
import { useGetTeamMembersQuery } from "../Redux/services/aboutApis";
import { useEffect, useState } from "react";
import { baseImage } from "../Redux/utils";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleIcon from "@mui/icons-material/Article";
import AboutUsModal from "../Components/AboutUs/AboutUsModal";
import { useNavigate } from "react-router-dom";

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

const TeamMembers = () => {
  const { isError, isFetching, isLoading, data } = useGetTeamMembersQuery();
  const [delModal, setDelModal] = useState(false);
  const [deletripId, setDeleteTripId] = useState("");
  const [aboutData, setAboutData] = useState(data?.data);

  const navigate = useNavigate();
  console.log("About page ", aboutData);

  useEffect(() => {
    if (data) {
      setAboutData(data?.data);
    }
  }, [data]);

  const viewApplication = (id, row) => {
    navigate("/aboutus/editabout", {
      state: { aboutData: row },
    });
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
      <Box
        sx={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "500px",
          width: "100%",
          //   maxWidth: "md",
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
          <AboutUsModal
            delModal={delModal}
            setDelModal={setDelModal}
            deletripId={deletripId}
          />
          <Table
            sx={{
              minWidth: 500,
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
                    width: "50px",
                    background: "#F3F4F6",
                    borderRadius: "8px 8px 0px 0px",
                  }}
                >
                  Photo
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
                    width: "150px",
                  }}
                  align="center"
                >
                  Name
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
                    width: "150px",
                  }}
                  align="center"
                >
                  Position
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
                    width: "150px",
                  }}
                  align="center"
                >
                  Manage
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ color: "#fff" }}>
              {aboutData &&
                aboutData?.map((row, index) => (
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
                      sx={{
                        borderLeft: "none!important",
                        borderTop: "1px solid #E5E7EB!important",
                        borderBottom: "none !important",
                        // borderRight: "1px solid #008080 !important",
                      }}
                    >
                      <img
                        src={
                          row.Photo?.startsWith("http://") ||
                            row.Photo?.startsWith("https://")
                            ? row.Photo
                            : `${baseImage}${row.Photo}`
                        }
                        alt=""
                        srcSet=""
                        style={{ width: "40px" }}
                      />
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
                        {row.Name}
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
                        {row?.Position}
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

export default TeamMembers;
