import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Container,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { signupbg } from "../Images";
// import BasicRating from "../SmallComponents/Rating";

import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useCallback } from "react";
import PhoneNumber from "../smallComponents/PhoneNumber";
import { inputStyle } from "../Components/Trips/UpdateTrip";
import Loading from "../smallComponents/Loading";
import Toastify from "../smallComponents/Toastify";
import { useRegisterUserMutation } from "../Redux/services/authApis";

// eslint-disable-next-line react/prop-types
export default function SignUp() {
  const navigate = useNavigate();

  // Loading
  const [loading, setLoading] = React.useState(false);

  // Show Toast
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
  // show Password
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Register User
  const [register] = useRegisterUserMutation();

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  console.log("registerData", registerData);

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  const handleRegister = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await register(registerData).unwrap();
        console.log("data", data);
        localStorage.setItem("token", data?.token);
        showToast(data?.message, "success");
        setLoading(false);
        navigate("/email-verification", {
          state: { email: registerData.email },
        });
      } catch ({ data }) {
        setLoading(false);
        showToast(data?.message, "error");
        console.log("data from Backend", data);
      }
    },
    [navigate, register, registerData]
  );

  return (
    <>
      <Box sx={{ background: "#FFFFFF" }}>
        <Container
          maxWidth="md"
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading isLoading={loading} />{" "}
          <Toastify setAlertState={setAlertState} alertState={alertState} />
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: { xs: 1, sm: 2, md: 5 },
              borderRadius: "10px",
              boxShadow: 1,
              // alignItems: "center",
            }}
          >
            <Hidden mdDown>
              <Grid item xs={12} md={5.5} sx={{ height: "auto" }}>
                <Box
                  sx={{ height: "100%", width: "100%", position: "relative" }}
                >
                  <Box sx={{ height: "550px" }}>
                    <img
                      src={signupbg}
                      alt=""
                      srcSet=""
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "100% 100%",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Hidden>
            <Grid
              xs={12}
              md={6}
              sx={{
                px: { xs: 1, sm: 2 },
                height: "100%",

                display: "flex",
                flexDirection: "column",
                gap: "20px 0px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "20px", md: "28px" },
                  color: "#000",
                  textAlign: "left",

                  position: "relative",
                }}
              >
                Create Account
              </Typography>

              <form onSubmit={handleRegister}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px 0px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Name
                    </Typography>
                    <TextField
                      sx={inputStyle}
                      size="small"
                      placeholder="Jhon Smith"
                      name="name"
                      onChange={handleChange}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Mobile
                    </Typography>
                    <PhoneNumber
                      handleChange={handleChange}
                      setRegisterData={setRegisterData}
                      registerData={registerData}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Email
                    </Typography>
                    <TextField
                      name="email"
                      type="email"
                      sx={inputStyle}
                      size="small"
                      placeholder="jhon@gmail.com"
                      onChange={handleChange}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Password
                    </Typography>
                    <TextField
                      name="password"
                      onChange={handleChange}
                      sx={inputStyle}
                      size="small"
                      placeholder="#inclu%89Kl.@59"
                      type={showPassword ? "text" : "password"}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              sx={{ color: "#393938" }}
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? (
                                <Visibility sx={{ color: "#393938" }} />
                              ) : (
                                <VisibilityOff sx={{ color: "#393938" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  type="submit"
                  variant="simplebtn"
                  sx={{
                    width: "100%",
                    background: "#EC3F18",
                    color: "#fff",
                    mt: 2,
                  }}
                >
                  Submit
                </Button>
              </form>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "0px 10px",
                }}
              >
                <Typography
                  sx={{ color: "#939393", textAlign: "left", fontSize: "13px" }}
                >
                  Already have an account ?{" "}
                  {/* <Link style={{ color: "#CD482A" }}>Log In</Link> */}
                </Typography>
                <Box>
                  <Button
                    onClick={() => {
                      navigate("/");
                    }}
                    variant="simplebtn"
                    sx={{
                      background: "#393938",
                      color: "#fff",
                      border: "1px solid #393938",
                      "&:hover": {
                        background: "transparent",
                        border: "1px solid #CD482A",
                        color: "#CD482A",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
