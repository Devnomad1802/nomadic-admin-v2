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
import { inputStyle2 } from "../Booking/BookingTable";
import { useAddReviewMutation } from "../../Redux/services";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";

const array = [
  {
    name: "title",
    title: "Title",

    type: "text",

    required: true,
  },
  {
    name: "name",
    title: "Name",

    type: "text",

    required: true,
  },
  {
    name: "job",
    title: "Job",
    text: "",
    type: "text",

    required: true,
  },

  {
    name: "profileimage",
    title: "Profile Image",
    text: "",
    pixel: "62 * 62 Pixel",
    type: "file",

    required: true,
  },
];

const rating = [
  {
    value: "1",
    label: "1",
  },
  {
    value: "2",
    label: "2",
  },
  {
    value: "3",
    label: "3",
  },
  {
    value: "4",
    label: "4",
  },
  {
    value: "5",
    label: "5",
  },
];
const AddReview = () => {
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

  const [review, setReview] = useState({
    title: "",
    job: "",
    name: "",
    rating: 4,
    profileimage: null,
    Review: "",
  });
  console.log("review", review);

  const handleChange = (name, value) => {
    setReview((prevState) => ({
      ...prevState,
      [name]: value, // Update form data with new input value
    }));
  };

  const handleFileChange = (name, file) => {
    setReview((prevState) => ({
      ...prevState,
      [name]: file, // Update form data with new file value
    }));
  };

  const handleImageUpload = (e, name) => {
    const file = e.target.files[0];
    handleFileChange(name, file);
  };

  const [addReview] = useAddReviewMutation();

  const SubmitReview = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("Name", review?.name);
      formDataToSend.append("Title", review?.title);
      formDataToSend.append("Review", review?.Review);
      formDataToSend.append("rating", review?.rating);
      formDataToSend.append("Job", review?.job);
      formDataToSend.append("Profile_Image", review?.profileimage);

      const res = await addReview(formDataToSend).unwrap();
      console.log("res.....", res);
      setLoading(false);
      showToast(res?.message, "success");
    } catch (error) {
      setLoading(false);
      console.log("error", error);
      showToast("Server Error ", "error");
    }
  };
  return (
    <Box>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <form action="" onSubmit={SubmitReview}>
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
              }}
            >
              Basic Details
            </Typography>
          </Box>
          <Box
            sx={{
              border: " 1px solid #E5E7EB",
              borderRadius: "10px",
              mt: 3,
              p: 2,
            }}
          >
            <Grid
              container
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                gap: "0px 20px",
                p: 2,
              }}
            >
              {array.map(
                ({ plach, name, required, title, type, pixel }, index) => {
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
                        {type === "file" ? (
                          <>
                            <TextField
                              sx={inputStyle}
                              name={name}
                              size="small"
                              placeholder={plach}
                              type={type}
                              required={required}
                              onChange={(e) => handleImageUpload(e, name)}
                            />
                            {pixel && (
                              <>
                                <Typography
                                  sx={{
                                    color: "#737373",
                                    textAlign: "right",
                                    mt: 1,
                                    fontSize: "12px",
                                  }}
                                >
                                  {pixel}
                                </Typography>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <TextField
                              sx={inputStyle}
                              size="small"
                              placeholder={plach}
                              type={type}
                              name={name}
                              required={required}
                              onChange={(e) =>
                                handleChange(name, e.target.value)
                              }
                            />
                          </>
                        )}
                      </Box>
                    </Grid>
                  );
                }
              )}
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
                    Reviews
                  </Typography>
                  <TextField
                    sx={inputStyle2}
                    id="outlined-select-currency"
                    select
                    defaultValue="4"
                    style={{ minWidth: "100px" }}
                    size="small"
                    name="ratings"
                    onChange={(e) => handleChange("rating", e.target.value)}
                  >
                    {rating.map((option) => (
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
              </Grid>
            </Grid>
            <Box
              sx={{
                width: { xs: "100%", md: "66%" },
                p: 2,
              }}
            >
              <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                Review
              </Typography>
              <textarea
                style={{
                  border: "1px solid #E7E7E7",
                  width: "100%",
                  outline: "none",
                  borderColor: "#E7E7E7",
                  transition: "border-color 0.3s ease",
                  borderRadius: "10px",
                }}
                size="small"
                rows="8"
                name="Review"
                onChange={(e) => handleChange("Review", e.target.value)}
                onFocus={() => {
                  // Change the border color when the textarea is focused
                  document.querySelector("textarea").style.borderColor =
                    "#E7E7E7";
                }}
                onBlur={() => {
                  // Change the border color back to the original when the textarea loses focus
                  document.querySelector("textarea").style.borderColor =
                    "#E7E7E7";
                }}
              />
            </Box>
            <Box
              sx={{
                width: "100%",
                p: 3,
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
                Save
              </Button>
            </Box>
          </Box>
        </Container>
      </form>
    </Box>
  );
};

export default AddReview;
