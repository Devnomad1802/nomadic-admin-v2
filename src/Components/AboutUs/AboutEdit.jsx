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
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { baseImage } from "../../Redux/utils";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";
import { useUpdateTeamMemberMutation } from "../../Redux/services/aboutApis";

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

const AboutEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { aboutData } = location.state || {};
  console.log("aboutData", aboutData);

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

  const [profileImage, setProfileImage] = useState(null); // New state for profile image
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    position: "",
  });

  // console.log("formData....", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setFormData({
      photo: aboutData?.Photo || "",
      name: aboutData?.Name || "",
      position: aboutData?.Position || "",
    });
  }, [aboutData?.Name, aboutData?.Photo, aboutData?.Position]);

  const [updateTeamMember] = useUpdateTeamMemberMutation();

  const handleEditTeamMember = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Append form data fields to formDataToSend
      formDataToSend.append("Name", formData?.name);
      formDataToSend.append("Position", formData?.position);
      formDataToSend.append("Photo", profileImage);
      formDataToSend.append("_id", aboutData?._id);
      const res = await updateTeamMember(formDataToSend).unwrap();
      console.log("res", res);
      setLoading(false);
      navigate("/aboutUs");
    } catch (error) {
      console.log("error", error);
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
          Edit Member
        </Typography>
      </Box>
      <form onSubmit={handleEditTeamMember}>
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
            {/* <Grid item xs={12} md={5.8}> */}
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  color: "#737373",
                  textAlign: "left",
                  mb: 1,
                }}
              >
                Photo
              </Typography>
              <Box
                sx={{
                  display: " flex",
                  gap: "20px 0px",
                  flexDirection: "column",

                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: { xs: "70px", sm: "90px", md: "100px" },
                    height: { xs: "70px", sm: "90px", md: "100px" },
                  }}
                >
                  {/* Display uploaded image preview or placeholder */}
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : `${baseImage}${formData?.photo}`
                    }
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      //   borderRadius: "50%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
                <Button
                  onClick={handleButtonClick}
                  sx={{
                    my: "auto",
                    color: "#fff",
                    background: "#EC3F18",
                    borderRadius: "32px",
                    width: "110px",
                    height: "40px",
                    fontSize: "13px",
                    "&:hover": {
                      color: "#EC3F18",
                      border: "1px solid #EC3F18",
                    },
                  }}
                >
                  Upload
                </Button>
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  name="photo"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </Box>
            </Box>
            {/* </Grid> */}
            <Grid item xs={12} md={5.8}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Name
                </Typography>
                <TextField
                  sx={inputStyle}
                  size="medium"
                  placeholder="Name"
                  value={formData?.name || ""}
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={5.8}>
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Position
                </Typography>
                <TextField
                  sx={inputStyle}
                  size="medium"
                  placeholder="Position"
                  value={formData?.position || ""}
                  type={type}
                  name="position"
                  required
                  onChange={handleChange}
                />
              </Box>
            </Grid>
          </Grid>
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
                width: "110px",
                height: "40px",
                fontSize: "16px",
                "&:hover": {
                  color: "#EC3F18",
                  border: "1px solid #EC3F18",
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

export default AboutEdit;
