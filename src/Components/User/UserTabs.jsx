import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Profile from "./Profile";
import UserBooking from "../../Pages/UserBooking";
import UserBookingTab from "./UserBookingTab";
import { useLocation } from "react-router-dom";

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    textTransform: "none",
    minWidth: 0,
    [theme.breakpoints.up("sm")]: {
      minWidth: 0,
    },
    paddingLeft: theme.spacing(0),
    paddingRightt: theme.spacing(0),
    marginLeft: "7px",
    color: "#111827",
    fontWeight: "bold",

    "&:hover": {
      color: "#CD482A",
      opacity: 1,
    },
    "&.Mui-selected": {
      color: "#CD482A",
      //   background: "linear-gradient(90.1deg, #4F98D0 0.11%, #34D9B1 95.94%)",
      borderRadius: "5px",

      opacity: 1,
    },

    "&.Mui-focusVisible": {
      backgroundColor: "#d1eaff",
    },
  })
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function UserTabs() {
  const location = useLocation();
  const { row } = location.state || {};

  console.log("Row.........", row);
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        px: 1,
        maxWidth: "xl",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #E7E7E7",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Tabs
          //   variant="scrollable"
          scrollButtons
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          sx={{
            // [`& .${tabsClasses.scrollButtons}`]: {
            //   color: "#000",
            //   "&.Mui-disabled": { opacity: 0.3 },
            // },
            "& .MuiTabs-indicator": {
              //   display: "none",
              mb: 1,
              backgroundColor: "#CD482A",
            },
          }}
        >
          <AntTab label="Profile" {...a11yProps(0)} />
          <AntTab label="Booking" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box
        // className="scroolbox"
        sx={{
          // height: "500px",
          // overflowY: "scroll",
          boxSizing: "border-box",
          my: 2,
          py: { xs: 1, md: 1 },
          px: { xs: 1, md: 0 },
          background: "#fff",
        }}
      >
        <TabPanel value={value} index={0}>
          <Profile profile={row} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <UserBookingTab userBookings={row?._id} />
        </TabPanel>
      </Box>
    </Box>
  );
}
