import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { inputStyle } from "../../Trips/AddTrip";
import Toastify from "../../../smallComponents/Toastify";

const ProfileSetting = () => {
    const { userData } = useSelector((state) => state.users);

    // Profile state
    const [profileData, setProfileData] = useState({
        name: userData?.name || "",
        email: userData?.email || "",
        phone: userData?.phone || "",
    });

    const [alertState, setAlertState] = useState({
        open: false,
        message: "",
        severity: undefined,
    });

    const showToast = (msg, type) => {
        return setAlertState({
            open: true,
            message: msg,
            severity: type,
        });
    };

    const handleProfileChange = (name, value) => {
        setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        // TODO: Add update profile API when backend is ready
        showToast("Profile update feature coming soon", "info");
    };

    const profileFields = [
        {
            name: "name",
            title: "Name*",
            type: "text",
            plach: "Enter your name",
            required: true,
        },
        {
            name: "email",
            title: "Email*",
            type: "email",
            plach: "Enter your email",
            required: true,
        },
        {
            name: "phone",
            title: "Phone*",
            type: "text",
            plach: "Enter your phone number",
            required: true,
        },
    ];

    return (
        <>
            <Toastify setAlertState={setAlertState} alertState={alertState} />
            <Box sx={{ width: "100%", mb: 3 }}>
                <Typography
                    sx={{
                        color: "#393938",
                        fontFamily: "Ubuntu",
                        fontSize: "19px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",
                        p: { xs: 1, sm: 2, md: 3 },
                    }}
                >
                    Profile Settings
                </Typography>
            </Box>
            <Box
                sx={{
                    border: "2px solid #E5E7EB",
                    p: { xs: 1, sm: 2, md: 3 },
                    borderRadius: "10px",
                }}
            >
                <form onSubmit={handleProfileSubmit}>
                    <Grid
                        container
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "0px 20px",
                        }}
                    >
                        {profileFields.map(({ plach, required, title, name, type }, index) => {
                            return (
                                <Grid
                                    key={index}
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    sx={{ width: "100%", mt: 3 }}
                                >
                                    <Box sx={{ width: "100%" }}>
                                        <Typography
                                            sx={{
                                                color: "#737373",
                                                textAlign: "left",
                                                mb: 1,
                                            }}
                                        >
                                            {title}
                                        </Typography>
                                        <TextField
                                            sx={inputStyle}
                                            size="small"
                                            placeholder={plach}
                                            type={type}
                                            required={required}
                                            name={name}
                                            value={profileData[name] || ""}
                                            onChange={(e) => handleProfileChange(name, e.target.value)}
                                            disabled={name === "email"}
                                        />
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "0px 10px",
                            width: "100%",
                            justifyContent: "end",
                            p: { xs: 1, sm: 2, md: 2 },
                            mt: 3,
                        }}
                    >
                        <Button
                            type="submit"
                            sx={{
                                color: "#fff",
                                background: "#EC3F18",
                                borderRadius: "32px",
                                width: "100px",
                                "&:hover": {
                                    color: "#EC3F18",
                                    border: "2px solid #EC3F18",
                                },
                            }}
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
        </>
    );
};

export default ProfileSetting;

