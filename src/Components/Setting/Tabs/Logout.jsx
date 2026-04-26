import { Box, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toastify from "../../../smallComponents/Toastify";
import { logout } from "../../../Redux/slices/userSlice";
import { useState } from "react";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(logout());
        navigate("/login");
        showToast("Logged out successfully", "success");
    };

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
                    Account Actions
                </Typography>
            </Box>
            <Box
                sx={{
                    border: "2px solid #E5E7EB",
                    p: { xs: 1, sm: 2, md: 3 },
                    borderRadius: "10px",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography
                        sx={{
                            color: "#737373",
                            textAlign: "left",
                            mb: 1,
                        }}
                    >
                        Logout from your account
                    </Typography>
                    <Button
                        onClick={handleLogout}
                        sx={{
                            color: "#fff",
                            background: "#EC3F18",
                            borderRadius: "32px",
                            width: "150px",
                            "&:hover": {
                                color: "#EC3F18",
                                border: "2px solid #EC3F18",
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default Logout;

