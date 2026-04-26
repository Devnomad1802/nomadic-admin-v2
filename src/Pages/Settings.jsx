import { Box, Container, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import ProfileSetting from "../Components/Setting/Tabs/ProfileSetting";
import ChangePassword from "../Components/Setting/Tabs/ChangePassword";
import Logout from "../Components/Setting/Tabs/Logout";

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
        textTransform: "none",
        minWidth: 0,
        [theme.breakpoints.up("sm")]: {
            minWidth: 0,
        },
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        marginLeft: theme.spacing(0),
        marginRight: theme.spacing(0),
        color: "#111827",
        fontWeight: "bold",
        fontSize: "16px",
        "&:hover": {
            color: "#CD482A",
            opacity: 1,
        },
        "&.Mui-selected": {
            color: "#CD482A",
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
            id={`settings-tabpanel-${index}`}
            aria-labelledby={`settings-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
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
        id: `settings-tab-${index}`,
        "aria-controls": `settings-tabpanel-${index}`,
    };
}

const Settings = () => {
    // Tab state
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
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
                    scrollButtons
                    value={value}
                    onChange={handleTabChange}
                    aria-label="settings tabs"
                    sx={{
                        "& .MuiTabs-indicator": {
                            mb: 1,
                            backgroundColor: "#CD482A",
                        },
                    }}
                >
                    <AntTab label="Profile Settings" {...a11yProps(0)} />
                    <AntTab label="Change Password" {...a11yProps(1)} />
                    <AntTab label="Logout" {...a11yProps(2)} />
                </Tabs>
            </Box>
            <Box
                sx={{
                    boxSizing: "border-box",
                    my: 2,
                    py: { xs: 1, md: 1 },
                    px: { xs: 1, md: 0 },
                    background: "#fff",
                }}
            >
                <Container maxWidth="lg" sx={{ width: "100%", px: 1 }}>
                    {/* Profile Settings Tab */}
                    <TabPanel value={value} index={0}>
                        <ProfileSetting />
                    </TabPanel>

                    {/* Change Password Tab */}
                    <TabPanel value={value} index={1}>
                        <ChangePassword />
                    </TabPanel>

                    {/* Logout Tab */}
                    <TabPanel value={value} index={2}>
                        <Logout />
                    </TabPanel>
                </Container>
            </Box>
        </Box>
    );
};

export default Settings;
