import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { inputStyle } from "../../Trips/AddTrip";
import Toastify from "../../../smallComponents/Toastify";
import Loading from "../../../smallComponents/Loading";
import { useChangePassMutation } from "../../../Redux/services/authApis";

const ChangePassword = () => {
    const [changePass, { isLoading: isChangingPass }] = useChangePassMutation();

    // Password change state
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const [loading, setLoading] = useState(false);
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

    const handlePasswordChange = (name, value) => {
        setPasswordData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!passwordData.oldPassword?.trim()) {
            showToast("Old password is required", "error");
            return;
        }
        if (!passwordData.newPassword?.trim()) {
            showToast("New password is required", "error");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showToast("New password must be at least 6 characters", "error");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast("New password and confirm password do not match", "error");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const response = await changePass({
                token,
                password: passwordData.newPassword,
            }).unwrap();

            setLoading(false);
            showToast(response?.message || "Password changed successfully", "success");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setLoading(false);
            showToast(error?.data?.message || "Failed to change password", "error");
        }
    };

    const passwordFields = [
        {
            name: "oldPassword",
            title: "Old Password*",
            type: "password",
            plach: "Enter old password",
            required: true,
        },
        {
            name: "newPassword",
            title: "New Password*",
            type: "password",
            plach: "Enter new password",
            required: true,
        },
        {
            name: "confirmPassword",
            title: "Confirm Password*",
            type: "password",
            plach: "Confirm new password",
            required: true,
        },
    ];

    return (
        <>
            <Loading isLoading={loading || isChangingPass} />
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
                    Change Password
                </Typography>
            </Box>
            <Box
                sx={{
                    border: "2px solid #E5E7EB",
                    p: { xs: 1, sm: 2, md: 3 },
                    borderRadius: "10px",
                }}
            >
                <form onSubmit={handlePasswordSubmit}>
                    <Grid
                        container
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start",
                            gap: "0px 20px",
                        }}
                    >
                        {passwordFields.map(({ plach, required, title, name }, index) => {
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
                                            type={showPasswords[name] ? "text" : "password"}
                                            required={required}
                                            name={name}
                                            value={passwordData[name] || ""}
                                            onChange={(e) => handlePasswordChange(name, e.target.value)}
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
                            sx={{
                                color: "#EC3F18",
                                border: "2px solid #EC3F18",
                                borderRadius: "32px",
                                width: "100px",
                                "&:hover": {
                                    color: "#fff",
                                    background: "#EC3F18",
                                },
                            }}
                            onClick={() => {
                                setPasswordData({
                                    oldPassword: "",
                                    newPassword: "",
                                    confirmPassword: "",
                                });
                            }}
                        >
                            Cancel
                        </Button>
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

export default ChangePassword;

