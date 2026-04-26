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
import React, { useEffect, useState } from "react";
import { inputStyle } from "../Trips/AddTrip";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { useUpdateCouponMutation } from "../../Redux/services/coupenApi";

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

const CouponDetail = ({ copon }) => {
  console.log("copon id ....", copon?._id);
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
    if (copon) {
      setFormData({
        Coupon_percentage: copon?.Coupon_percentage || "",
        Coupon_Name: copon?.Coupon_Name || "",
        Description: copon?.Description || "",
        Coupon_Title: copon?.Coupon_Title || "",
        Select_Coupon_type: copon?.Select_Coupon_type || "",
      });
    }
  }, [copon]);
  // Form Data State
  const [formData, setFormData] = useState({
    Coupon_percentage: "",
    Coupon_Name: "",
    Description: "",
    Coupon_Title: "",
    Select_Coupon_type: "",
  });

  const array = [
    {
      name: "Coupon_Title",
      title: "Coupon Title",
      type: "text",
      value: formData?.Coupon_Title,
    },
    {
      name: "Description",
      title: "Description",
      text: "",
      type: "Description",
      value: formData?.Description,
    },
  ];

  console.log("formData", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [updateCoupon] = useUpdateCouponMutation();

  const HandleUpdateCopun = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await updateCoupon({
        Select_Coupon_type: formData.Select_Coupon_type,
        Coupon_Title: formData.Coupon_Title,
        Description: formData.Description,
        Coupon_Name: formData.Coupon_Name,
        Coupon_percentage: formData.Coupon_percentage,
        _id: copon?._id,
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
            Overview
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            border: "1px solid #E5E7EB",
            borderRadius: "10px",
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "30%", md: "20%" },
              display: "flex",
              alignItems: "left",
              flexDirection: "column",
              justifyContent: "center",
              p: 2,
              borderRight: { xs: "none", sm: "2px solid #E5E7EB" },
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                color: " #3E92CC",
                width: "100%",
              }}
            >
              33
            </Typography>
            <Typography sx={{ color: "#6D7280", mt: 1 }}>
              Total Redeemed
            </Typography>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "30%", md: "20%" }, p: 3 }}>
            <Box
              sx={{
                border: "1px solid #E5E7EB",
                borderRadius: "10px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",

                p: 0.7,
              }}
            >
              <Typography
                sx={{
                  fontSize: "19px",
                  fontWeight: 400,
                  color: "#F6D683",
                }}
              >
                MKNT10
              </Typography>
              <ContentCopyOutlinedIcon sx={{ color: "#9CA3AF" }} />
            </Box>
            <Typography sx={{ color: "#6D7280", mt: 1 }}>
              Coupon Code
            </Typography>
          </Box>
        </Box>
      </Container>
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
        <form action="" onSubmit={HandleUpdateCopun}>
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
                      value={
                        formData?.Select_Coupon_type ||
                        "Marketing Campaign Coupon"
                      }
                      size="medium"
                      helperText="Please select your currency"
                      onChange={handleChange}
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
              {array.map(({ required, title, type, name, value }, index) => {
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
                    value={formData?.Coupon_Name || ""}
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
                    value={formData?.Coupon_percentage || ""}
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

export default CouponDetail;
