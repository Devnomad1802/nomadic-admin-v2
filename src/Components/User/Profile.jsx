/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { inputStyle } from "../Trips/AddTrip";
import { useState } from "react";
import { useInfluencerMutation } from "../../Redux/services";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";
import { useNavigate } from "react-router-dom";

const type = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "FeMale",
    label: "FeMale",
  },
];
const type2 = [
  {
    value: "No",
    label: "No",
  },
  {
    value: "Yes",
    label: "Yes",
  },
];

const Profile = ({ profile }) => {
  console.log("profile....", profile);

  const navigate = useNavigate();

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

  const array = [
    {
      name: "name",
      title: "Name",
      text: "",
      type: "text",
      value: profile?.name,

      required: true,
    },
    {
      name: "email",
      title: "Email",
      text: "",
      type: "text",
      value: profile?.email,
      required: true,
    },
    {
      name: "phone",
      title: "Phone",
      text: "",
      type: "number",
      value: profile?.phone,

      required: true,
    },
  ];

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    gender: profile?.influencer || "Male",
    influencer: profile?.influencer || "No",
    userId: profile?._id,
  });

  // console.log("formData....", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const [influencer] = useInfluencerMutation();
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await influencer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        influencer: formData.influencer,
        userId: formData.userId,
      }).unwrap();
      setLoading(false);
      navigate("/user");
    } catch (error) {
      console.log("Error", error);

      setLoading(false);
    }
  };
  return (
    <Container maxWidth="xl" sx={{ width: "100%" }}>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Box sx={{ width: "100%", mb: 2 }}>
        <Typography
          sx={{
            color: "#393938",
            fontFamily: "Ubuntu",
            fontSize: "19px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
            // height: "400px",
          }}
        >
          Basic Details
        </Typography>
      </Box>
      <form action="" onSubmit={handleSave}>
        <Box
          sx={{
            border: "2px solid #E5E7EB",
            width: { xs: "100%", md: "70%" },
            borderRadius: "10px",
          }}
        >
          <Grid
            container
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              gap: "0px 10px",
              p: 3,
            }}
          >
            {array.map(
              ({ plach, value, required, title, type, name }, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sm={5.8}
                    md={5.8}
                    sx={{
                      width: "100%",
                      mt: 3,
                    }}
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
                        size="medium"
                        placeholder={plach}
                        value={value}
                        type={type}
                        name={name}
                        required={required}
                        onChange={(e) => handleChange(e)}
                      />
                    </Box>
                  </Grid>
                );
              }
            )}
            <Grid item xs={12} md={5.8} sx={{ mt: 2.2 }}>
              <Box>
                <Box sx={{ height: "48px", pt: 0.8 }}>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Gender
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    id="outlined-select-currency"
                    select
                    defaultValue="Male"
                    size="medium"
                    name="gender"
                    onChange={(e) => handleChange(e)}
                  >
                    {type.map((option) => (
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
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ p: 3 }}>
            <Typography
              sx={{
                color: "#393938",
                fontFamily: "Ubuntu",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "140%",
                p: 2,
              }}
            >
              Influencer
            </Typography>
            <Box
              sx={{
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                p: { xs: 1, sm: 2, md: 3 },
                width: { xs: "100%", md: "70%" },
              }}
            >
              <Typography
                sx={{
                  color: "#737373",
                  textAlign: "left",
                  mb: 0.6,
                }}
              >
                Influencer
              </Typography>
              <Grid
                container
                sx={{
                  width: "100%",
                }}
              >
                <Grid item xs={12} md={5.8}>
                  <Box>
                    <Box sx={{ height: "48px", pt: 0.8 }}>
                      <TextField
                        sx={inputStyle}
                        id="outlined-select-currency"
                        select
                        defaultValue="No"
                        size="medium"
                        name="influencer"
                        helperText="Please select your currency"
                        onChange={(e) => handleChange(e)}
                        value={formData?.influencer || "No"}
                      >
                        {type2.map((option) => (
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
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "0px 20px",

              width: "100%",
              justifyContent: "end",
              p: 3,
            }}
          >
            <Button
              sx={{
                color: "#EC3F18",
                border: "2px solid #EC3F18",
                borderRadius: "32px",
                width: "100px",
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
                  background: "#EC3F18",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </Container>
  );
};

export default Profile;
