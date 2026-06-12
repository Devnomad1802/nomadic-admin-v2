import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { logo } from "../Images";

import { Button, FormControlLabel, FormGroup, Hidden } from "@mui/material";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button1 } from "../smallComponents/Button1";
import { IOSSwitch } from "../smallComponents/swtich";

const drawerWidth = 240;
const array2 = [
  {
    name: "Dashboard",
    link1: "/",
  },
  {
    name: "Analytics",
    link1: "/analytics",
  },
  {
    name: "Bookings",
    link1: "/bookings",
  },

  {
    name: "Trips",
    link1: "/trip",
  },
  {
    name: "User",
    link1: "/user",
  },
  {
    name: "Enquire",
    link1: "/enquire",
  },
  {
    name: "Banner",
    link1: "/banner",
  },
  {
    name: "Hosts",
    link1: "/hosts",
  },
  {
    name: "Payouts",
    link1: "/payouts",
  },
  {
    name: "About Us",
    link1: "/aboutUs",
  },
  {
    name: "Blogs",
    link1: "/blogs",
  },
  {
    name: "Reviews",
    link1: "/reviews",
  },
  {
    name: "Category",
    link1: "/category",
  },
  {
    name: "Vendors",
    link1: "/vendors",
  },
  {
    name: "Coupons",
    link1: "/coupons",
  },
  {
    name: "Web Seo",
    link1: "/seo",
  },
  {
    name: "Settings",
    link1: "/settings",
  },
];

function ResponsiveDrawer(props) {
  const navigate = useNavigate();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const { pathname } = useLocation();

  const isTrip = pathname.includes("/trip");
  const isAddTrip = pathname.includes("/trip/addtrip");
  const isTripTabs = pathname.includes("/trip/tripTabs");
  const isUser = pathname.includes("/user");
  const isUserTab = pathname.includes("/user/userTabs");
  const isBooking = pathname.includes("/booking");
  const isEnquire = pathname.includes("/enquire");
  const isBanner = pathname.includes("/banner");
  const isHosts = pathname.includes("/hosts");
  const isAddHost = pathname.includes("/hosts/addHost");
  const isEditHost = pathname.includes("/hosts/edit");
  const isAboutus = pathname.includes("/aboutUs");
  const isBlog = pathname.includes("/blogs");
  const isAddBlog = pathname.includes("/blogs/addBlog");
  const isPublishBlog = pathname.includes("/blogs/publishBlog");
  const isReviews = pathname.includes("/reviews");
  const isAddReview = pathname.includes("/reviews/addReview");
  const isPublishReview = pathname.includes("/reviews/PublishReview");
  const isCatagory = pathname.includes("/category");
  const isVandor = pathname.includes("/vendor");
  const isAddVendors = pathname.includes("/vendors/addVendors");
  const isVendorTabs = pathname.includes("/vendors/vendorTabs");
  const isCoupon = pathname.includes("/coupon");
  const isAddCoupon = pathname.includes("/coupons/addCoupon");
  const isTabsCoupons = pathname.includes("/coupons/couponTabs");
  const isPayouts = pathname.includes("/payouts");
  const isSeo = pathname.includes("/seo");
  const isSettings = pathname.includes("/settings");

  let isDashboard = false;
  if (
    !isTrip &&
    !isAddTrip &&
    !isTripTabs &&
    !isUser &&
    !isUserTab &&
    !isBooking &&
    !isEnquire &&
    !isBanner &&
    !isAboutus &&
    !isBlog &&
    !isAddBlog &&
    !isPublishBlog &&
    !isCatagory &&
    !isVandor &&
    !isAddVendors &&
    !isVendorTabs &&
    !isCoupon &&
    !isAddCoupon &&
    !isTabsCoupons &&
    !isReviews &&
    !isAddReview &&
    !isPublishBlog &&
    !isHosts &&
    !isAddHost &&
    !isPayouts &&
    !isAboutus &&
    !isSeo &&
    !isSettings
  ) {
    isDashboard = true;
  }

  const styledactivelink = ({ isActive }) => {
    // console.log("active", isActive);
    return {
      textDecoration: "none",
      padding: "10px",
      borderRadius: "0px",
      fontSize: "16px",
      color: isActive ? "#fff" : "#6D7280",
      alignItems: "center",
      fontWeight: "400",
      fontFamily: "Ubuntu",
      textTransform: "capitalize",
      paddingLeft: "35px",
      background: isActive ? "#393938" : "none",
      width: "100%",
    };
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <Box sx={{ background: "#FBFBFB", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80px",
        }}
      >
        <Box sx={{ width: "65%" }}>
          <img src={logo} alt="" srcSet="" style={{ width: "100%" }} />
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
          gap: "0px 10px",
          alignItems: "start",
          borderRadius: "10px",
          paddingBottom: "50px"
        }}
      >
        <>
          {array2.map((item, index) => {
            return (
              <NavLink
                to={item.link1}
                key={index}
                style={styledactivelink}
                className="cool-link"
              >
                {item.name.toLocaleLowerCase()}
              </NavLink>
            );
          })}
        </>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", background: "#FFFFFF" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: { xs: "#393938", md: "#FBFBFB" },
          boxShadow: "none",
          height: { xs: "60px", md: "80px" },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          {pathname === "/" && (
            <>
              {" "}
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Dashboard
              </Typography>
            </>
          )}
          {isBooking && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Bookings
              </Typography>
            </>
          )}

          {isTrip && (
            <>
              {isAddTrip && !isTripTabs ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "space-between" },
                      alignItems: "center",
                      gap: "0px 20px",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "0px 0px",
                      }}
                    >
                      {/* <IconButton> */}
                      <ArrowBackIosIcon
                        onClick={() => {
                          navigate(-1);
                        }}
                        sx={{
                          fontWeight: "300",
                          color: { xs: "#fff", md: "#000" },
                        }}
                      />
                      {/* </IconButton> */}

                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                          color: { xs: "#fff", md: "#000" },
                          fontSize: { xs: "18px", md: "23px" },
                          fontWeight: 500,
                        }}
                      >
                        Add Trips
                      </Typography>
                    </Box>
                    {/* <Box sx={{}}>
                      <Hidden>
                        <IconButton
                          size="small"
                          sx={{ border: "2px solid #fff" }}
                        >
                          <Tooltip placement="bottom" title="Upload">
                            <UploadIcon
                              size="small"
                              sx={{ color: "#fff", fontSize: "19px" }}
                            />
                          </Tooltip>
                        </IconButton>
                      </Hidden>
                      <Hidden mdDown>
                        <Button1
                          onClick={() => {
                            navigate("/dashboard/trip/addtrip");
                          }}
                        >
                          Upload Trip
                        </Button1>
                      </Hidden>
                    </Box> */}
                  </Box>
                </>
              ) : isTripTabs ? (
                <>
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "space-between" },
                      alignItems: "center",
                      gap: "0px 10px",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "0px 0px",
                      }}
                    >
                      <ArrowBackIosIcon
                        onClick={() => {
                          navigate(-1);
                        }}
                        sx={{
                          fontWeight: "300",
                          color: { xs: "#fff", md: "#000" },
                        }}
                      />

                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                          color: { xs: "#fff", md: "#000" },
                          fontSize: { xs: "16px", sm: "18px", md: "23px" },
                          fontWeight: 500,
                        }}
                      >
                        Explore Bhutan
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        gap: "0px 0px",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Hidden mdUp>
                        {/* <IconButton> */}
                        <DeleteIcon sx={{ color: "#00C30F" }} />
                        {/* </IconButton> */}
                      </Hidden>
                      <Hidden mdDown>
                        <Button
                          sx={{
                            color: { xs: "#fff", md: "#00C30F" },
                            fontSize: { xs: "13px", sm: "14px", md: "16px" },
                            background: "transparent",
                          }}
                          startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                        >
                          Delete Trip
                        </Button>
                      </Hidden>

                      <FormGroup>
                        <FormControlLabel
                          labelPlacement="start"
                          label="Active"
                          sx={{
                            color: {
                              xs: "#fff",
                              md: "#00C30F",
                            },
                          }}
                          control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                        />
                      </FormGroup>
                    </Box>
                  </Box>
                </>
              ) : (
                <>
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "flex-start", md: "space-between" },
                      alignItems: "center",
                      gap: "0px 20px",
                      width: "100%",
                    }}
                  >
                    {" "}
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Trips
                    </Typography>
                    <Box sx={{}}>
                      <Hidden smUp={true}>
                        <IconButton
                          onClick={() => {
                            navigate("/trip/addtrip");
                          }}
                          size="small"
                          sx={{ border: "2px solid #fff" }}
                        >
                          <AddIcon
                            size="small"
                            sx={{
                              color: "#fff",
                              fontSize: "19px",
                              fontWeight: "bold",
                            }}
                          />
                        </IconButton>
                      </Hidden>
                      <Hidden mdDown={true}>
                        <Button1
                          onClick={() => {
                            navigate("/trip/addtrip");
                          }}
                        >
                          Add Trips
                        </Button1>
                      </Hidden>
                    </Box>
                  </Box>
                </>
              )}
            </>
          )}

          {isUser && !isUserTab ? (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: { xs: "#fff", md: "#000" },
                fontSize: { xs: "18px", md: "23px" },
                fontWeight: 500,
              }}
            >
              User
            </Typography>
          ) : (
            isUser &&
            isUserTab && (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "0px 0px",
                    }}
                  >
                    {/* <IconButton> */}
                    <ArrowBackIosIcon
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        fontWeight: "300",
                        color: { xs: "#fff", md: "#000" },
                      }}
                    />
                    {/* </IconButton> */}

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "16px", sm: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Jhon Deo
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0px 0px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Hidden mdUp>
                      {/* <IconButton> */}
                      <DeleteIcon sx={{ color: "#00C30F" }} />
                      {/* </IconButton> */}
                    </Hidden>
                    <Hidden mdDown>
                      <Button
                        sx={{
                          color: { xs: "#fff", md: "#00C30F" },
                          fontSize: { xs: "13px", sm: "14px", md: "16px" },
                          background: "transparent",
                        }}
                        startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                      >
                        Delete Account
                      </Button>
                    </Hidden>

                    <FormGroup>
                      <FormControlLabel
                        labelPlacement="start"
                        label="Active"
                        sx={{
                          color: {
                            xs: "#fff",
                            md: "#00C30F",
                          },
                        }}
                        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </>
            )
          )}

          {isEnquire && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Enquire
              </Typography>
            </>
          )}
          {isBanner && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Banner
              </Typography>
            </>
          )}
          {isHosts && !isAddHost && !isEditHost && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "space-between" },
                  alignItems: "center",
                  gap: "0px 20px",
                  width: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    color: { xs: "#fff", md: "#000" },
                    fontSize: { xs: "18px", md: "23px" },
                    fontWeight: 500,
                  }}
                >
                  Hosts
                </Typography>
                <Box sx={{}}>
                  <Hidden mdDown>
                    <Button1
                      onClick={() => {
                        navigate("/hosts/addHost");
                      }}
                    >
                      Add Host
                    </Button1>
                  </Hidden>
                </Box>
              </Box>
            </>
          )}
          {(isAddHost || isEditHost) && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "space-between" },
                  alignItems: "center",
                  gap: "0px 20px",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                  }}
                >
                  {/* <IconButton> */}
                  <ArrowBackIosIcon
                    onClick={() => {
                      navigate(-1);
                    }}
                    sx={{
                      fontWeight: "300",
                      color: { xs: "#fff", md: "#000" },
                    }}
                  />
                  {/* </IconButton> */}

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    {isEditHost ? "Edit Host" : "Add Host"}
                  </Typography>
                </Box>
              </Box>
            </>
          )}

          {isPayouts && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Payouts
              </Typography>
            </>
          )}

          {isAboutus && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                About Us
              </Typography>
            </>
          )}

          {
            isBlog && !isAddBlog && !isPublishBlog ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Blog
                  </Typography>
                  <Box sx={{}}>
                    <Hidden>
                      <IconButton
                        onClick={() => {
                          navigate("/trip/addtrip");
                        }}
                        size="small"
                        sx={{ border: "2px solid #fff" }}
                      >
                        <AddIcon
                          size="small"
                          sx={{
                            color: "#fff",
                            fontSize: "19px",
                            fontWeight: "bold",
                          }}
                        />
                      </IconButton>
                    </Hidden>
                    <Hidden mdDown>
                      <Button1
                        onClick={() => {
                          navigate("/blogs/addBlog");
                        }}
                      >
                        Add Blog
                      </Button1>
                    </Hidden>
                  </Box>
                </Box>
              </>
            ) : isBlog && isAddBlog && !isPublishBlog ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "0px 0px",
                    }}
                  >
                    <ArrowBackIosIcon
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        fontWeight: "300",
                        color: { xs: "#fff", md: "#000" },
                      }}
                    />

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "16px", sm: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Explore Bhutan
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0px 0px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Hidden mdUp>
                      <DeleteIcon sx={{ color: "#00C30F" }} />
                    </Hidden>
                    <Hidden mdDown>
                      <Button
                        sx={{
                          color: { xs: "#fff", md: "#00C30F" },
                          fontSize: { xs: "13px", sm: "14px", md: "16px" },
                          background: "transparent",
                        }}
                        startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                      >
                        Delete Blog
                      </Button>
                    </Hidden>

                    <FormGroup>
                      <FormControlLabel
                        labelPlacement="start"
                        label="Active"
                        sx={{
                          color: {
                            xs: "#fff",
                            md: "#00C30F",
                          },
                        }}
                        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </>
            ) : isBlog && isPublishBlog && !isAddBlog ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                  }}
                >
                  <ArrowBackIosIcon
                    onClick={() => {
                      navigate(-1);
                    }}
                    sx={{
                      fontWeight: "300",
                      color: { xs: "#fff", md: "#000" },
                    }}
                  />

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "16px", sm: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Add Blog
                  </Typography>
                </Box>
              </>
            ) : null // Handle other cases if needed
          }
          {
            isReviews && !isAddReview && !isPublishReview ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Review
                  </Typography>
                  <Box sx={{}}>
                    <Hidden>
                      <IconButton
                        onClick={() => {
                          navigate("/reviews/addReview");
                        }}
                        size="small"
                        sx={{ border: "2px solid #fff" }}
                      >
                        <AddIcon
                          size="small"
                          sx={{
                            color: "#fff",
                            fontSize: "19px",
                            fontWeight: "bold",
                          }}
                        />
                      </IconButton>
                    </Hidden>
                    <Hidden mdDown>
                      <Button1
                        onClick={() => {
                          navigate("/reviews/addReview");
                        }}
                      >
                        Add Review
                      </Button1>
                    </Hidden>
                  </Box>
                </Box>
              </>
            ) : isReviews && isAddReview && !isPublishReview ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "0px 0px",
                    }}
                  >
                    <ArrowBackIosIcon
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        fontWeight: "300",
                        color: { xs: "#fff", md: "#000" },
                      }}
                    />

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "16px", sm: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Add Review
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "0px 0px",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Hidden mdUp>
                      <DeleteIcon sx={{ color: "#00C30F" }} />
                    </Hidden>
                    <Hidden mdDown>
                      <Button
                        sx={{
                          color: { xs: "#fff", md: "#00C30F" },
                          fontSize: { xs: "13px", sm: "14px", md: "16px" },
                          background: "transparent",
                        }}
                        startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                      >
                        Delete Review
                      </Button>
                    </Hidden>

                    <FormGroup>
                      <FormControlLabel
                        labelPlacement="start"
                        label="Active"
                        sx={{
                          color: {
                            xs: "#fff",
                            md: "#00C30F",
                          },
                        }}
                        control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                      />
                    </FormGroup>
                  </Box>
                </Box>
              </>
            ) : isReviews && isPublishReview && !isAddReview ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                  }}
                >
                  <ArrowBackIosIcon
                    onClick={() => {
                      navigate(-1);
                    }}
                    sx={{
                      fontWeight: "300",
                      color: { xs: "#fff", md: "#000" },
                    }}
                  />

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "16px", sm: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Explore Bhutan
                  </Typography>
                </Box>
              </>
            ) : null // Handle other cases if needed
          }

          {
            isVandor && !isAddVendors && !isVendorTabs ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Vendors
                  </Typography>
                  <Box sx={{}}>
                    <Hidden>
                      <IconButton
                        onClick={() => {
                          navigate("/vendors/addVendors");
                        }}
                        size="small"
                        sx={{ border: "2px solid #fff" }}
                      >
                        <AddIcon
                          size="small"
                          sx={{
                            color: "#fff",
                            fontSize: "19px",
                            fontWeight: "bold",
                          }}
                        />
                      </IconButton>
                    </Hidden>
                    <Hidden mdDown>
                      <Button1
                        onClick={() => {
                          navigate("/vendors/addVendors");
                        }}
                      >
                        Add Vendors
                      </Button1>
                    </Hidden>
                  </Box>
                </Box>
              </>
            ) : isVandor && isAddVendors && !isVendorTabs ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "0px 0px",
                    }}
                  >
                    <ArrowBackIosIcon
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        fontWeight: "300",
                        color: { xs: "#fff", md: "#000" },
                      }}
                    />

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "16px", sm: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Explore Bhutan
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : isVandor && isVendorTabs && !isAddVendors ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "flex-start",
                    md: "space-between",
                    alignItems: "center",
                    width: "100%",
                  },
                }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                  }}
                >
                  <ArrowBackIosIcon
                    onClick={() => {
                      navigate(-1);
                    }}
                    sx={{
                      fontWeight: "300",
                      color: { xs: "#fff", md: "#000" },
                    }}
                  />

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "16px", sm: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    John Doe
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "0px 0px",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Hidden mdUp>
                    <DeleteIcon sx={{ color: "#00C30F" }} />
                  </Hidden>
                  <Hidden mdDown>
                    <Button
                      sx={{
                        color: { xs: "#fff", md: "#00C30F" },
                        fontSize: { xs: "13px", sm: "14px", md: "16px" },
                        background: "transparent",
                      }}
                      startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                    >
                      Delete Vendors
                    </Button>
                  </Hidden>

                  <FormGroup>
                    <FormControlLabel
                      labelPlacement="start"
                      label="Active"
                      sx={{
                        color: {
                          xs: "#fff",
                          md: "#00C30F",
                        },
                      }}
                      control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                    />
                  </FormGroup>
                </Box>
              </Box>
            ) : null // Handle other cases if needed
          }
          {
            isCoupon && !isAddCoupon && !isTabsCoupons ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: {
                      xs: "flex-start",
                      md: "space-between",
                    },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Coupons
                  </Typography>
                  <Box sx={{}}>
                    <Hidden>
                      <IconButton
                        onClick={() => {
                          navigate("/coupons/addCoupon");
                        }}
                        size="small"
                        sx={{ border: "2px solid #fff" }}
                      >
                        <AddIcon
                          size="small"
                          sx={{
                            color: "#fff",
                            fontSize: "19px",
                            fontWeight: "bold",
                          }}
                        />
                      </IconButton>
                    </Hidden>
                    <Hidden mdDown>
                      <Button1
                        onClick={() => {
                          navigate("/coupons/addCoupon");
                        }}
                      >
                        Add Coupon
                      </Button1>
                    </Hidden>
                  </Box>
                </Box>
              </>
            ) : isCoupon && isAddCoupon && !isTabsCoupons ? (
              <>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "flex-start", md: "space-between" },
                    alignItems: "center",
                    gap: "0px 10px",
                    width: "100%",
                  }}
                >
                  {" "}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: "0px 0px",
                    }}
                  >
                    <ArrowBackIosIcon
                      onClick={() => {
                        navigate(-1);
                      }}
                      sx={{
                        fontWeight: "300",
                        color: { xs: "#fff", md: "#000" },
                      }}
                    />

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{
                        color: { xs: "#fff", md: "#000" },
                        fontSize: { xs: "16px", sm: "18px", md: "23px" },
                        fontWeight: 500,
                      }}
                    >
                      Add Coupon
                    </Typography>
                  </Box>
                </Box>
              </>
            ) : isCoupon && isTabsCoupons && !isAddCoupon ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: {
                    xs: "flex-start",
                    md: "space-between",
                    alignItems: "center",
                    width: "100%",
                  },
                }}
              >
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                  }}
                >
                  <ArrowBackIosIcon
                    onClick={() => {
                      navigate(-1);
                    }}
                    sx={{
                      fontWeight: "300",
                      color: { xs: "#fff", md: "#000" },
                    }}
                  />

                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                      color: { xs: "#fff", md: "#000" },
                      fontSize: { xs: "16px", sm: "18px", md: "23px" },
                      fontWeight: 500,
                    }}
                  >
                    Get 15% Off
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "0px 0px",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Hidden mdUp>
                    <DeleteIcon sx={{ color: "#00C30F" }} />
                  </Hidden>
                  <Hidden mdDown>
                    <Button
                      sx={{
                        color: { xs: "#fff", md: "#00C30F" },
                        fontSize: { xs: "13px", sm: "14px", md: "16px" },
                        background: "transparent",
                      }}
                      startIcon={<DeleteIcon sx={{ color: "#00C30F" }} />}
                    >
                      Delete Coupon
                    </Button>
                  </Hidden>

                  <FormGroup>
                    <FormControlLabel
                      labelPlacement="start"
                      label="Active"
                      sx={{
                        color: {
                          xs: "#fff",
                          md: "#00C30F",
                        },
                      }}
                      control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                    />
                  </FormGroup>
                </Box>
              </Box>
            ) : null // Handle other cases if needed
          }
          {isCatagory && (
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                color: { xs: "#fff", md: "#000" },
                fontSize: { xs: "16px", sm: "18px", md: "23px" },
                fontWeight: 500,
              }}
            >
              Manage Category
            </Typography>
          )}
          {isSeo && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                SEO
              </Typography>
            </>
          )}
          {isSettings && (
            <>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  color: { xs: "#fff", md: "#000" },
                  fontSize: { xs: "18px", md: "23px" },
                  fontWeight: 500,
                }}
              >
                Settings
              </Typography>
            </>
          )}

          <IconButton
            // color="inherit"
            // aria-label="open drawer"
            // edge="start"
            size="small"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: "none" },
              color: "#fff",
              // background: "#fff",
              border: "1px solid #fff",
            }}
          >
            <MenuIcon size="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          // p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          height: "auto",
          overflowY: "auto",
          boxSizing: "border-box",
          py: "100px",
          background: "#fff",
          px: "0px",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;
