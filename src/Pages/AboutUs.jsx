import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { inputStyle } from "../Components/Trips/AddTrip";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useState } from "react";
import { useAddTeamMemberMutation } from "../Redux/services/aboutApis";
import TeamMembers from "../smallComponents/TeamMembers";

const array = [
  {
    name: "Photo",
    title: "Photo",
    pixel: "1128 * 379 Pixel",
    type: "file",
    plach: "Upload Banner Image",
    required: true,
  },
  {
    name: "name",
    title: "Name",

    type: "text",

    required: true,
  },
  {
    name: "position",
    title: "Position",

    type: "text",

    required: true,
  },
];
const AboutUs = () => {
  const [aboutData, setAboutData] = useState({
    position: "",
    name: "",
    Photo: null,
  });

  console.log("AboutData....", aboutData);
  const handleChange = (name, value) => {
    setAboutData((aboutData) => ({
      ...aboutData,
      [name]: value, // Update form data with new input value
    }));
  };
  const handleFileChange = (name, file) => {
    setAboutData((aboutData) => ({
      ...aboutData,
      [name]: file, // Update form data with new file value
    }));
  };
  const handleImageUpload = (e, name) => {
    const file = e.target.files[0];
    handleFileChange(name, file);
  };
  const [addTeamMember] = useAddTeamMemberMutation();

  const handleAboutSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append form data fields to formDataToSend
      formDataToSend.append("Name", aboutData.name);
      formDataToSend.append("Position", aboutData.position);
      formDataToSend.append("Photo", aboutData.Photo);
      const res = await addTeamMember(formDataToSend).unwrap();
      console.log("res....", res);
    } catch (error) {
      console.log("Error in about ...", error);
    }
  };

  return (
    <Box>
      <form onSubmit={handleAboutSubmit} action="">
        <Box maxWidth="xl" sx={{ width: "100%", px: 1 }}>
          <Typography
            sx={{
              color: "#393938",
              fontFamily: "Ubuntu",
              fontSize: "22px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "140%",
            }}
          >
            Team Members
          </Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              p: 3,
            }}
          >
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
              Add Member
            </Typography>
            {/* <DeleteOutlinedIcon sx={{ color: "#000", fontSize: "25px" }} /> */}
          </Box>
          <Box sx={{ border: "2px solid #E5E7EB", p: 3, borderRadius: "10px" }}>
            <Grid
              container
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                gap: "0px 20px",
              }}
            >
              {array.map(
                ({ plach, name, required, title, type, pixel }, index) => {
                  return (
                    <Grid
                      key={index}
                      item
                      xs={12}
                      sm={5.7}
                      md={3.7}
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
                          <TextField
                            sx={inputStyle}
                            size="small"
                            placeholder="Upload Itinerary"
                            type="file"
                            name={name}
                            onChange={(e) => handleImageUpload(e, name)}
                            required
                          />
                        ) : (
                          <TextField
                            sx={inputStyle}
                            size="small"
                            name={name}
                            placeholder={plach}
                            type={type}
                            required={required}
                            onChange={(e) => handleChange(name, e.target.value)}
                          />
                        )}
                        {/* <TextField
                      sx={inputStyle}
                      size="small"
                      placeholder={plach}
                      type={type}
                      required={required}
                    /> */}
                        <Typography
                          sx={{ color: "#7F8490", textAlign: "end", mt: 1 }}
                        >
                          {pixel}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                }
              )}
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
                  width: "100px",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
          <Box>
            {/* <Button sx={{ color: "#CE4C2F", fontWeight: 600, mt: 3 }}>
            <span
              style={{
                fontSize: "30px",
                marginRight: "10px",
                fontWeight: 400,
              }}
            >
              +
            </span>{" "}
            Add Number
          </Button> */}
          </Box>
        </Box>
      </form>
      <Box sx={{ p: 1, mt: 5 }}>
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
          All Member
        </Typography>
        <Box
          sx={{
            color: "#000",
            border: "2px solid #E5E7EB",
            p: 3,
            borderRadius: "10px",
          }}
        >
          <TeamMembers />
        </Box>
      </Box>
    </Box>
  );
};

export default AboutUs;
