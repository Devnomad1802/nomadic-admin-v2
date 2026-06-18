import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { inputStyle } from "../Trips/AddTrip";
import { Delete, Add } from "@mui/icons-material";
import { useAddBlogMutation } from "../../Redux/services";
import Loading from "../../smallComponents/Loading";
import Toastify from "../../smallComponents/Toastify";
import RichTextEditor from "./RichTextEditor";

const array = [
  {
    name: "bannerImage",
    title: "Banner Image*",
    text: "",
    type: "file",
    pixel: "1128 * 379 Pixel",
    required: true,
  },
  {
    name: "title",
    title: "Title",
    text: "text",
    type: "text",
    required: true,
  },
  {
    name: "author",
    title: "Author",
    text: "",
    type: "text",
    required: true,
  },
  {
    name: "locaton",
    title: "Location",
    text: "",
    type: "text",
    required: true,
  },
];

const AddBlog = () => {
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

  // Unified array to maintain order of content and images
  // Initialize with one content and one image by default
  const [contentItems, setContentItems] = useState([
    {
      id: Date.now(),
      type: "content",
      content: "",
    },
    {
      id: Date.now() + 1,
      type: "image",
      image: null,
    },
  ]);

  const [blog, setBlog] = useState({
    bannerImage: null,
    title: "",
    author: "",
    locaton: "",
    seoTitle: "",
    seoSlug: "",
    metaDescription: "",
  });

  const handleFirstSectionChange = (name, value) => {
    setBlog({ ...blog, [name]: value });
  };

  const handleBannerImageChange = (e) => {
    const file = e.target.files[0];
    setBlog({ ...blog, bannerImage: file });
  };

  // Helper function to create object URL for image preview
  const getImagePreview = (image) => {
    if (!image) return null;
    if (image instanceof File || image instanceof Blob) {
      return URL.createObjectURL(image);
    }
    // If it's already a string URL, return it as is
    return image;
  };

  // Handle content change for a specific section
  const handleContentChange = (id, value) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === "content"
          ? { ...item, content: value }
          : item
      )
    );
  };

  // Handle image change for a specific section
  const handleImageChange = (id, file) => {
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === id && item.type === "image"
          ? { ...item, image: file }
          : item
      )
    );
  };

  // Add new content section
  const handleAddContent = () => {
    setContentItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "content",
        content: "",
      },
    ]);
  };

  // Add new image section
  const handleAddImage = () => {
    setContentItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "image",
        image: null,
      },
    ]);
  };

  // Remove a section
  const handleRemoveSection = (id) => {
    setContentItems((prev) => prev.filter((item) => item.id !== id));
  };

  const [AddBlog] = useAddBlogMutation();

  const handleBlogSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Basic blog information
      formDataToSend.append("title", blog?.title || "");
      formDataToSend.append("author", blog?.author || "");
      formDataToSend.append("location", blog?.locaton || "");
      formDataToSend.append("seoTitle", blog?.seoTitle || "");
      formDataToSend.append("seoSlug", blog?.seoSlug || "");
      formDataToSend.append("metaDescription", blog?.metaDescription || "");

      // Append banner image if exists
      if (blog?.bannerImage) {
        formDataToSend.append("Banner_Image", blog.bannerImage);
      }

      // Build a unified array that maintains the exact order of all items
      // This handles any combination: content, images, content, images, etc.
      // Example: [content, content, image, content, image, image]
      const items = [];
      let imageCounter = 0; // Counter for image files array

      // Quill emits "<p><br></p>" for an empty editor — treat that as blank.
      const isBlankHtml = (html) =>
        !html || !html.replace(/<[^>]+>/g, "").replace(/&nbsp;|\s/g, "").trim();

      contentItems.forEach((item, index) => {
        if (item.type === "content" && !isBlankHtml(item.content)) {
          // Content item: include the text directly
          items.push({
            order: index + 1,
            type: "content",
            content: item.content.trim(),
          });
        } else if (item.type === "image" && item.image) {
          // Image item: reference the image by index in images array
          items.push({
            order: index + 1,
            type: "image",
            imageIndex: imageCounter, // Reference to images array index
          });
          imageCounter++;
        }
      });

      // Send the unified items array as JSON
      // Backend can iterate through this array to reconstruct the exact order
      formDataToSend.append("items", JSON.stringify(items));

      // Send all images as a separate array
      // Images are sent in the order they appear, indexed by imageIndex in items array
      let imageArrayIndex = 0;
      contentItems.forEach((item) => {
        if (item.type === "image" && item.image) {
          formDataToSend.append(`images[${imageArrayIndex}]`, item.image);
          imageArrayIndex++;
        }
      });

      // Also send content array separately for convenience (optional)
      const contentArray = items
        .filter((item) => item.type === "content")
        .map((item) => ({
          order: item.order,
          content: item.content,
        }));

      if (contentArray.length > 0) {
        formDataToSend.append("content", JSON.stringify(contentArray));
      }

      console.log("FormData Structure:", {
        title: blog?.title,
        author: blog?.author,
        location: blog?.locaton,
        items: items, // Main structure showing exact order
        contentCount: contentArray.length,
        imageCount: imageArrayIndex,
        example: "If items[0].type='content', use items[0].content. If items[2].type='image', use images[items[2].imageIndex]",
      });

      const response = await AddBlog(formDataToSend).unwrap();
      setLoading(false);
      showToast(response?.message || "Blog created successfully", "success");

      // Reset form after successful submission
      setBlog({
        bannerImage: null,
        title: "",
        author: "",
        locaton: "",
        seoTitle: "",
        seoSlug: "",
        metaDescription: "",
      });

      // Reset content items to default (one content and one image)
      setContentItems([
        {
          id: Date.now(),
          type: "content",
          content: "",
        },
        {
          id: Date.now() + 1,
          type: "image",
          image: null,
        },
      ]);
    } catch (error) {
      showToast(error?.data?.error || error?.data?.message || "Failed to create blog", "error");
      console.error("Error", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <form onSubmit={handleBlogSubmit}>
        <Container maxWidth="xl" sx={{ width: "100%", px: 1 }}>
          {/* Basic Details Section */}
          <Box sx={{ width: "100%", p: 2 }}>
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
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              p: 2,
              mb: 3,
            }}
          >
            <Grid
              container
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                gap: "0px 20px",
              }}
            >
              {array.map(({ plach, name, required, title, type, pixel }, index) => {
                return (
                  <Grid
                    key={index}
                    item
                    xs={12}
                    sm={5.8}
                    md={3.8}
                    sx={{ width: "100%", mt: 3 }}
                  >
                    {type === "file" ? (
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
                        {/* Banner Image Preview */}
                        {blog.bannerImage && getImagePreview(blog.bannerImage) ? (
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              mb: 2,
                            }}
                          >
                            <Box
                              sx={{
                                width: "100%",
                                height: "200px",
                                border: "2px dashed #E7E7E7",
                                borderRadius: "10px",
                                overflow: "hidden",
                                background: "#f5f5f5",
                                position: "relative",
                              }}
                            >
                              <img
                                src={getImagePreview(blog.bannerImage)}
                                alt="Banner preview"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                              <IconButton
                                onClick={() => setBlog({ ...blog, bannerImage: null })}
                                sx={{
                                  position: "absolute",
                                  top: "8px",
                                  right: "8px",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                  },
                                }}
                                size="small"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Box>
                            {blog.bannerImage instanceof File && (
                              <Typography
                                sx={{
                                  color: "#737373",
                                  fontSize: "12px",
                                  mt: 1,
                                }}
                              >
                                {blog.bannerImage.name}
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <>
                            <Button
                              component="label"
                              variant="outlined"
                              sx={{
                                border: "1px solid #E7E7E7",
                                color: "#CD482A",
                                borderRadius: "8px",
                                textTransform: "none",
                                px: 3,
                                py: 1,
                                width: "100%",
                                "&:hover": {
                                  border: "1px solid #CD482A",
                                  backgroundColor: "rgba(205, 72, 42, 0.05)",
                                },
                              }}
                            >
                              Upload Banner Image
                              <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleBannerImageChange}
                              />
                            </Button>
                            {pixel && (
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "end",
                                  p: 1,
                                  fontSize: "12px",
                                }}
                              >
                                {pixel}
                              </Typography>
                            )}
                          </>
                        )}
                      </Box>
                    ) : (
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
                          name={name}
                          sx={inputStyle}
                          size="small"
                          placeholder={plach}
                          type={type}
                          required={required}
                          value={blog[name] || ""}
                          onChange={(e) => {
                            handleFirstSectionChange(name, e.target.value);
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                );
              })}

              {/* SEO Fields */}
              <Grid item xs={12} sm={5.8} md={3.8} sx={{ width: "100%", mt: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    SEO Title
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoTitle"
                    placeholder="Enter SEO title"
                    value={blog.seoTitle || ""}
                    onChange={(e) =>
                      handleFirstSectionChange("seoTitle", e.target.value)
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={5.8} md={3.8} sx={{ width: "100%", mt: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Slug
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoSlug"
                    placeholder="Enter slug"
                    value={blog.seoSlug || ""}
                    onChange={(e) =>
                      handleFirstSectionChange("seoSlug", e.target.value)
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ width: "100%", mt: 3 }}>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Meta Description
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="metaDescription"
                    placeholder="Enter meta description"
                    multiline

                    fullWidth
                    value={blog.metaDescription || ""}
                    onChange={(e) =>
                      handleFirstSectionChange("metaDescription", e.target.value)
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Content Section */}
          <Box sx={{ width: "100%", p: 2 }}>
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
              Content
            </Typography>
          </Box>
          <Box
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              p: 3,
              mb: 3,
              backgroundColor: "#fff",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Render content and images in order */}
            {contentItems.map((item) => (
              <Box key={item.id} sx={{ mb: 3 }}>
                {item.type === "content" ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#737373",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Add Content
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveSection(item.id)}
                        sx={{
                          color: "#EC3F18",
                          "&:hover": {
                            backgroundColor: "rgba(236, 63, 24, 0.1)",
                          },
                        }}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    <RichTextEditor
                      value={item.content || ""}
                      onChange={(html) => handleContentChange(item.id, html)}
                      placeholder="Enter your content here..."
                    />
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#737373",
                          textAlign: "left",
                          fontSize: "14px",
                          fontWeight: 500,
                        }}
                      >
                        Add Image
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveSection(item.id)}
                        sx={{
                          color: "#EC3F18",
                          "&:hover": {
                            backgroundColor: "rgba(236, 63, 24, 0.1)",
                          },
                        }}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    {/* Image Preview */}
                    {item.image && getImagePreview(item.image) ? (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "400px",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            height: "200px",
                            border: "2px dashed #E7E7E7",
                            borderRadius: "10px",
                            overflow: "hidden",
                            background: "#f5f5f5",
                            position: "relative",
                          }}
                        >
                          <img
                            src={getImagePreview(item.image)}
                            alt="Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          <IconButton
                            onClick={() => handleImageChange(item.id, null)}
                            sx={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              backgroundColor: "rgba(0, 0, 0, 0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                              },
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                        {item.image instanceof File && (
                          <Typography
                            sx={{
                              color: "#737373",
                              fontSize: "12px",
                              mt: 1,
                            }}
                          >
                            {item.image.name}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Button
                        component="label"
                        variant="outlined"
                        sx={{
                          border: "1px solid #E7E7E7",
                          color: "#CD482A",
                          borderRadius: "8px",
                          textTransform: "none",
                          px: 3,
                          py: 1,
                          "&:hover": {
                            border: "1px solid #CD482A",
                            backgroundColor: "rgba(205, 72, 42, 0.05)",
                          },
                        }}
                      >
                        Upload Image
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleImageChange(item.id, file);
                            }
                          }}
                        />
                      </Button>
                    )}
                  </>
                )}
              </Box>
            ))}

            {/* Add Content and Add Image Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mt: 2,
              }}
            >
              <Button
                onClick={handleAddContent}
                startIcon={<Add sx={{ color: "#CD482A" }} />}
                sx={{
                  color: "#CD482A",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "rgba(205, 72, 42, 0.05)",
                  },
                }}
              >
                Add Content
              </Button>
              <Button
                onClick={handleAddImage}
                startIcon={<Add sx={{ color: "#CD482A" }} />}
                sx={{
                  color: "#CD482A",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "14px",
                  "&:hover": {
                    backgroundColor: "rgba(205, 72, 42, 0.05)",
                  },
                }}
              >
                Add Image
              </Button>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              width: "100%",
              p: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              sx={{
                color: "#EC3F18",
                border: "2px solid #EC3F18",
                borderRadius: "32px",
                fontWeight: 700,
                width: "100px",
                textTransform: "none",
                "&:hover": {
                  border: "2px solid #EC3F18",
                  backgroundColor: "rgba(236, 63, 24, 0.05)",
                },
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
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#CD482A",
                },
              }}
            >
              Save
            </Button>
          </Box>
        </Container>
      </form>
    </>
  );
};

export default AddBlog;
