import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useRef, useState } from "react";
import {
  generateMetaDescription,
  generateSeoTitle,
  generateSlug,
} from "../../utils/seoUtils";
import { Link } from "react-router-dom";
import {
  useGetAllCategoriesQuery,
  useGetAllReviewsQuery,
} from "../../Redux/services";
import { useGetAllCouponQuery } from "../../Redux/services/coupenApi";
import { useGetAllHostsQuery } from "../../Redux/services/hostsApi";
import { useAddTripMutation } from "../../Redux/services/TripApis";
import { useGetAllVendorsQuery } from "../../Redux/services/vanderApi";
import Loading from "../../smallComponents/Loading";
import SelecrMuiInput from "../../smallComponents/SelecrMuiInput";
import { IOSSwitch } from "../../smallComponents/swtich";
import Toastify from "../../smallComponents/Toastify";
import { inputStyle2 } from "../Booking/BookingTable";

// TextField Style
export const inputStyle = {
  "& input::-webkit-outer-spin-button,\n input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: "0",
  },
  width: "100%",
  "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },
  "& .css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },

  "& .MuiOutlinedInput-root": {
    background: "#fff",

    "& fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&:hover fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #E7E7E7",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#253A47", // Change this to the desired placeholder color
    },
    color: "#000",
    height: "45px",
    borderRadius: "8px",
    fontFamily: "Ubuntu",
    textAlign: "left",
    width: "100%",
  },
};

// Accordion Style
const accordionStyle = {
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
  borderRadius: "12px",
  "&:before": {
    display: "none",
  },
  "& .MuiAccordionSummary-root": {
    borderRadius: "12px",
  },
  "& .MuiAccordionDetails-root": {
    padding: "24px",
  },
};

const array = [
  {
    name: "bannerImage",
    title: "Banner Image*",
    text: "",
    type: "file",

    required: true,
  },
  {
    name: "cardImage",
    title: "Card Image*",
    text: "",
    type: "file",

    required: true,
  },
  {
    name: "title",
    title: "Title*",
    text: "",
    type: "text",

    required: true,
  },
  {
    name: "subTitle",
    title: "Sub Title*",
    text: "",
    type: "text",

    required: true,
  },
  {
    name: "firstBookingPrice",
    title: "First Booking Price*",
    text: "",
    type: "number",

    required: true,
  },
  {
    name: "price",
    title: "Price*",
    text: "",
    type: "number",

    required: true,
  },
  {
    name: "strikePrice",
    title: "Strike Price",
    text: "",
    type: "number",
  },
  {
    name: "commissionRate",
    title: "Commission Rate",
    text: "",
    type: "number",
  },
  {
    name: "days",
    title: "Days*",
    text: "",
    type: "number",

    required: true,
  },
  {
    name: "nights",
    title: "Nights*",
    text: "",
    type: "number",

    required: true,
  },
  {
    name: "location",
    title: "Location*",
    text: "",
    type: "text",

    required: true,
  },
  {
    name: "pickUp",
    title: "Pick Up* ",
    text: "",
    type: "text",

    required: true,
  },
  {
    name: "dropOff",
    title: "Drop Off*",
    text: "",
    type: "text",

    required: true,
  },
  {
    name: "trendingHeading",
    title: "Trending Title*",
    text: "",
    type: "text",

    required: false,
  },
  {
    name: "tripOff",
    title: "Trip Off",
    text: "",
    type: "number",
  },
];
const type = [
  {
    value: "Batch",
    label: "Batch",
  },
  {
    value: "Customized",
    label: "Customized",
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

const typeArray = [
  {
    name: "numberOfDays",
    title: "Number of Days*",
    text: "",
    type: "number",
    plach: "Enter Number of Days",
    required: true,
  },
  {
    name: "numberOfSeats",
    title: "Number of Seats*",
    text: "",
    type: "number",
    plach: "Number of Seats",
    required: true,
  },
  {
    name: "selectDate",
    title: "Start Date*",
    text: "",
    type: "date",
    plach: "Select Date",
    required: true,
  },
  {
    name: "endSelectDate",
    title: "End Date*",
    text: "",
    type: "date",
    plach: "End Date",
    required: true,
  },
];

const addArry = [{ day: 1, title: 1, Description: 1 }];
const AddTrip = () => {
  // Helper function to safely create object URL
  const safeCreateObjectURL = (item) => {
    if (item instanceof File || item instanceof Blob) {
      return URL.createObjectURL(item);
    }
    // If it's already a string URL, return it as is
    return item;
  };

  // Loading Toast
  const [loading, setLoading] = useState(false);

  // Validation and accordion state
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);

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

  // Accordion change handler
  const handleAccordionChange = (accordionName) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? accordionName : false);
  };

  // get categories

  let CatagoryNames = [];
  let VanderNames = [];
  let HostNames = [];
  let discountNames = [];
  let ratingNames = [];
  let Vnames = [];
  const { error, isLoading, data: responseData } = useGetAllCategoriesQuery();
  const { data: resVander } = useGetAllVendorsQuery();
  const { data: resHost } = useGetAllHostsQuery();
  const { data: resCoupon } = useGetAllCouponQuery();
  const { data: reviewData } = useGetAllReviewsQuery();

  const [categoryArray, setCategoryArray] = useState([]);
  const [vanverArray, setVanderArray] = useState([]);
  const [hostArray, setHostArray] = useState([]);
  const [couponArray, SetCouponArray] = useState([]);
  const [reviewArray, SetReviewArray] = useState([]);

  useEffect(() => {
    setCategoryArray(responseData?.data);
    setVanderArray(resVander?.data);
    setHostArray(resHost?.data);
    SetCouponArray(resCoupon?.data);
    SetReviewArray(reviewData?.data);
  }, [
    isLoading,
    error,
    responseData,
    categoryArray,
    resVander?.data,
    resHost?.data,
    resCoupon?.data,
    reviewData?.data,
  ]);
  if (categoryArray?.length > 0) {
    // If categoryArray has items, map over it and push Category names into CatagoryNames array
    const names = categoryArray?.map((item) => item?.Category);
    CatagoryNames = [...names];
  }
  if (vanverArray?.length > 0) {
    Vnames = vanverArray?.map((item) => item?.First_Name);
    VanderNames = [...Vnames];
  }
  if (hostArray?.length > 0) {
    // Store host objects with both id and name for display
    HostNames = hostArray?.map((item) => ({
      id: item?._id,
      name: item?.hostName,
    }));
    console.log("Hosts loaded:", HostNames); // Debug log
  }
  if (couponArray?.length > 0) {
    const cnames = couponArray?.map((item) => item?.Coupon_Name);
    discountNames = [...cnames];
  }
  if (reviewArray?.length > 0) {
    const rnames = reviewArray?.map((item) => item?.Title);
    ratingNames = [...rnames];
  }

  //First Section Form

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    days: 0,
    nights: 0,
    date: "",
    firstBookingPrice: "",
    price: 0,
    strikePrice: 0,
    commissionRate: 0,
    location: "",
    pickUp: "",
    dropOff: "",
    bannerImage: null,
    cardImage: null,
    categories: [],
    overview: "",
    itenarryImg: null,
    type: "Batch",
    numberOfDays: [{ selectDays: 0 }],
    numberOfSeats: [{ batchSeats: 0 }],
    selectDate: [{ BatchDate: "" }],
    endSelectDate: [{ EndBatchDate: "" }],
    Inclusion: "",
    Exclusion: "",
    ThingsToCarry: "",
    Cancellation: "",
    discount: [],
    gallaryImages: [],
    reviews: [],
    ratings: "",
    vanders: [],
    host: "",
    enableBooking: false,
    enableEnquire: false,
    Trending: false,
    trendingHeading: "",
    tripOff: 0,
    seoTitle: "",
    seoSlug: "",
    metaDescription: "",
  });

  // Tracks whether admin has manually edited SEO fields.
  // When true, auto-generation stops so custom values are preserved.
  const seoManuallyEdited = useRef(false);

  // Auto-generate SEO fields when title, location, or categories change,
  // but only while admin hasn't touched the SEO fields manually.
  useEffect(() => {
    if (seoManuallyEdited.current) return;
    const { title, location, categories } = formData;
    if (!title) return;
    setFormData((prev) => ({
      ...prev,
      seoTitle: generateSeoTitle(title),
      seoSlug: generateSlug(title),
      metaDescription: generateMetaDescription(title, location, categories),
    }));
  }, [formData.title, formData.location, formData.categories]);

  console.log("formData.....", formData);
  // Section

  const [addSection, setAddSection] = useState([
    {
      section: 1,
      sectionTitle: "",
      array: [{ Title: "", TitlePrice: "", value: formData.price }],
    },
  ]);

  console.log("addSection...", addSection);
  useEffect(() => {
    setAddSection((prevSections) => {
      return prevSections.map((section, index) => {
        if (index === 0) {
          return {
            ...section,
            array: section.array.map((item) => ({
              ...item,
              TitlePrice: formData.price,
            })),
          };
        }
        return section;
      });
    });
  }, [formData.price]);

  const handleAddSectionItem = (sectionIndex) => {
    const newAddSection = [...addSection];
    newAddSection[sectionIndex].array.push({ Title: "", TitlePrice: "" });
    setAddSection(newAddSection);
  };

  const handleAddSection = () => {
    const newSection = {
      section: addSection.length + 1,
      sectionTitle: "",
      array: [{ Title: "", TitlePrice: "" }],
    };
    setAddSection([...addSection, newSection]);
  };

  const handleDeleteLastSectionItem = (sectionIndex) => {
    const newAddSection = [...addSection];
    const lastDayIndex = newAddSection[sectionIndex].array.length - 1;
    if (lastDayIndex >= 1) {
      newAddSection[sectionIndex].array.splice(lastDayIndex, 1);
      setAddSection(newAddSection);
    }
  };

  // Delete Secton
  const handleDeleteSection = (sectionIndex) => {
    if (addSection.length > 1) {
      // Check if there is more than one section
      const newAddSection = [...addSection];
      newAddSection.splice(sectionIndex, 1);
      setAddSection(newAddSection);
    }
  };

  const handleInputChangeSection = (sectionIndex, dayIndex, field, value) => {
    const newAddSection = [...addSection];
    newAddSection[sectionIndex].array[dayIndex][field] = value;
    setAddSection(newAddSection);
  };

  const handleSectionTitleChange = (sectionIndex, value) => {
    const newAddSection = [...addSection];
    newAddSection[sectionIndex].sectionTitle = value;
    setAddSection(newAddSection);
  };

  //////////////////////
  const handleChange = (name, value) => {
    // Special validation for tripOff - must be positive number greater than 0
    if (name === "tripOff") {
      const numValue = parseFloat(value);
      // Allow empty string for clearing, but validate when there's a value
      if (value !== "" && (isNaN(numValue) || numValue <= 0)) {
        return; // Don't update if invalid
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value, // Update form data with new input value
    }));
  };

  // Categories
  const handleCategoryChange = (categories) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: categories, // Directly store the categories array
    }));
  };
  // Discount
  const handleDiscountChange = (discount) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      discount: discount, // Update categories field in formData
    }));
  };
  // Reviews
  const handleReviewsChange = (reviws) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      reviews: reviws, // Update categories field in formData
    }));
  };
  //Rating

  // const handleRatingChange = (ratings) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     ratings: ratings, // Update categories field in formData
  //   }));
  // };
  //Vanders

  const handleVandersChange = (vanders) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vanders: vanders, // Update categories field in formData
    }));
  };
  //Hosts
  const handleHostChange = (hostIds) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      host: hostIds, // This will now store only the IDs
    }));
  };
  // Function to handle changes in addDay and update formData
  const handleDayChange = (index, field, value) => {
    const updatedAddDay = [...addDay];
    updatedAddDay[index][field] = value;

    setAddDay(updatedAddDay);

    // Update formData
    setFormData((prevFormData) => ({
      ...prevFormData,
      addDayArray: updatedAddDay,
    }));
  };
  const [addDay, setAddDay] = useState(addArry);
  // console.log("AddDay....", addDay);

  const handleAddDay = () => {
    // Create a new object representing the additional day
    const newDay = {
      day: addDay.length + 1,
      title: addDay.length + 1,
      description: addDay.length + 1,
    };
    // Update the state using functional update to preserve the previous state
    setAddDay((prevAddDay) => [...prevAddDay, newDay]);
  };

  const deleteDay = () => {
    setAddDay((prevAddDay) => prevAddDay.slice(0, -1));
  };

  // booking Section

  // const handleTypeInputChange = (event, name) => {
  //   const { value } = event.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };


  // Type

  const handleAddBatchItem = () => {
    // Add new empty items to the arrays
    setFormData((prevState) => ({
      ...prevState,
      numberOfSeats: [...prevState.numberOfSeats, { batchSeats: 0 }],
      selectDate: [...prevState.selectDate, { BatchDate: "" }],
      endSelectDate: [...prevState.endSelectDate, { EndBatchDate: "" }],
      numberOfDays: [...prevState.numberOfDays, { selectDays: "" }],
    }));
  };

  const handleDeleteBatchItem = () => {
    // Check if there's only one item left, don't delete it
    if (formData.numberOfSeats.length === 1) {
      return;
    }
    // Remove the last item from the arrays
    setFormData((prevState) => ({
      ...prevState,
      numberOfSeats: prevState.numberOfSeats.slice(0, -1),
      selectDate: prevState.selectDate.slice(0, -1),
      endSelectDate: prevState.endSelectDate.slice(0, -1),
      numberOfDays: prevState.numberOfDays.slice(0, -1),
    }));
  };

  const handleTypeInputChangeBatch = (event, name, index) => {
    // Update the value of the corresponding array item
    const newValue = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: prevState[name].map((item, idx) =>
        idx === index ? { ...item, [Object.keys(item)[0]]: newValue } : item
      ),
    }));
  };
  const handleGallaryImageChange = (event) => {
    const files = event.target.files;
    const images = Array.from(files); // Convert FileList to array
    setFormData({
      ...formData,
      gallaryImages: images,
    });
  };

  // Image preview handlers
  const handleImagePreview = (name, file) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: file,
    }));
  };

  const handleImageRemove = (name) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: null,
    }));
  };

  const handleGallaryImageRemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      gallaryImages: prevState.gallaryImages.filter((_, i) => i !== index),
    }));
  };
  //
  const handleBookingToggle = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      enableBooking: event.target.checked,
    }));
  };
  const handleEnquireToggle = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      enableEnquire: event.target.checked,
      // If enquire is disabled and current type is Customized, switch to Batch
      type: !event.target.checked && prevFormData.type === "Customized" ? "Batch" : prevFormData.type,
    }));
  };
  const handleTrendingToggle = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      Trending: event.target.checked,
    }));
  };

  const [AddTrip] = useAddTripMutation();

  const handleTripAddSubmit = async (e) => {
    e.preventDefault();

    // Set validation attempted flag
    setValidationAttempted(true);

    // Validate required fields
    const validationErrors = [];

    // Basic Details validation
    if (!formData.title?.trim()) {
      validationErrors.push({ section: "basicDetails", message: "Title is required" });
    }
    if (!formData.subTitle?.trim()) {
      validationErrors.push({ section: "basicDetails", message: "Subtitle is required" });
    }
    if (!formData.price || formData.price <= 0) {
      validationErrors.push({ section: "basicDetails", message: "Price is required and must be greater than 0" });
    }
    if (!formData.location?.trim()) {
      validationErrors.push({ section: "basicDetails", message: "Location is required" });
    }
    if (!formData.bannerImage) {
      validationErrors.push({ section: "basicDetails", message: "Banner Image is required" });
    }
    if (!formData.cardImage) {
      validationErrors.push({ section: "basicDetails", message: "Card Image is required" });
    }

    // Trip Details validation
    if (!formData.numberOfDays || formData.numberOfDays.length === 0 || !formData.numberOfDays[0]?.selectDays) {
      validationErrors.push({ section: "tripDetails", message: "Number of Days is required" });
    }
    if (!formData.numberOfSeats || formData.numberOfSeats.length === 0 || !formData.numberOfSeats[0]?.batchSeats) {
      validationErrors.push({ section: "tripDetails", message: "Number of Seats is required" });
    }
    if (!formData.selectDate || formData.selectDate.length === 0 || !formData.selectDate[0]?.BatchDate) {
      validationErrors.push({ section: "tripDetails", message: "Start Date is required" });
    }
    if (!formData.endSelectDate || formData.endSelectDate.length === 0 || !formData.endSelectDate[0]?.EndBatchDate) {
      validationErrors.push({ section: "tripDetails", message: "End Date is required" });
    }

    // If there are validation errors, show them and open the appropriate accordion
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];
      setExpandedAccordion(firstError.section);

      // Scroll to the accordion after a short delay
      setTimeout(() => {
        const accordionElement = document.querySelector(`[data-accordion="${firstError.section}"]`);
        if (accordionElement) {
          accordionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      showToast(`Please fill in all required fields: ${firstError.message}`, "error");
      return;
    }

    try {
      setLoading(true);
      // Create a new FormData object to append form data and images
      const formDataToSend = new FormData();

      // Append form data fields to formDataToSend
      formDataToSend.append("title", formData.title);
      formDataToSend.append("subTitle", formData.subTitle);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("strikePrice", formData.strikePrice);
      formDataToSend.append("commissionRate", formData.commissionRate);
      formDataToSend.append("nights", formData.nights);
      formDataToSend.append("days", formData.days);
      formDataToSend.append("date", formData.date);
      formDataToSend.append("firstBookingPrice", formData.firstBookingPrice);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("pickUp", formData.pickUp);
      formDataToSend.append("dropOff", formData.dropOff);
      formDataToSend.append("overview", formData.overview);
      formDataToSend.append("type", formData.type);
      formDataToSend.append(
        "numberOfDays",
        JSON.stringify(formData?.numberOfDays)
      );
      formDataToSend.append(
        "numberOfSeats",
        JSON.stringify(formData?.numberOfSeats)
      );
      formDataToSend.append("selectDate", JSON.stringify(formData.selectDate));
      formDataToSend.append(
        "endSelectDate",
        JSON.stringify(formData?.endSelectDate)
      );
      formDataToSend.append("Inclusion", formData.Inclusion);
      formDataToSend.append("Exclusion", formData.Exclusion);
      formDataToSend.append("ThingsToCarry", formData.ThingsToCarry);
      formDataToSend.append("Cancellation", formData.Cancellation);
      formDataToSend.append("enableBooking", formData.enableBooking);
      formDataToSend.append("enableEnquire", formData.enableEnquire);
      formDataToSend.append("categories", JSON.stringify(formData.categories));
      formDataToSend.append("vendors", JSON.stringify(formData.vanders));
      formDataToSend.append("host", formData.host);
      console.log("Host IDs being sent:", formData.host); // Debug log - now shows IDs only
      formDataToSend.append("reviews", JSON.stringify(formData.reviews));
      formDataToSend.append("ratings", JSON.stringify(formData.ratings));
      formDataToSend.append("discount", JSON.stringify(formData.discount));

      // Append single images to formDataToSend
      formDataToSend.append("bannerImage", formData.bannerImage);
      formDataToSend.append("cardImage", formData.cardImage);
      formDataToSend.append("itenarryImg", formData.itenarryImg);
      formDataToSend.append("trendingHeading", formData.trendingHeading);
      formDataToSend.append("Trending", formData.Trending);
      formDataToSend.append("tripOff", formData.tripOff);
      formDataToSend.append("seoTitle", formData.seoTitle || "");
      formDataToSend.append("seoSlug", formData.seoSlug || "");
      formDataToSend.append("metaDescription", formData.metaDescription || "");

      // Append multiple images to formDataToSend
      formData.gallaryImages.forEach((image) => {
        formDataToSend.append("gallaryImages", image);
      });
      // addSection.forEach((section, sectionIndex) => {
      //   section.array.forEach((item, dayIndex) => {
      //     formDataToSend.append(`sections${sectionIndex}`, item);
      //   });
      // });
      formDataToSend.append("addsection", JSON.stringify(addSection));
      formDataToSend.append("addDays", JSON.stringify(addDay));

      // Send formDataToSend to the server using AddTrip mutation
      console.log("formDataToSend", formDataToSend);
      const response = await AddTrip(formDataToSend).unwrap();
      console.log("Response from server:", response);
      setLoading(false);
      showToast(response?.message, "success");
    } catch (error) {
      setLoading(false);
      showToast(error?.data?.error, "error");
      console.error("Error", error);
    }
  };

  return (
    <Box sx={{}}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <form onSubmit={handleTripAddSubmit}>
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
          <Grid
            data-accordion="basicDetails"
            container
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              gap: "0px 20px",
            }}
          >
            {array.map(({ plach, required, name, title, type }, index) => {
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
                      <Box>
                        {/* Image Preview Box */}
                        <Box
                          sx={{
                            width: "200px",
                            height: "120px",
                            border: "2px dashed #E7E7E7",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mb: 1,
                            background: "#f5f5f5",
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          {formData[name] ? (
                            <>
                              <img
                                src={safeCreateObjectURL(formData[name])}
                                alt={`${name} preview`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "6px",
                                }}
                              />
                              <Button
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  minWidth: "auto",
                                  width: "24px",
                                  height: "24px",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                  },
                                }}
                                onClick={() => handleImageRemove(name)}
                              >
                                ×
                              </Button>
                            </>
                          ) : (
                            <Typography
                              sx={{ color: "#737373", fontSize: "12px" }}
                            >
                              {name === "bannerImage"
                                ? "Banner"
                                : name === "cardImage"
                                  ? "Card"
                                  : "Itinerary"}
                            </Typography>
                          )}
                        </Box>
                        {/* Upload Button */}
                        <Button
                          component="label"
                          variant="outlined"
                          size="small"
                          sx={{
                            border: "1px solid #E7E7E7",
                            color: "#737373",
                            borderRadius: "8px",
                            textTransform: "none",
                          }}
                        >
                          {formData[name] ? "Change" : "Upload"}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                              handleImagePreview(name, e.target.files[0])
                            }
                          />
                        </Button>
                      </Box>
                    ) : (
                      <TextField
                        sx={inputStyle}
                        size="small"
                        name={name}
                        placeholder={plach}
                        type={type}
                        required={required}
                        value={formData[name] || ""}
                        onChange={(e) => handleChange(name, e.target.value)}
                        inputProps={name === "tripOff" ? { min: 1, step: 1 } : {}}
                      />
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Container>

        <Container>
          {/* Booking */}
          <Accordion sx={{ my: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Booking
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box>
                {addSection.map(({ section, array }, sectionIndex) => (
                  <Box
                    key={sectionIndex}
                    sx={{
                      border: "1px solid #E5E7EB",
                      borderRadius: "15px",
                      p: 1,
                      my: 3,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        sx={{
                          color: "#393938",
                          fontFamily: "Ubuntu",
                          fontSize: "19px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "140%",
                          mt: 3,
                        }}
                      >
                        Section {section}
                      </Typography>

                      {addSection.length === sectionIndex + 1 && (
                        <Button
                          sx={{
                            color: "#D0482A",
                            textTransform: "capitalize",
                            fontSize: "12px",
                          }}
                          onClick={() => handleDeleteSection(sectionIndex)}
                        >
                          <DeleteIcon sx={{ color: "red", fontSize: "20px" }} />
                          Delete Section
                        </Button>
                      )}
                    </Box>
                    <Grid container sx={{ width: "100%" }}>
                      {/* Section Title input */}
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
                            Section Title
                          </Typography>
                          <TextField
                            size="small"
                            placeholder=""
                            type="text"
                            name={`section-${sectionIndex}`}
                            value={addSection[sectionIndex]?.sectionTitle || ""}
                            onChange={(e) =>
                              handleSectionTitleChange(
                                sectionIndex,
                                e.target.value
                              )
                            }
                            required
                            sx={inputStyle}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Section Days */}
                    <Box sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      ></Box>

                      {/* Day inputs */}
                      {array.map(({ Title, TitlePrice }, dayIndex) => (
                        <Grid
                          key={dayIndex}
                          container
                          sx={{
                            border: "1px solid #E5E7EB",
                            width: "100%",
                            display: "flex",
                            gap: "20px",
                            p: { xs: 1, md: 2 },
                            borderRadius: "15px",
                            mt: 3,
                            position: "relative",
                          }}
                        >
                          {array.length === dayIndex + 1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                right: "0px",
                                top: "0px",
                              }}
                            >
                              <IconButton
                                onClick={() =>
                                  handleDeleteLastSectionItem(sectionIndex, 0)
                                }
                              >
                                <Tooltip title="Delete" placement="top">
                                  <DeleteIcon sx={{ color: "red" }} />
                                </Tooltip>
                              </IconButton>
                            </Box>
                          )}
                          <Grid
                            item
                            xs={12}
                            sm={5.8}
                            md={3.8}
                            sx={{ width: "100%" }}
                          >
                            <Box sx={{ width: "100%" }}>
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "left",
                                  mb: 1,
                                }}
                              >
                                Type {dayIndex + 1}*
                              </Typography>

                              <TextField
                                size="small"
                                type="text"
                                name={`section-item-title-${sectionIndex}-${dayIndex}`}
                                required
                                value={Title}
                                onChange={(e) =>
                                  handleInputChangeSection(
                                    sectionIndex,
                                    dayIndex,
                                    "Title",
                                    e.target.value
                                  )
                                }
                                sx={inputStyle}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={5.8}
                            md={3.8}
                            sx={{ width: "100%" }}
                          >
                            <Box sx={{ width: "100%" }}>
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "left",
                                  mb: 1,
                                }}
                              >
                                Title {dayIndex + 1} Price*
                              </Typography>
                              <TextField
                                name={`title-price-${sectionIndex}-${dayIndex}`}
                                size="small"
                                type="text"
                                required
                                value={TitlePrice}
                                onChange={(e) =>
                                  handleInputChangeSection(
                                    sectionIndex,
                                    dayIndex,
                                    "TitlePrice",
                                    e.target.value
                                  )
                                }
                                sx={inputStyle}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      ))}

                      {/* Add Day Button */}
                      <Box
                        onClick={() => handleAddSectionItem(sectionIndex)}
                        sx={{
                          mt: 5,
                          cursor: "pointer",
                        }}
                      >
                        <Typography sx={{ color: "#CD482A", fontWeight: 700 }}>
                          + Add Items
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

                {/* Add Section Button */}
                <Box
                  onClick={handleAddSection}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "0px 0px",
                    mt: 5,
                  }}
                >
                  <Button>+ Add Section</Button>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Category */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Category
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  gap: "0px 20px",
                  alignItems: { xs: "start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Select Category*
                  </Typography>
                  <SelecrMuiInput
                    names={CatagoryNames}
                    onCategoryChange={handleCategoryChange}
                  />
                </Box>
                <Link
                  to="/category"
                  style={{
                    color: " #CD482A",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Manage Category
                </Link>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* overview */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Overview
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Typography sx={{ color: "#737373", textAlign: "left", mt: 2 }}>
                  Overview
                </Typography>
                <textarea
                  size="small"
                  rows="8"
                  name="overview"
                  onChange={(e) => handleChange("overview", e.target.value)}
                  onFocus={() => {
                    document.querySelector("textarea").style.borderColor =
                      "#E7E7E7";
                  }}
                  onBlur={() => {
                    document.querySelector("textarea").style.borderColor =
                      "#E7E7E7";
                  }}
                  style={{
                    border: "1px solid #E7E7E7",
                    width: "100%",
                    outline: "none",
                    borderColor: "#E7E7E7",
                    transition: "border-color 0.3s ease",
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* itenary */}

          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Itinerary
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid container sx={{ width: "100%" }}>
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
                      Upload Itinerary
                    </Typography>
                    {/* Itinerary Image Preview */}
                    <Box
                      sx={{
                        width: "200px",
                        height: "120px",
                        border: "2px dashed #E7E7E7",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                        background: "#f5f5f5",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {formData.itenarryImg ? (
                        <>
                          <img
                            src={safeCreateObjectURL(formData.itenarryImg)}
                            alt="Itinerary preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                          <Button
                            size="small"
                            sx={{
                              position: "absolute",
                              top: "4px",
                              right: "4px",
                              minWidth: "auto",
                              width: "24px",
                              height: "24px",
                              backgroundColor: "rgba(0,0,0,0.5)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.7)",
                              },
                            }}
                            onClick={() => handleImageRemove("itenarryImg")}
                          >
                            ×
                          </Button>
                        </>
                      ) : (
                        <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                          Itinerary
                        </Typography>
                      )}
                    </Box>

                    {/* Upload Button */}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{
                        border: "1px solid #E7E7E7",
                        color: "#737373",
                        borderRadius: "8px",
                        textTransform: "none",
                      }}
                    >
                      {formData.itenarryImg ? "Change" : "Upload"}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          handleImagePreview("itenarryImg", e.target.files[0])
                        }
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              {addDay.map(({ description, day, title }, index) => {
                return (
                  <Box key={index} sx={{ mt: 5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                          mt: 3,
                        }}
                      >
                        Day {day}
                      </Typography>
                      {addDay.length === index + 1 && (
                        <>
                          <IconButton onClick={deleteDay}>
                            <Tooltip title="Delete" placement="top">
                              <DeleteIcon sx={{ color: "red" }} />
                            </Tooltip>
                          </IconButton>
                        </>
                      )}
                    </Box>

                    <Grid
                      container
                      sx={{
                        border: "1px solid #E5E7EB",
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "20px",
                        p: { xs: 1, md: 2 },
                        borderRadius: "15px",
                        mt: 3,
                      }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={5.8}
                        md={3.8}
                        sx={{ width: "100%" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Typography
                            sx={{
                              color: "#737373",
                              textAlign: "left",
                              mb: 1,
                            }}
                          >
                            Title*
                          </Typography>
                          <TextField
                            sx={inputStyle}
                            size="small"
                            type="text"
                            name={`day-title-${index}`}
                            required
                            value={title}
                            onChange={(e) =>
                              handleDayChange(index, "title", e.target.value)
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={5.7}
                        md={7.8}
                        sx={{ width: "100%" }}
                      >
                        <Box sx={{ width: "100%" }}>
                          <Typography
                            sx={{
                              color: "#737373",
                              textAlign: "left",
                              mb: 1,
                            }}
                          >
                            Description*
                          </Typography>
                          <TextField
                            sx={inputStyle}
                            size="small"
                            type="text"
                            name={`day-description-${index}`}
                            required
                            value={description}
                            onChange={(e) =>
                              handleDayChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "0px 0px",
                  mt: 5,
                }}
              >
                <IconButton
                  onClick={handleAddDay}
                  sx={{ color: "#CD482A", fontWeight: "bold" }}
                >
                  <AddIcon />
                </IconButton>

                <Typography sx={{ color: "#CD482A", fontWeight: 700 }}>
                  {" "}
                  Add Day
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Type */}
          <Accordion
            data-accordion="tripDetails"
            expanded={expandedAccordion === "tripDetails"}
            onChange={handleAccordionChange("tripDetails")}
            sx={{ mb: 2, ...accordionStyle }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
                >
                  Type
                </Typography>
                {validationAttempted &&
                  ((formData.type === "Batch" &&
                    (!formData.numberOfSeats || formData.numberOfSeats.length === 0 || !formData.numberOfSeats[0]?.batchSeats ||
                      !formData.selectDate || formData.selectDate.length === 0 || !formData.selectDate[0]?.BatchDate ||
                      !formData.endSelectDate || formData.endSelectDate.length === 0 || !formData.endSelectDate[0]?.EndBatchDate)) ||
                    (formData.type === "Customized" &&
                      (!formData.numberOfDays || formData.numberOfDays.length === 0 || !formData.numberOfDays[0]?.selectDays ||
                        !formData.numberOfSeats || formData.numberOfSeats.length === 0 || !formData.numberOfSeats[0]?.batchSeats ||
                        !formData.selectDate || formData.selectDate.length === 0 || !formData.selectDate[0]?.BatchDate ||
                        !formData.endSelectDate || formData.endSelectDate.length === 0 || !formData.endSelectDate[0]?.EndBatchDate))) && (
                    <Box
                      sx={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#EC3F18",
                        animation: "pulse 2s infinite",
                      }}
                    />
                  )}
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {validationAttempted &&
                ((formData.type === "Batch" &&
                  (!formData.numberOfSeats || formData.numberOfSeats.length === 0 || !formData.numberOfSeats[0]?.batchSeats ||
                    !formData.selectDate || formData.selectDate.length === 0 || !formData.selectDate[0]?.BatchDate ||
                    !formData.endSelectDate || formData.endSelectDate.length === 0 || !formData.endSelectDate[0]?.EndBatchDate)) ||
                  (formData.type === "Customized" &&
                    (!formData.numberOfDays || formData.numberOfDays.length === 0 || !formData.numberOfDays[0]?.selectDays ||
                      !formData.numberOfSeats || formData.numberOfSeats.length === 0 || !formData.numberOfSeats[0]?.batchSeats ||
                      !formData.selectDate || formData.selectDate.length === 0 || !formData.selectDate[0]?.BatchDate ||
                      !formData.endSelectDate || formData.endSelectDate.length === 0 || !formData.endSelectDate[0]?.EndBatchDate))) && (
                  <Box
                    sx={{
                      backgroundColor: "#fff5f5",
                      border: "1px solid #EC3F18",
                      borderRadius: "8px",
                      padding: "12px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#EC3F18",
                      }}
                    />
                    <Typography
                      sx={{
                        color: "#EC3F18",
                        fontSize: "14px",
                        fontWeight: 500,
                      }}
                    >
                      Please fill in all required fields marked with *
                    </Typography>
                  </Box>
                )}
              <Grid container>
                <Grid item xs={12} sm={6} md={3.8}>
                  <Box sx={{ height: "48px", pt: 0.8 }}>
                    <TextField
                      sx={inputStyle2}
                      id="outlined-select-currency"
                      select
                      defaultValue="Batch"
                      size="small"
                      name="type"
                      onChange={(e) => handleChange("type", e.target.value)}
                    >
                      {type.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.value === "Customized" && !formData.enableEnquire}
                          sx={{
                            width: "100%",
                            textAlign: "left",
                            color: option.value === "Customized" && !formData.enableEnquire ? "#ccc" : "#000",
                            fontSize: "13px",
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  {!formData?.enableEnquire || formData?.type === "Batch" ? (
                    <>
                      {formData.numberOfSeats.map((_, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            gap: "20px 20px",
                            flexDirection: { xs: "column", sm: "row" },
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3.8}
                            sx={{ color: "#000" }}
                          >
                            <Box sx={{ width: "100%", mt: 5 }}>
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "left",
                                  mb: 1,
                                }}
                              >
                                Number of Seats*
                              </Typography>
                              <TextField
                                sx={inputStyle}
                                size="small"
                                type="number"
                                name={`batch-seats-${index}`}
                                required
                                value={formData.numberOfSeats[index].batchSeats}
                                onChange={(event) =>
                                  handleTypeInputChangeBatch(
                                    event,
                                    "numberOfSeats",
                                    index
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3.8}
                            sx={{ color: "#000" }}
                          >
                            <Box sx={{ width: "100%", mt: { xs: 0, sm: 5 } }}>
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "left",
                                  mb: 1,
                                }}
                              >
                                Start Date*
                              </Typography>
                              <TextField
                                sx={inputStyle}
                                size="small"
                                type="date"
                                name={`batch-start-date-${index}`}
                                required
                                value={formData.selectDate[index].BatchDate}
                                onChange={(event) =>
                                  handleTypeInputChangeBatch(
                                    event,
                                    "selectDate",
                                    index
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3.8}
                            sx={{ color: "#000" }}
                          >
                            <Box sx={{ width: "100%", mt: { xs: 0, sm: 5 } }}>
                              <Typography
                                sx={{
                                  color: "#737373",
                                  textAlign: "left",
                                  mb: 1,
                                }}
                              >
                                End Date*
                              </Typography>
                              <TextField
                                sx={inputStyle}
                                size="small"
                                type="date"
                                name={`batch-end-date-${index}`}
                                required
                                value={
                                  formData.endSelectDate[index].EndBatchDate
                                }
                                onChange={(event) =>
                                  handleTypeInputChangeBatch(
                                    event,
                                    "endSelectDate",
                                    index
                                  )
                                }
                              />
                            </Box>
                          </Grid>
                          {index === formData.numberOfSeats.length - 1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                right: "0px",
                                bottom: { xs: "170px", sm: "70px", md: "50px" },
                              }}
                            >
                              <IconButton onClick={handleDeleteBatchItem}>
                                <Tooltip title="Delete" placement="top">
                                  <DeleteIcon sx={{ color: "red" }} />
                                </Tooltip>
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                      ))}
                      <Button onClick={handleAddBatchItem}>
                        + Add Batch Item
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          flexDirection: "column",
                          gap: "20px 15px",
                          border: "1px solid #E7E7E7",

                          p: { xs: 1, sm: 2 },
                          borderRadius: "10px",
                          mt: 2,
                        }}
                      >
                        {formData?.numberOfSeats?.map((_, index) => {
                          return (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexDirection: { xs: "column", sm: "row" },
                                gap: "10px 10px",
                                // flexWrap: "wrap",
                                width: "100%",
                                border: "1px solid #E7E7E7",
                                borderRadius: "10px",
                                p: { xs: 0.5, md: 1 },
                              }}
                            >
                              {typeArray.map(
                                ({ name, plach, title, type }, indexm) => {
                                  return (
                                    <Box
                                      key={indexm}
                                      sx={{
                                        width: "100%",
                                        // border: "2px solid red",
                                      }}
                                    >
                                      <Box
                                        key={index}
                                        sx={{
                                          color: "#000",
                                          my: 2,
                                          // border: "2px solid red",
                                        }}
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
                                            placeholder={plach}
                                            type={type}
                                            name={name}
                                            value={
                                              name === "numberOfDays"
                                                ? formData.numberOfDays[index]?.selectDays || ""
                                                : name === "numberOfSeats"
                                                  ? formData.numberOfSeats[index]?.batchSeats || ""
                                                  : name === "selectDate"
                                                    ? formData.selectDate[index]?.BatchDate || ""
                                                    : name === "endSelectDate"
                                                      ? formData.endSelectDate[index]?.EndBatchDate || ""
                                                      : ""
                                            }
                                            required={
                                              formData?.type === "Batch"
                                                ? false
                                                : true
                                            }
                                            onChange={(event) =>
                                              handleTypeInputChangeBatch(
                                                event,
                                                name,
                                                index
                                              )
                                            }
                                          />
                                        </Box>
                                      </Box>

                                      {index ===
                                        formData?.numberOfSeats?.length - 1 && (
                                          <Box
                                            sx={{
                                              position: "absolute",
                                              right: "40px",
                                              bottom: {
                                                xs: "350px",
                                                sm: "145px",
                                                md: "150px",
                                              },
                                            }}
                                          >
                                            <IconButton
                                              onClick={handleDeleteBatchItem}
                                            >
                                              <Tooltip
                                                title="Delete"
                                                placement="top"
                                              >
                                                <DeleteIcon
                                                  sx={{ color: "red" }}
                                                />
                                              </Tooltip>
                                            </IconButton>
                                          </Box>
                                        )}
                                    </Box>
                                  );
                                }
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                      <Button onClick={handleAddBatchItem}>
                        + Add Customized Item
                      </Button>
                    </>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* inclusion & Exclusion */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Inclusion & Exclusion
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Typography sx={{ color: "#737373", textAlign: "left", mt: 2 }}>
                  Inclusion
                </Typography>
                <textarea
                  style={{
                    border: "1px solid #E7E7E7",
                    width: "100%",
                    outline: "none",
                    borderColor: "#E7E7E7",
                    transition: "border-color 0.3s ease",
                  }}
                  name="Inclusion"
                  onChange={(e) => handleChange("Inclusion", e.target.value)}
                  size="small"
                  rows="8"
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
              <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Typography sx={{ color: "#737373", textAlign: "left", mt: 2 }}>
                  Exclusion
                </Typography>
                <textarea
                  style={{
                    border: "1px solid #E7E7E7",
                    width: "100%",
                    outline: "none",
                    borderColor: "#E7E7E7",
                    transition: "border-color 0.3s ease",
                  }}
                  size="small"
                  name="Exclusion"
                  rows="8"
                  onChange={(e) => handleChange("Exclusion", e.target.value)}
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
            </AccordionDetails>
          </Accordion>

          {/* other info */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Other Info
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Typography sx={{ color: "#737373", textAlign: "left", mt: 2 }}>
                  Things to Carry
                </Typography>
                <textarea
                  style={{
                    border: "1px solid #E7E7E7",
                    width: "100%",
                    outline: "none",
                    borderColor: "#E7E7E7",
                    transition: "border-color 0.3s ease",
                  }}
                  name="ThingsToCarry"
                  size="small"
                  rows="8"
                  onChange={(e) =>
                    handleChange("ThingsToCarry", e.target.value)
                  }
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
              <Box sx={{ width: { xs: "100%", md: "60%" } }}>
                <Typography sx={{ color: "#737373", textAlign: "left", mt: 2 }}>
                  Cancellation
                </Typography>
                <textarea
                  style={{
                    border: "1px solid #E7E7E7",
                    width: "100%",
                    outline: "none",
                    borderColor: "#E7E7E7",
                    transition: "border-color 0.3s ease",
                  }}
                  name="Cancellation"
                  onChange={(e) => handleChange("Cancellation", e.target.value)}
                  size="small"
                  rows="8"
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
            </AccordionDetails>
          </Accordion>

          {/* Discount */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Discounts
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box>
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Select Platform Coupons
                </Typography>
                <SelecrMuiInput
                  names={discountNames}
                  onCategoryChange={handleDiscountChange}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          {/* Gallary */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Gallary
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Grid
                container
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "0px 20px",
                }}
              >
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
                      Gallary
                    </Typography>

                    {/* Gallery Image Previews */}
                    {formData.gallaryImages.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        {formData.gallaryImages.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              position: "relative",
                              width: "150px",
                              height: "100px",
                              border: "2px dashed #E7E7E7",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "#f5f5f5",
                            }}
                          >
                            <img
                              src={safeCreateObjectURL(image)}
                              alt={`Gallery ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                            <Button
                              size="small"
                              sx={{
                                position: "absolute",
                                top: "4px",
                                right: "4px",
                                minWidth: "auto",
                                width: "24px",
                                height: "24px",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                color: "white",
                                "&:hover": {
                                  backgroundColor: "rgba(0,0,0,0.7)",
                                },
                              }}
                              onClick={() => handleGallaryImageRemove(index)}
                            >
                              ×
                            </Button>
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      sx={{
                        border: "1px solid #E7E7E7",
                        color: "#737373",
                        borderRadius: "8px",
                        textTransform: "none",
                      }}
                    >
                      + Add Images
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        multiple
                        onChange={handleGallaryImageChange}
                      />
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/* Review */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Review
              </Typography>
            </AccordionSummary>
            <Box sx={{ display: "flex" }}>
              <AccordionDetails>
                <Box>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Select Reviews
                  </Typography>
                  <SelecrMuiInput
                    names={ratingNames}
                    onCategoryChange={handleReviewsChange}
                  />
                </Box>
              </AccordionDetails>
              <AccordionDetails>
                {/* <Box>
                  <Typography
                    sx={{
                      color: "#737373",
                      textAlign: "left",
                      mb: 1,
                    }}
                  >
                    Rating
                  </Typography>
                  <SelecrMuiInput
                    names={ratingNames}
                    onCategoryChange={handleRatingChange}
                  />
                </Box> */}
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Rating
                </Typography>
                <Box>
                  <TextField
                    sx={{
                      ...inputStyle2,
                      "& .MuiSelect-select": {
                        color: "#000",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#000",
                      },
                    }}
                    id="outlined-select-currency"
                    select
                    defaultValue="1"
                    style={{ minWidth: "100px" }}
                    size="small"
                    name="ratings"
                    onChange={(e) => handleChange("ratings", e.target.value)}
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
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          "&.Mui-selected": {
                            backgroundColor: "#E7E7E7",
                            "&:hover": {
                              backgroundColor: "#E7E7E7",
                            },
                          },
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </AccordionDetails>
            </Box>
          </Accordion>
          {/* Vendors */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Vendors
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box>
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Select Vendor
                </Typography>
                <SelecrMuiInput
                  names={VanderNames}
                  onCategoryChange={handleVandersChange}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
          {/* Host */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Host
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box>
                <Typography
                  sx={{
                    color: "#737373",
                    textAlign: "left",
                    mb: 1,
                  }}
                >
                  Select Host
                </Typography>
                <SelecrMuiInput
                  names={HostNames}
                  onCategoryChange={handleHostChange}
                  multiple={false}
                />
              </Box>
            </AccordionDetails>
          </Accordion>


          {/* SEO Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
                >
                  SEO
                </Typography>
                {!seoManuallyEdited.current && formData.seoTitle && (
                  <Typography
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#fff",
                      background: "#22c55e",
                      px: 1,
                      py: 0.2,
                      borderRadius: "10px",
                      letterSpacing: "0.5px",
                    }}
                  >
                    AUTO
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {!seoManuallyEdited.current && formData.seoTitle && (
                <Typography
                  sx={{ fontSize: "13px", color: "#6B7280", mb: 2 }}
                >
                  SEO fields are auto-generated from the trip title, location, and category. Edit any field below to override.
                </Typography>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography sx={{ color: "#737373" }}>SEO Title</Typography>
                    <Typography sx={{ fontSize: "12px", color: "#9CA3AF" }}>
                      ({formData.seoTitle?.length || 0}/60 chars)
                    </Typography>
                  </Box>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoTitle"
                    placeholder="Enter SEO title"
                    value={formData.seoTitle}
                    onChange={(e) => {
                      seoManuallyEdited.current = true;
                      handleChange("seoTitle", e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Slug</Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoSlug"
                    placeholder="Enter slug (e.g. leh-ladakh-bike-trip)"
                    value={formData.seoSlug}
                    onChange={(e) => {
                      seoManuallyEdited.current = true;
                      handleChange("seoSlug", e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography sx={{ color: "#737373" }}>Meta Description</Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color:
                          formData.metaDescription?.length > 160
                            ? "#EF4444"
                            : formData.metaDescription?.length >= 140
                            ? "#22c55e"
                            : "#9CA3AF",
                      }}
                    >
                      ({formData.metaDescription?.length || 0}/160 chars)
                    </Typography>
                  </Box>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        height: "auto",
                        minHeight: "80px",
                      },
                    }}
                    size="small"
                    name="metaDescription"
                    placeholder="Enter meta description (140–160 chars)"
                    value={formData.metaDescription}
                    onChange={(e) => {
                      seoManuallyEdited.current = true;
                      handleChange("metaDescription", e.target.value);
                    }}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>





          {/* CTA Buttons */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                CTA Buttons
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: { xs: "20px 0px", sm: "0px 40px" },
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "#000" }}>
                    Booking Enabled
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      name="enableBooking"
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      onChange={handleBookingToggle}
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "#000" }}>
                    Enquire Enabled
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      name="enableEnquire"
                      onChange={handleEnquireToggle}
                    />
                  </FormGroup>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ color: "#000" }}>
                    Trending Enabled
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={<IOSSwitch sx={{ m: 1 }} />}
                      name="Trending"
                      onChange={handleTrendingToggle}
                    />
                  </FormGroup>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
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
        </Container>
      </form>
    </Box>
  );
};

export default AddTrip;
