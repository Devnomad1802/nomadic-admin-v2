import {
  Box,
  Button,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { inputStyle } from "../Components/Trips/AddTrip";
import { useEffect, useState } from "react";
import {
  useAddCoverImageMutation,
  useGetAllBannerQuery,
} from "../Redux/services";
import Loading from "../smallComponents/Loading";
import Toastify from "../smallComponents/Toastify";

const Banner = () => {
  // Fetch previous banner / Cover images
  const { data } = useGetAllBannerQuery();

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({});

  // State for video previews - separate from image previews
  const [videoPreviews, setVideoPreviews] = useState({});

  // State to track existing home URLs from API (not File objects)
  const [existingHomeUrls, setExistingHomeUrls] = useState([]);

  // Toggle state for video enable/disable
  const [toggle, setToggle] = useState(false);
  // Editable homepage category-section copy
  const [catTitle, setCatTitle] = useState("");
  const [catSubtitle, setCatSubtitle] = useState("");

  // Load data from API
  useEffect(() => {
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      const item = data.data[0];

      const apiPreviews = {};
      const apiVideoPreviews = {};

      // Handle home images (array of URLs)
      if (item.home && Array.isArray(item.home) && item.home.length > 0) {
        apiPreviews.home = item.home;
        setExistingHomeUrls(item.home); // Track existing URLs
      }

      // Handle single image fields
      if (item.allPakeges) {
        apiPreviews.allPakeges = item.allPakeges;
      }
      
      if (item.blog) {
        apiPreviews.blog = item.blog;
      }
      
      if (item.aboutUs) {
        apiPreviews.aboutUs = item.aboutUs;
      }
      
      if (item.contactUS) {
        apiPreviews.contactUs = item.contactUS;
      }
      
      if (item.aboutSection) {
        apiPreviews.aboutSection = item.aboutSection;
      }
      
      if (item.footer) {
        apiPreviews.footer = item.footer;
      }

      // Handle video preview
      if (item.homeVideo) {
        apiVideoPreviews.homeVideo = {
          url: item.homeVideo,
          name: item.homeVideo.split("/").pop() || "video.mp4",
          file: null,
        };
      }
      
      setImagePreviews(apiPreviews);
      setVideoPreviews(apiVideoPreviews);
      
      // Set toggle state from API
      if (typeof item.toggle === 'boolean') {
        setToggle(item.toggle);
      }
      setCatTitle(item.categorySectionTitle || "");
      setCatSubtitle(item.categorySectionSubtitle || "");
    }
  }, [data]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreviews && typeof imagePreviews === "object") {
        Object.values(imagePreviews).forEach((urlOrArray) => {
          if (Array.isArray(urlOrArray)) {
            urlOrArray.forEach((url) => {
              if (url && url.startsWith("blob:")) {
                URL.revokeObjectURL(url);
              }
            });
          } else if (urlOrArray && typeof urlOrArray === "string" && urlOrArray.startsWith("blob:")) {
            URL.revokeObjectURL(urlOrArray);
          }
        });
      }

      if (videoPreviews && typeof videoPreviews === "object") {
        Object.values(videoPreviews).forEach((videoData) => {
          if (videoData && videoData.url && videoData.url.startsWith("blob:")) {
            URL.revokeObjectURL(videoData.url);
          }
        });
      }
    };
  }, [imagePreviews, videoPreviews]);

  // Form fields configuration
  const array = [
    {
      name: "home",
      title: "Home Images* (Multiple)",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Multiple Banner Images",
    },
    {
      name: "homeVideo",
      title: "Home Video*",
      pixel: "MP4, MOV, AVI (Max 50MB)",
      type: "video",
      plach: "Upload Video",
    },
    {
      name: "allPakeges",
      title: "All Packages*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
    {
      name: "aboutUs",
      title: "About Us*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
    {
      name: "blog",
      title: "Blogs*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
    {
      name: "contactUs",
      title: "Contact Us*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
    {
      name: "aboutSection",
      title: "About Section*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
    {
      name: "footer",
      title: "Footer Section*",
      pixel: "1128 * 379 Pixel",
      type: "file",
      plach: "Upload Card Image",
    },
  ];

  // Loading and toast states
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  
  const showToast = (msg, type) => {
    setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };

  // Banner form state
  const [banner, setBanner] = useState({
    home: [],
    allPakeges: null,
    blog: null,
    aboutUs: null,
    contactUs: null,
    aboutSection: null,
    footer: null,
    homeVideo: null,
  });

  // Handle deleting a specific home image
  const handleDeleteHomeImage = (index) => {
    const currentPreviews = imagePreviews.home || [];
    const urlToDelete = currentPreviews[index];
    
    // Remove from image previews
    setImagePreviews((prev) => {
      const newPreviews = currentPreviews.filter((_, idx) => idx !== index);
      return {
        ...prev,
        home: newPreviews,
      };
    });

    // Check if this is an existing URL or a new file blob
    if (urlToDelete && urlToDelete.startsWith("http")) {
      // It's an existing URL from API - remove from existingHomeUrls
      setExistingHomeUrls((prev) => prev.filter((url) => url !== urlToDelete));
    } else {
      // It's a new file (blob URL) - remove from banner.home
      // Calculate the index in banner.home (it only contains new files)
      const existingCount = existingHomeUrls.length;
      const fileIndex = index - existingCount;
      
      setBanner((prev) => {
        const currentFiles = prev.home || [];
        const newFiles = currentFiles.filter((_, idx) => idx !== fileIndex);
        return {
          ...prev,
          home: newFiles,
        };
      });
    }
  };

  // Handle image file uploads
  const handleImageUpload = (e, name) => {
    const files = Array.from(e.target.files);

    if (name === "home") {
      // Handle multiple files for home - ADD to existing images
      if (files.length > 0) {
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        
        setImagePreviews((prev) => {
          const existingPreviews = prev.home || [];
          return {
            ...prev,
            home: [...existingPreviews, ...newPreviewUrls],
          };
        });

        setBanner((prevState) => {
          const existingFiles = prevState.home || [];
          return {
            ...prevState,
            home: [...existingFiles, ...files],
          };
        });
        
        // Reset input so user can add the same files again
        e.target.value = "";
      }
    } else {
      // Handle single file for other fields
      const file = files[0];
      setBanner((prevState) => ({
        ...prevState,
        [name]: file,
      }));

      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreviews((prev) => ({
          ...prev,
          [name]: previewUrl,
        }));
      } else {
        setImagePreviews((prev) => ({
          ...prev,
          [name]: null,
        }));
      }
    }
  };

  // Handle video file uploads
  const handleVideoUpload = (e, name) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      const allowedTypes = [
        "video/mp4",
        "video/mov",
        "video/avi",
        "video/quicktime",
      ];
      if (!allowedTypes.includes(file.type)) {
        showToast("Please select a valid video file (MP4, MOV, AVI)", "error");
        return;
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        showToast("Video file size must be less than 50MB", "error");
        return;
      }

      // Update banner state with the file
      setBanner((prevState) => ({
        ...prevState,
        [name]: file,
      }));

      // Create video preview
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviews((prev) => ({
        ...prev,
        [name]: {
          url: previewUrl,
          file: file,
          name: file.name,
        },
      }));
    } else {
      // Clear video preview if no file selected
      setVideoPreviews((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // API mutation hook
  const [addCoverImage] = useAddCoverImageMutation();

  // Submit banner form
  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Handle home images: send both existing URLs and new files
      // The backend needs to know about existing images to keep
      if (existingHomeUrls && existingHomeUrls.length > 0) {
        // Send existing URLs as a JSON string so backend knows which ones to keep
        formDataToSend.append("existingHomeUrls", JSON.stringify(existingHomeUrls));
      }

      // Append new file uploads
      if (banner?.home && Array.isArray(banner.home) && banner.home.length > 0) {
        banner.home.forEach((file, index) => {
          formDataToSend.append(`home[${index}]`, file);
        });
      }

      // Append other fields only if they have values
      if (banner?.allPakeges) formDataToSend.append("allPakeges", banner.allPakeges);
      if (banner?.blog) formDataToSend.append("blog", banner.blog);
      if (banner?.aboutUs) formDataToSend.append("aboutUs", banner.aboutUs);
      if (banner?.contactUs) formDataToSend.append("contactUS", banner.contactUs);
      if (banner?.footer) formDataToSend.append("footer", banner.footer);
      if (banner?.aboutSection) formDataToSend.append("aboutSection", banner.aboutSection);
      if (banner?.homeVideo) formDataToSend.append("homeVideo", banner.homeVideo);
      
      formDataToSend.append("toggle", toggle);
      formDataToSend.append("categorySectionTitle", catTitle);
      formDataToSend.append("categorySectionSubtitle", catSubtitle);

      const response = await addCoverImage(formDataToSend).unwrap();
      setLoading(false);
      showToast(response?.message || "Banner updated successfully", "success");
    } catch (error) {
      setLoading(false);
      showToast(error?.data?.error || "Failed to update banner", "error");
    }
  };

  const label = { inputProps: { "aria-label": "Switch demo" } };

  return (
    <>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />

      <Box>
        <Box maxWidth="xl" sx={{ width: "100%", px: 1 }}>
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                color: "#393938",
                fontFamily: "Ubuntu",
                fontSize: "19px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "140%",
                p: { xs: 1, sm: 2, md: 3 },
              }}
            >
              Basic Details
            </Typography>
          </Box>
          <Box
            sx={{
              border: "2px solid #E5E7EB",
              p: { xs: 1, sm: 2, md: 3 },
              borderRadius: "10px",
            }}
          >
            <form onSubmit={handleBannerSubmit}>
              <Box>
                <Typography sx={{ color: "#737373" }}>Enable Video</Typography>
                <Switch
                  {...label}
                  name="toggle"
                  checked={toggle}
                  onChange={() => {
                    setToggle(!toggle);
                  }}
                />
              </Box>

              {/* Homepage category section copy (title + subtitle) */}
              <Box sx={{ mt: 2, mb: 1, display: "flex", flexDirection: "column", gap: 2, maxWidth: 640 }}>
                <Box>
                  <Typography sx={{ color: "#737373", mb: 0.5 }}>Category Section Title</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Choose Your Adventure"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                  />
                </Box>
                <Box>
                  <Typography sx={{ color: "#737373", mb: 0.5 }}>Category Section Subtitle</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    placeholder="From serene mountain treks to adrenaline-pumping expeditions — find your perfect experience."
                    value={catSubtitle}
                    onChange={(e) => setCatSubtitle(e.target.value)}
                  />
                </Box>
              </Box>
              <Grid
                container
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "0px 10px",
                }}
              >
                {array.map(({ plach, name, title, pixel, type }, index) => {
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
                          <Box>
                            <TextField
                              type="file"
                              sx={inputStyle}
                              size="small"
                              onChange={(e) => handleImageUpload(e, name)}
                              accept="image/*"
                              inputProps={{ multiple: name === "home" }}
                            />
                            
                            {/* Image Preview Section */}
                            {imagePreviews[name] && (
                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  justifyContent: "center",
                                }}
                              >
                                {Array.isArray(imagePreviews[name]) ? (
                                  // Multiple images for home field
                                  imagePreviews[name].length > 0 ? (
                                    imagePreviews[name].map((previewUrl, idx) => (
                                      <Box
                                        key={`${name}-${idx}`}
                                        sx={{
                                          position: "relative",
                                          width: 80,
                                          height: 60,
                                        }}
                                      >
                                        <Box
                                          component="img"
                                          src={previewUrl}
                                          alt={`${title} preview ${idx + 1}`}
                                          sx={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: 2,
                                            border: "2px solid #E5E7EB",
                                            objectFit: "cover",
                                          }}
                                        />
                                        {name === "home" && (
                                          <IconButton
                                            onClick={() => handleDeleteHomeImage(idx)}
                                            sx={{
                                              position: "absolute",
                                              top: -8,
                                              right: -8,
                                              backgroundColor: "#EC3F18",
                                              color: "white",
                                              width: 24,
                                              height: 24,
                                              padding: 0,
                                              "&:hover": {
                                                backgroundColor: "#d63516",
                                              },
                                            }}
                                          >
                                            <CloseIcon sx={{ fontSize: 16 }} />
                                          </IconButton>
                                        )}
                                      </Box>
                                    ))
                                  ) : null
                                ) : (
                                  // Single image for other fields
                                  <Box
                                    component="img"
                                    src={imagePreviews[name]}
                                    alt={`${title} preview`}
                                    sx={{
                                      width: 120,
                                      height: 80,
                                      borderRadius: 2,
                                      border: "2px solid #E5E7EB",
                                      objectFit: "cover",
                                    }}
                                  />
                                )}
                              </Box>
                            )}
                          </Box>
                        ) : type === "video" ? (
                          <Box>
                            <TextField
                              type="file"
                              sx={inputStyle}
                              size="small"
                              onChange={(e) => handleVideoUpload(e, name)}
                              accept="video/*"
                            />
                            
                            {/* Video Preview Section */}
                            {videoPreviews[name] && (
                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: "12px",
                                    color: "#737373",
                                    mb: 1,
                                  }}
                                >
                                  {videoPreviews[name].name}
                                </Typography>
                                <video
                                  key={videoPreviews[name].url}
                                  src={videoPreviews[name].url}
                                  controls
                                  preload="metadata"
                                  playsInline
                                  style={{
                                    width: "100%",
                                    maxWidth: "180px",
                                    height: "auto",
                                    borderRadius: "8px",
                                    border: "2px solid #E5E7EB",
                                    backgroundColor: "#000",
                                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <TextField
                            type="text"
                            name={name}
                            placeholder={plach}
                            value={banner[name] || ""}
                            onChange={(e) =>
                              setBanner((prev) => ({
                                ...prev,
                                [name]: e.target.value,
                              }))
                            }
                            sx={inputStyle}
                            size="small"
                          />
                        )}
                        <Typography
                          sx={{
                            color: "#7F8490",
                            textAlign: "end",
                            mt: 1,
                            fontSize: "14px",
                          }}
                        >
                          {pixel}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  gap: "0px 10px",
                  width: "100%",
                  justifyContent: "end",
                  p: { xs: 1, sm: 2, md: 2 },
                }}
              >
                <Button
                  sx={{
                    color: "#EC3F18",
                    border: "2px solid #EC3F18",
                    borderRadius: "32px",
                    width: "100px",
                    "&:hover": {
                      color: "#fff",
                      background: "#EC3F18",
                    },
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
                      color: "#EC3F18",
                      border: "2px solid #EC3F18",
                    },
                  }}
                >
                  Save
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Banner;
