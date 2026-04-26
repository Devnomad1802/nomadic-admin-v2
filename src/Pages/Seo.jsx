import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { inputStyle } from "../Components/Trips/AddTrip";
import Loading from "../smallComponents/Loading";
import Toastify from "../smallComponents/Toastify";
import {
    useAddSeoMutation,
    useUpdateSeoMutation,
    useGetSeoQuery,
} from "../Redux/services/Seo";

const Seo = () => {
    // Page options matching the navigation
    const pages = [
        { id: "home", name: "Home" },
        { id: "allPackages", name: "All Packages" },
        { id: "aboutUs", name: "About Us" },
        { id: "careers", name: "Careers" },
        { id: "blog", name: "Blog" },
        { id: "contactUs", name: "Contact Us" },
    ];

    // State for selected page
    const [selectedPage, setSelectedPage] = useState("home");

    // State for all page SEO data
    const [seoData, setSeoData] = useState({
        home: { title: "", description: "" },
        allPackages: { title: "", description: "" },
        aboutUs: { title: "", description: "" },
        careers: { title: "", description: "" },
        blog: { title: "", description: "" },
        contactUs: { title: "", description: "" },
    });

    // API hooks
    const { data: seoResponse, isLoading: isLoadingSeo } = useGetSeoQuery();
    const [addSeo, { isLoading: isAdding }] = useAddSeoMutation();
    const [updateSeo, { isLoading: isUpdating }] = useUpdateSeoMutation();

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

    // Load SEO data from API
    useEffect(() => {
        if (seoResponse?.data) {
            const apiData = seoResponse.data;
            setSeoData({
                home: apiData.home || { title: "", description: "" },
                allPackages: apiData.allPackages || { title: "", description: "" },
                aboutUs: apiData.aboutUs || { title: "", description: "" },
                careers: apiData.careers || { title: "", description: "" },
                blog: apiData.blog || { title: "", description: "" },
                contactUs: apiData.contactUs || { title: "", description: "" },
            });
        }
    }, [seoResponse]);

    // Check if SEO data exists (not empty)
    const hasSeoData = seoResponse?.data &&
        Object.values(seoResponse.data).some(
            (page) => page?.title || page?.description
        );

    // Get current form data for selected page
    const currentFormData = seoData[selectedPage] || { title: "", description: "" };

    const handleChange = (name, value) => {
        setSeoData((prevState) => ({
            ...prevState,
            [selectedPage]: {
                ...prevState[selectedPage],
                [name]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const pageData = seoData[selectedPage];

        // Validation for current page
        if (!pageData.title?.trim()) {
            showToast("Title is required", "error");
            return;
        }
        if (!pageData.description?.trim()) {
            showToast("Description is required", "error");
            return;
        }

        try {
            setLoading(true);

            // Prepare payload with all pages data
            const payload = {
                home: {
                    title: seoData.home.title || "",
                    description: seoData.home.description || "",
                },
                allPackages: {
                    title: seoData.allPackages.title || "",
                    description: seoData.allPackages.description || "",
                },
                aboutUs: {
                    title: seoData.aboutUs.title || "",
                    description: seoData.aboutUs.description || "",
                },
                careers: {
                    title: seoData.careers.title || "",
                    description: seoData.careers.description || "",
                },
                blog: {
                    title: seoData.blog.title || "",
                    description: seoData.blog.description || "",
                },
                contactUs: {
                    title: seoData.contactUs.title || "",
                    description: seoData.contactUs.description || "",
                },
            };

            console.log("SEO Payload:", payload);

            // Check if data exists - use update if exists, add if empty
            let response;
            if (hasSeoData && seoResponse?.data?._id) {
                // Update existing SEO data - send _id in params
                response = await updateSeo({
                    _id: seoResponse.data._id,
                    ...payload,
                }).unwrap();
            } else {
                // Add new SEO data
                response = await addSeo(payload).unwrap();
            }

            setLoading(false);
            showToast(response?.message || "SEO settings saved successfully", "success");
        } catch (error) {
            setLoading(false);
            showToast(error?.data?.error || "Failed to save SEO settings", "error");
        }
    };

    const handleCancel = () => {
        // Reset current page data
        setSeoData((prevState) => ({
            ...prevState,
            [selectedPage]: { title: "", description: "" },
        }));
    };

    const array = [
        {
            name: "title",
            title: "Title*",
            type: "text",
            plach: "Enter SEO title",
            required: true,
        },
        {
            name: "description",
            title: "Description*",
            type: "textarea",
            plach: "Enter SEO description",
            required: true,
        },
    ];

    return (
        <>
            <Loading isLoading={loading || isAdding || isUpdating || isLoadingSeo} />
            <Toastify setAlertState={setAlertState} alertState={alertState} />
            <Box>
                <Container maxWidth="lg" sx={{ width: "100%", px: 1 }}>
                    {/* Navigation Bar */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: { xs: 1, sm: 2, md: 3 },
                            mb: 3,
                            flexWrap: { xs: "wrap", sm: "nowrap" },
                            borderBottom: "1px solid #E5E7EB",
                            pb: 2,
                        }}
                    >
                        {pages.map((page) => (
                            <Typography
                                key={page.id}
                                onClick={() => setSelectedPage(page.id)}
                                sx={{
                                    color: selectedPage === page.id ? "#E55B3F" : "#4A5568",
                                    fontSize: { xs: "14px", sm: "16px" },
                                    fontWeight: selectedPage === page.id ? 600 : 400,
                                    cursor: "pointer",
                                    fontFamily: "Ubuntu",
                                    position: "relative",
                                    pb: 1,
                                    "&:hover": {
                                        color: "#E55B3F",
                                    },
                                    ...(selectedPage === page.id && {
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: "2px",
                                            backgroundColor: "#E55B3F",
                                        },
                                    }),
                                }}
                            >
                                {page.name}
                            </Typography>
                        ))}
                    </Box>

                    {/* Form Section */}
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
                        <form onSubmit={handleSubmit}>
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
                                            sm={12}
                                            md={12}
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
                                                {type === "textarea" ? (
                                                    <TextField
                                                        sx={{
                                                            ...inputStyle,
                                                            "& .MuiOutlinedInput-root": {
                                                                ...inputStyle["& .MuiOutlinedInput-root"],
                                                                height: "auto",
                                                                minHeight: "120px",
                                                                alignItems: "flex-start",
                                                            },
                                                            "& .MuiInputBase-input": {
                                                                paddingTop: "12px",
                                                                paddingBottom: "12px",
                                                            },
                                                        }}
                                                        size="small"
                                                        placeholder={plach}
                                                        required={required}
                                                        name={name}
                                                        value={currentFormData[name] || ""}
                                                        onChange={(e) => handleChange(name, e.target.value)}
                                                        multiline
                                                        rows={4}
                                                    />
                                                ) : (
                                                    <TextField
                                                        sx={inputStyle}
                                                        size="small"
                                                        placeholder={plach}
                                                        type={type}
                                                        required={required}
                                                        name={name}
                                                        value={currentFormData[name] || ""}
                                                        onChange={(e) => handleChange(name, e.target.value)}
                                                    />
                                                )}
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
                                    mt: 3,
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
                                    onClick={handleCancel}
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
                </Container>
            </Box>
        </>
    );
};

export default Seo;
