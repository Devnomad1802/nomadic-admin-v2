import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { signupbg } from "../Images";

import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { inputStyle } from "../Components/Trips/UpdateTrip";
import { useDispatch } from "react-redux";
import {
  useLoginUserMutation,
} from "../Redux/services/authApis";
import { setUserDbData } from "../Redux/slices";
import Loading from "../smallComponents/Loading";
import Toastify from "../smallComponents/Toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Loading
  const [login] = useLoginUserMutation();
  // Login
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  console.log("signin data", signInData);
  const [loading, setLoading] = React.useState(false);

  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });

  // Show Toast
  const showToast = (msg, type) => {
    return setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };
  //Login Function
  const handleLogin = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await login(signInData).unwrap();
        console.log("Login response data:", data);

        if (data?.user?.role === "Admin") {
          localStorage.setItem("token", data?.token);
          dispatch(setUserDbData(data?.user));
          showToast(data?.message, "success");
          navigate("/");
        } else {
          showToast("Invalid Admin!", "error");
        }
        setLoading(false);
      } catch (error) {
        showToast(error?.data?.message, "error");
        console.log(error);
        setLoading(false);
      }
    },
    [dispatch, login, navigate, signInData]
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
                  <Box sx={{ height: "460px" }}>
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
                Login
              </Typography>

              <form onSubmit={handleLogin}>
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
                  {/* <Box>
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
                  </Box> */}
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
                <Typography sx={{ color: "#939393", textAlign: "left" }}>
                  Don’t have an account yet?
                  <Link
                    to="/signup"
                    style={{ color: "#CD482A", marginLeft: "10px" }}
                  >
                    Create One
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Login;
