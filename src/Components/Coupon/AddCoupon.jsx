import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { inputStyle } from "../Trips/AddTrip";
import { useAddCouponMutation } from "../../Redux/services/coupenApi";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";

const type = [
  {
    value: "Marketing Campaign Coupon",
    label: "Marketing Campaign Coupon",
  },
  {
    value: "Platform Coupon",
    label: "Platform Coupon",
  },
];

const array = [
  {
    name: "Coupon_Title",
    title: "Coupon Title",
    type: "text",
    required: true,
  },
  {
    name: "Description",
    title: "Description",
    type: "text",
    required: true,
  },
];

const AddCoupon = () => {
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

  // Form Data State
  const [formData, setFormData] = useState({
    Coupon_percentage: "",
    Coupon_Name: "",
    Description: "",
    Coupon_Title: "",
    Select_Coupon_type: "",
  });

  console.log("formData", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [addCoupon] = useAddCouponMutation();

  const addCouponSubmited = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await addCoupon({
        Select_Coupon_type: formData.Select_Coupon_type,
        Coupon_Title: formData.Coupon_Title,
        Description: formData.Description,
        Coupon_Name: formData.Coupon_Name,
        Coupon_percentage: formData.Coupon_percentage,
      }).unwrap();
      console.log("res", res);
      setLoading(false);
      showToast(res?.message, "success");
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
        <form action="" onSubmit={addCouponSubmited}>
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
              <Grid item xs={12} md={3.8} sx={{ mt: 2.2 }}>
                <Box>
                  <Box sx={{ height: "48px", pt: 0.8 }}>
                    <Typography
                      sx={{
                        color: "#737373",
                        textAlign: "left",
                        mb: 1,
                      }}
                    >
                      Select Coupon type
                    </Typography>
                    <TextField
                      sx={inputStyle}
                      id="outlined-select-currency"
                      select
                      name="Select_Coupon_type"
                      value={formData.Select_Coupon_type}
                      onChange={handleChange}
                      size="medium"
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
              {array.map(({ name, required, title, type }, index) => {
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
                        name={name}
                        type={type}
                        required={required}
                        value={formData[name]}
                        onChange={handleChange}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            <Box
              sx={{
                height: "1px",
                border: "1px solid #E8EAEC",
                width: "100%",
                mt: 3,
              }}
            />

            <Grid container gap={2.5}>
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
                    Coupon Name
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="Coupon_Name"
                    value={formData.Coupon_Name}
                    onChange={handleChange}
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
                    Coupon percentage
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="Coupon_percentage"
                    value={formData.Coupon_percentage}
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
                onClick={() => console.log(formData)}
              >
                Publish
              </Button>
            </Box>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default AddCoupon;
