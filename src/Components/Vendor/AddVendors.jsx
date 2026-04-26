import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { inputStyle } from "../Trips/AddTrip";
import PhoneNumber from "../../smallComponents/PhoneNumber";
import { useState } from "react";
import { useAddVendorMutation } from "../../Redux/services/vanderApi";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";

const array = [
  {
    name: "firstName",
    title: "First Name",
    type: "text",
    required: true,
  },
  {
    name: "lastName",
    title: "Last Name",
    type: "text",
    required: true,
  },
  {
    name: "email",
    title: "Email",
    text: "",
    type: "email",
    required: true,
  },
];

const AddVendors = () => {
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

  console.log("formData......", formData);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [addVendor] = useAddVendorMutation();
  // Submit Vander

  const vanderSubmited = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addVendor({
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Location: formData.location,
        Email: formData.email,
        Mobile_1: formData.phone,
        Remarks: formData.remarks,
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
        <Loading isLoading={loading} />
        <Toastify setAlertState={setAlertState} alertState={alertState} />
        <form action="" onSubmit={vanderSubmited}>
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
              {array.map(({ plach, required, title, name, type }, index) => {
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
                        onChange={handleChange}
                        required={required}
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
                    value={formData.location}
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Box sx={{ width: "100%", mb: 5 }}>
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
                <textarea
                  size="small"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  rows={5}
                />
              </Box>
            </Grid>
            <Grid container></Grid>
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
                save
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default AddVendors;
