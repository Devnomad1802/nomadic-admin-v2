/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { inputStyle } from "../Trips/AddTrip";
import PhoneNumber from "../../smallComponents/PhoneNumber";
import { useUpdateVendorMutation } from "../../Redux/services/vanderApi";

const Profile = ({ vender }) => {
  // Loading Toast
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

  useEffect(() => {
    if (vender) {
      setFormData({
        firstName: vender?.First_Name || "",
        lastName: vender?.Last_Name || "",
        email: vender?.Email || "",
        phone: vender?.Mobile_1 || "",
        phone2: "",
        location: vender?.Location || "",
        remarks: vender?.Remarks || "",
      });
    }
  }, [vender]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    phone2: "",
    location: "",
    remarks: "",
  });

  const array = [
    {
      name: "firstName", // This should match your formData state key
      title: "First Name",
      type: "text",
      required: true,
      value: formData?.firstName,
    },
    {
      name: "lastName", // Corrected to match formData key
      title: "Last Name",
      type: "text",
      required: true,
      value: formData?.lastName,
    },
    {
      name: "email", // Corrected to match formData key
      title: "Email",
      type: "email",
      required: true,
      value: formData?.email,
    },
  ];

  console.log("formData......", formData);

  // Handle input change
  const handleChange = (e) => {
    console.log("Changing field:", e.target.name, "Value:", e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [updateVendor] = useUpdateVendorMutation();
  // Submit Vander

  const vanderSubmited = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateVendor({
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Location: formData.location,
        Email: formData.email,
        Mobile_1: formData.phone,
        Remarks: formData.remarks,
        _id: vender?._id,
      });
      console.log("res", res);
      setLoading(false);
      showToast(res?.data?.message, "success");
    } catch (error) {
      console.log("error", error);
      setLoading(true);
    }
  };
  return (
    <>
      <Container maxWidth="lg" sx={{ width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{
              color: "#393938",
              fontFamily: "Ubuntu",
              fontSize: "19px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              p: 3,
            }}
          >
            Basic Details
          </Typography>
        </Box>
        <form action="" onSubmit={vanderSubmited}>
          <Box sx={{ border: "1px solid #E5E7EB", p: 3, borderRadius: "10px" }}>
            <Grid
              container
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                gap: "0px 20px",
              }}
            >
              {array.map(({ required, title, type, value, name }, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sm={5.8}
                    md={3.8}
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
                        type={type}
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                      />
                    </Box>
                  </Grid>
                );
              })}
              <Grid
                item
                xs={12}
                sm={5.8}
                md={3.8}
                sx={{ width: "100%", mt: 3 }}
              >
                <Box>
                  <Typography
                    sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                  >
                    Mobile 1
                  </Typography>
                  <PhoneNumber
                    handleChange={handleChange}
                    setRegisterData={setFormData}
                    registerData={formData}
                  />
                </Box>
              </Grid>
              {/* <Grid item xs={12} sm={5.8} md={3.8} sx={{ width: "100%", mt: 3 }}>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                  Mobile 2
                </Typography>
                <PhoneNumber />
              </Box>
            </Grid> */}
            </Grid>
            <Grid container>
              <Grid
                item
                xs={12}
                sm={5.8}
                md={3.8}
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
                    Location
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="location"
                    value={formData?.location || ""}
                    onChange={handleChange}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                      mt: 3,
                    }}
                  >
                    Remarks
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="remarks"
                    value={formData?.remarks || ""}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                width: "100%",

                display: "flex",
                justifyContent: "end",
                gap: "0px 10px",
              }}
            >
              <Button
                sx={{
                  color: "#EC3F18",
                  border: "2px solid #EC3F18",
                  borderRadius: "32px",
                  fontWeight: 700,
                  width: "100px",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                sx={{
                  backgroundColor: "#EC3F18",
                  borderRadius: "32px",
                  color: "#fff",
                  width: "100px",
                }}
              >
                Pablish
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default Profile;
