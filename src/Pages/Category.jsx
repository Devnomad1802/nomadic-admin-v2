import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { inputStyle } from "../Components/Trips/AddTrip";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Delete } from "@mui/icons-material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
  useGetAllBannerQuery,
  useUpdateCategorySectionMutation,
} from "../Redux/services";
import Loading from "../smallComponents/Loading";
import Toastify from "../smallComponents/Toastify";

const Category = () => {
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

  // Get All Category
  const {
    error,
    isLoading,
    data: responseData,
    refetch,
  } = useGetAllCategoriesQuery();

  const [categoryArray, setCategoryArray] = useState([]);
  useEffect(() => {
    setCategoryArray(responseData?.data);
  }, [isLoading, error, responseData]);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null);

  // Homepage category-section copy (title + subtitle), stored on the cover-images doc.
  const { data: bannerData } = useGetAllBannerQuery();
  const [updateCategorySection, { isLoading: savingSection }] =
    useUpdateCategorySectionMutation();
  const [catTitle, setCatTitle] = useState("");
  const [catSubtitle, setCatSubtitle] = useState("");
  useEffect(() => {
    const item = bannerData?.data?.[0];
    if (item) {
      setCatTitle(item.categorySectionTitle || "");
      setCatSubtitle(item.categorySectionSubtitle || "");
    }
  }, [bannerData]);

  const handleSaveSection = async () => {
    try {
      await updateCategorySection({
        categorySectionTitle: catTitle,
        categorySectionSubtitle: catSubtitle,
      }).unwrap();
      showToast("Category section updated", "success");
    } catch {
      showToast("Failed to update category section", "error");
    }
  };

  const array = [
    {
      name: "title",
      title: "Category*",
      value: selectCategory?.Category,
      type: "text",
      required: true,
    },
    // "Starting From" is now derived automatically from the cheapest trip in the
    // category on the website, so it is no longer an editable field here.
    {
      name: "bannerImage",
      title: "Banner Image*",
      value: selectCategory?.Banner_Image,
      type: "file",
      plach: "Upload Banner Image",
      required: true,
    },
  ];

  // Add Category
  const [category, setCategory] = useState({
    title: "",
    startFrom: "",
    bannerImage: null,
  });

  // State for image previews
  const [bannerPreview, setBannerPreview] = useState(null);

  // Update category state and preview when selectCategory changes
  useEffect(() => {
    if (selectCategory?._id) {
      setCategory({
        title: selectCategory?.Category || "",
        startFrom: selectCategory?.Starting_From || "",
        bannerImage: null,
      });
      setBannerPreview(selectCategory?.Banner_Image || null);
    } else {
      setCategory({
        title: "",
        startFrom: "",
        bannerImage: null,
      });
      setBannerPreview(null);
    }
  }, [selectCategory]);

  const handleChange = (name, value, isFile = false) => {
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: isFile ? value[0] : value,
    }));

    // Handle image preview for banner image
    if (isFile && name === "bannerImage" && value[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerPreview(e.target.result);
      reader.readAsDataURL(value[0]);
    }
  };

  // Remove banner image
  const removeBannerImage = () => {
    setCategory({ ...category, bannerImage: null });
    if (!selectCategory?._id) {
      setBannerPreview(null);
    } else {
      setBannerPreview(selectCategory?.Banner_Image || null);
    }
  };

  // Reusable image preview component
  const ImagePreview = ({ src, alt, onRemove, label }) => {
    return (
      <Box
        sx={{
          width: "100%",
          height: "200px",
          border: "2px dashed #E7E7E7",
          borderRadius: "8px",
          mb: 2,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "#F9F9F9",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <Button
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: "auto",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "white",
            padding: 0,
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.8)",
            },
          }}
        >
          <Delete sx={{ fontSize: "18px" }} />
        </Button>
        {label && (
          <Box
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              backgroundColor: "rgba(0,0,0,0.7)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {label}
          </Box>
        )}
      </Box>
    );
  };

  ImagePreview.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onRemove: PropTypes.func.isRequired,
    label: PropTypes.string,
  };

  // Handle category selection
  const handleCategoryClick = (item) => {
    setHoveredIndex(item?._id);
    setSelectCategory(item);
  };

  // Handle create new folder
  const handleCreateFolder = () => {
    setSelectCategory(null);
    setHoveredIndex(null);
    setCategory({
      title: "",
      startFrom: "",
      bannerImage: null,
    });
    setBannerPreview(null);
  };

  // handle submit form
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const handleCetegorySubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!category?.title?.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    if (!bannerPreview && !category?.bannerImage) {
      showToast("Banner image is required", "error");
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("Category", category?.title);
      formDataToSend.append("Starting_From", category?.startFrom);

      // Only append banner image if a new file was selected
      if (category?.bannerImage) {
        formDataToSend.append("Banner_Image", category?.bannerImage);
      }

      // If updating an existing category, add the ID
      if (selectCategory?._id) {
        formDataToSend.append("_id", selectCategory._id);
        const res = await updateCategory(formDataToSend).unwrap();
        showToast(res?.message || "Category updated successfully", "success");
      } else {
        // Creating new category
        const res = await addCategory(formDataToSend).unwrap();
        showToast(res?.message || "Category created successfully", "success");
      }

      refetch();
      setLoading(false);

      // Reset form after successful submission
      setCategory({
        title: "",
        startFrom: "",
        bannerImage: null,
      });
      setBannerPreview(null);
      setSelectCategory(null);
      setHoveredIndex(null);
    } catch (error) {
      setLoading(false);
      showToast(error?.data?.error || "Failed to save category", "error");
    }
  };

  // Delete Category
  const [deleteCategory] = useDeleteCategoryMutation();
  const deletCategory = async (id) => {
    try {
      await deleteCategory({ _id: id }).unwrap();
      showToast("Category deleted successfully", "success");
      refetch();
      if (selectCategory?._id === id) {
        setSelectCategory(null);
        setHoveredIndex(null);
        setCategory({
          title: "",
          startFrom: "",
          bannerImage: null,
        });
        setBannerPreview(null);
      }
    } catch (error) {
      showToast(error?.data?.error || "Failed to delete category", "error");
    }
  };

  return (
    <Box>
      <Loading isLoading={loading || isLoading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Container
        maxWidth="lg"
        sx={{
          width: "100%",
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* ── Homepage category-section copy (title + subtitle) ── */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            p: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#393938", mb: 2 }}>
            Homepage Category Section
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 640 }}>
            <Box>
              <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
                Section Title
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Choose Your Adventure"
                value={catTitle}
                onChange={(e) => setCatTitle(e.target.value)}
              />
            </Box>
            <Box>
              <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
                Section Subtitle / Highlights
              </Typography>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={2}
                placeholder="From serene mountain treks to adrenaline-pumping expeditions — find your perfect experience."
                value={catSubtitle}
                onChange={(e) => setCatSubtitle(e.target.value)}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSaveSection}
                disabled={savingSection}
                sx={{
                  backgroundColor: "#EC3F18",
                  textTransform: "none",
                  borderRadius: "8px",
                  px: 3,
                  "&:hover": { backgroundColor: "#CD482A" },
                }}
              >
                {savingSection ? "Saving..." : "Save Section"}
              </Button>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          {/* Left Sidebar - Category List */}
          <Paper
            elevation={0}
            sx={{
              width: { xs: "100%", md: "300px" },
              minWidth: { md: "300px" },
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              p: 2,
              maxHeight: { xs: "400px", md: "600px" },
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#F5F5F5",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#D3D3D3",
                borderRadius: "10px",
                "&:hover": {
                  background: "#B0B0B0",
                },
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {categoryArray?.map((item, index) => {
                const isSelected = hoveredIndex === item?._id;
                return (
                  <Button
                    key={index}
                    onClick={() => handleCategoryClick(item)}
                    sx={{
                      minWidth: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                      px: 2,
                      textTransform: "uppercase",
                      backgroundColor: isSelected ? "#FAEDEA" : "transparent",
                      color: isSelected ? "#CD482A" : "#4A5568",
                      fontWeight: isSelected ? 600 : 400,
                      fontSize: "14px",
                      borderRadius: "6px",
                      border: isSelected ? "1px solid #FAEDEA" : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: isSelected ? "#FAEDEA" : "#F9F9F9",
                        color: isSelected ? "#CD482A" : "#232323",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "inherit",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item?.Category}
                    </Typography>
                    <KeyboardArrowRightIcon
                      sx={{
                        fontSize: "18px",
                        color: "inherit",
                      }}
                    />
                  </Button>
                );
              })}
              <Button
                onClick={handleCreateFolder}
                startIcon={<AddIcon />}
                sx={{
                  color: "#E55B3F",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "14px",
                  mt: 1,
                  py: 1.5,
                  px: 2,
                  justifyContent: "flex-start",
                  "&:hover": {
                    backgroundColor: "#FAEDEA",
                  },
                }}
              >
                CREATE FOLDER
              </Button>
            </Box>
          </Paper>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                backgroundColor: "#FFFFFF",
                border: "2px solid #E5E7EB",
                borderRadius: "10px",
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              <form onSubmit={handleCetegorySubmit}>
                <Grid
                  container
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  {array.map(({ plach, required, title, name, type }, index) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sx={{ width: "100%" }}
                      >
                        {type === "file" ? (
                          <Box sx={{ width: "100%" }}>
                            <Typography
                              sx={{
                                color: "#737373",
                                textAlign: "left",
                                mb: 1.5,
                                fontSize: "14px",
                                fontWeight: 500,
                              }}
                            >
                              {title}
                            </Typography>

                            {/* Image Preview */}
                            {bannerPreview && (
                              <ImagePreview
                                src={bannerPreview}
                                alt="Banner Preview"
                                onRemove={removeBannerImage}
                                label={
                                  category?.bannerImage
                                    ? "New Image"
                                    : "Current Image"
                                }
                              />
                            )}

                            {/* File input */}
                            {(!bannerPreview || category?.bannerImage) && (
                              <TextField
                                sx={inputStyle}
                                size="small"
                                placeholder={plach}
                                type="file"
                                required={!bannerPreview && required}
                                name={name}
                                accept="image/*"
                                onChange={(e) =>
                                  handleChange(name, e.target.files, true)
                                }
                              />
                            )}

                            {/* Change Image button for existing categories */}
                            {bannerPreview &&
                              selectCategory?._id &&
                              !category?.bannerImage && (
                                <Box sx={{ mt: 1.5, display: "flex", gap: 1.5 }}>
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                      borderColor: "#E7E7E7",
                                      color: "#737373",
                                      textTransform: "none",
                                      fontSize: "14px",
                                      borderRadius: "6px",
                                      px: 2,
                                      "&:hover": {
                                        borderColor: "#EC3F18",
                                        color: "#EC3F18",
                                        backgroundColor: "transparent",
                                      },
                                    }}
                                  >
                                    Change Image
                                    <input
                                      type="file"
                                      hidden
                                      accept="image/*"
                                      onChange={(e) =>
                                        handleChange(name, e.target.files, true)
                                      }
                                    />
                                  </Button>
                                </Box>
                              )}
                          </Box>
                        ) : (
                          <Box sx={{ width: "100%" }}>
                            <Typography
                              sx={{
                                color: "#737373",
                                textAlign: "left",
                                mb: 1.5,
                                fontSize: "14px",
                                fontWeight: 500,
                              }}
                            >
                              {title}
                            </Typography>
                            <TextField
                              sx={inputStyle}
                              size="small"
                              value={category[name] || ""}
                              placeholder={plach}
                              type="text"
                              required={required}
                              name={name}
                              onChange={(e) =>
                                handleChange(name, e.target.value)
                              }
                            />
                          </Box>
                        )}
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid #E5E7EB",
                  }}
                >
                  {selectCategory?._id && (
                    <Button
                      onClick={() => deletCategory(selectCategory?._id)}
                      sx={{
                        color: "#CE4C2F",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "14px",
                        "&:hover": {
                          backgroundColor: "#FAEDEA",
                        },
                      }}
                    >
                      Delete Category
                    </Button>
                  )}
                  {!selectCategory?._id && <Box />}

                  <Button
                    type="submit"
                    sx={{
                      color: "#fff",
                      background: "#E55B3F",
                      borderRadius: "8px",
                      width: "120px",
                      py: 1.2,
                      textTransform: "uppercase",
                      fontWeight: 600,
                      fontSize: "14px",
                      letterSpacing: "0.5px",
                      "&:hover": {
                        background: "#CD482A",
                      },
                    }}
                  >
                    Save
                  </Button>
                </Box>
              </form>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Category;
