import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreateHostMutation,
  useGetHostByIdQuery,
  useUpdateHostMutation,
} from "../../Redux/services/hostsApi";

const BADGE_ICON_OPTIONS = [
  "verified",
  "shield",
  "certificate",
  "award",
  "trophy",
  "star",
  "firstaid",
  "mountain",
  "camera",
  "leaf",
  "language",
  "clock",
];

const AddHost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const DRAFT_KEY = "nomadicHostDraft"; // autosaved new-host draft (add mode only)
  const [draftFound, setDraftFound] = useState(false);

  const [createHost, { isLoading: isCreating }] = useCreateHostMutation();
  const [updateHost, { isLoading: isUpdating }] = useUpdateHostMutation();

  // Fetch host data if in edit mode
  const { data: existingHost, isLoading: isLoadingHost } = useGetHostByIdQuery(
    id,
    {
      skip: !isEditMode,
    }
  );

  const isLoading = isCreating || isUpdating || isLoadingHost;

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success", // "success", "error", "warning", "info"
  });

  // Accordion state for auto-opening on validation errors
  const [expandedAccordion, setExpandedAccordion] = useState(false);
  const [validationAttempted, setValidationAttempted] = useState(false);
  // Host reels: validation message for the video picker.
  const [reelError, setReelError] = useState("");
  const [formData, setFormData] = useState({
    // 1. Basic Information
    hostName: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    completeAddress: "",

    // 2. Business Information
    panNumber: "",
    gstNumber: "",

    // 3. Bank Account Details
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",

    // 4. Branding
    hostTitle: "",
    tagline: "",
    brandingLogo: null,
    coverImage: null,

    // 5. About Information
    hostOverview: "",
    shortBio: "",
    foundedYear: "",
    experience: "",
    hqLocation: "",
    achievements: [],
    gallery: [],
    previousGallery: [],

    // Instagram Reels gallery — array of public reel URL strings (ordered).
    reels: [],

    // 6. Specialties & Expertise
    specialties: [],
    languages: [],

    // Ask the host (FAQ)
    faqs: [],

    // Verification badges (admin-managed trust badges)
    verificationBadges: [],

    // 7. Trust & Service Quality
    isVerified: false,
    tripsHosted: 0,
    travellersHosted: 0,
    successRate: 0,
    responseRate: 0,
    responseTimeLabel: "",
    regionsHosted: [],

    // 8. Contact Information
    phoneNumber: "",
    emailAddress: "",
    whatsapp: "",
    supportHours: "",

    // 9. Social Media
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
      website: "",
    },

    // 10. Document Uploads
    panCard: null,
    gstCertificate: null,
    bankPassbook: null,
    businessLicense: null,

    // 11. Finance (Admin-only)
    commissionRate: 0,

    // 12. SEO Information
    seoTitle: "",
    seoSlug: "",
    metaDescription: "",

    // 13. Host Onboarding (self-serve) — additive optional fields
    displayName: "",
    country: "",
    whyHost: "",
    uniqueValue: "",
    businessType: "",
    altPhone: "",
    emergencyContact: { name: "", role: "", phone: "" },
    serviceQuality: { groupSize: "", duration: "", difficulty: "", ageGroups: [], medical: "" },
    bankAccounts: [],
    // Onboarding documents (files or {url,isUrl})
    idProof: null,
    certificates: [],
    previousCertificates: [],
    insurance: [],
    previousInsurance: [],
  });

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData((prevState) => ({
      ...prevState,
      socialMedia: {
        ...prevState.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleGalleryAdd = (file) => {
    setFormData((prevState) => ({
      ...prevState,
      gallery: [...prevState.gallery, file],
    }));
  };

  const handleGalleryRemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      gallery: prevState.gallery.filter((_, i) => i !== index),
    }));
  };

  const handlePreviousGalleryRemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      previousGallery: prevState.previousGallery.filter((_, i) => i !== index),
    }));
  };

  // ── Host reels (uploaded 9:16 videos) ──
  // New reels carry a File (+ object-URL preview); existing reels (edit mode)
  // carry the stored S3 videoUrl. The gallery serves these from our own CDN and
  // autoplays them natively — no Instagram player, no redirect.
  const MAX_REEL_BYTES = 100 * 1024 * 1024; // 100MB per reel (client guard)

  const handleReelAdd = (files) => {
    const list = Array.from(files || []);
    const additions = [];
    for (const file of list) {
      if (!file.type.startsWith("video/")) {
        setReelError("Only video files are allowed for reels.");
        continue;
      }
      if (file.size > MAX_REEL_BYTES) {
        setReelError("Each reel video must be under 100MB.");
        continue;
      }
      additions.push({ file, previewUrl: URL.createObjectURL(file), name: file.name });
    }
    if (additions.length) {
      setFormData((prev) => ({ ...prev, reels: [...(prev.reels || []), ...additions] }));
      setReelError("");
    }
  };

  const handleReelRemove = (index) => {
    setFormData((prev) => {
      const removed = (prev.reels || [])[index];
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return { ...prev, reels: (prev.reels || []).filter((_, i) => i !== index) };
    });
  };

  const handleReelMove = (index, dir) => {
    setFormData((prev) => {
      const reels = [...(prev.reels || [])];
      const target = index + dir;
      if (target < 0 || target >= reels.length) return prev;
      [reels[index], reels[target]] = [reels[target], reels[index]];
      return { ...prev, reels };
    });
  };

  // Convert a comma-separated string into a trimmed, de-duplicated array for
  // free-form multi-value fields (specialties, languages, regions).
  const handleCsvChange = (field, value) => {
    const list = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setFormData((prevState) => ({ ...prevState, [field]: list }));
  };

  // ---- Ask the host (FAQ) row management ----
  const handleFaqChange = (index, key, value) => {
    setFormData((prevState) => {
      const faqs = [...(prevState.faqs || [])];
      faqs[index] = { ...faqs[index], [key]: value };
      return { ...prevState, faqs };
    });
  };
  const handleFaqAdd = () => {
    setFormData((prevState) => ({
      ...prevState,
      faqs: [...(prevState.faqs || []), { question: "", answer: "" }],
    }));
  };
  const handleFaqRemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      faqs: (prevState.faqs || []).filter((_, i) => i !== index),
    }));
  };

  // ---- Verification badge row management ----
  const handleBadgeChange = (index, key, value) => {
    setFormData((prevState) => {
      const verificationBadges = [...(prevState.verificationBadges || [])];
      verificationBadges[index] = { ...verificationBadges[index], [key]: value };
      return { ...prevState, verificationBadges };
    });
  };
  const handleBadgeAdd = () => {
    setFormData((prevState) => ({
      ...prevState,
      verificationBadges: [
        ...(prevState.verificationBadges || []),
        { title: "", subtitle: "", icon: "verified" },
      ],
    }));
  };
  const handleBadgeRemove = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      verificationBadges: (prevState.verificationBadges || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  // Toast handlers
  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Accordion change handler
  const handleAccordionChange = (accordionName) => (event, isExpanded) => {
    setExpandedAccordion(isExpanded ? accordionName : false);
  };

  // Populate form data when in edit mode
  useEffect(() => {
    if (isEditMode && existingHost) {
      // Handle different possible data structures
      const hostData = existingHost.data || existingHost;

      console.log("=== FORM POPULATION DEBUG ===");
      console.log("Is Edit Mode:", isEditMode);
      console.log("Raw Existing Host:", existingHost);
      console.log("Processed Host Data:", hostData);

      setFormData({
        // Basic Information
        hostName: hostData.hostName || "",
        location: hostData.location || "",
        city: hostData.city || "",
        state: hostData.state || "",
        pincode: hostData.pincode || "",
        completeAddress: hostData.completeAddress || "",

        // Business Information
        panNumber: hostData.panNumber || "",
        gstNumber: hostData.gstNumber || "",

        // Bank Account Details
        bankName: hostData.bankName || "",
        accountHolderName: hostData.accountHolderName || "",
        accountNumber: hostData.accountNumber || "",
        ifscCode: hostData.ifscCode || "",

        // Branding - Handle URLs for existing images
        hostTitle: hostData.hostTitle || "",
        tagline: hostData.tagline || "",
        brandingLogo: hostData.brandingLogo
          ? { url: hostData.brandingLogo, isUrl: true }
          : null,
        coverImage: hostData.coverImage
          ? { url: hostData.coverImage, isUrl: true }
          : null,

        // About Information
        hostOverview: hostData.hostOverview || "",
        shortBio: hostData.shortBio || "",
        foundedYear: hostData.foundedYear || "",
        experience: hostData.experience || "",
        hqLocation: hostData.hqLocation || "",
        achievements: hostData.achievements || [],
        gallery: [], // New images will be stored here
        previousGallery: hostData.gallery,
        reels: Array.isArray(hostData.reels)
          ? hostData.reels
              .filter((r) => r && r.videoUrl)
              .map((r) => ({ videoUrl: r.videoUrl, poster: r.poster, sourceUrl: r.sourceUrl }))
          : [],

        // Specialties & Expertise
        specialties: hostData.specialties || [],
        languages: hostData.languages || [],
        faqs: hostData.faqs || [],
        verificationBadges: hostData.verificationBadges || [],

        // Trust & Service Quality - Fix field name mismatch
        isVerified: hostData.isVerified || false,
        tripsHosted: hostData.tripsHosted || 0,
        travellersHosted: hostData.travellersHosted || 0,
        successRate: hostData.successRate || 0,
        responseRate: hostData.responseRate || 0,
        responseTimeLabel: hostData.responseTimeLabel || "",
        regionsHosted: hostData.regionsHosted || [],

        // Contact Information
        phoneNumber: hostData.phoneNumber || "",
        emailAddress: hostData.emailAddress || "",
        whatsapp: hostData.whatsapp || "",
        supportHours: hostData.supportHours || "",

        // Social Media
        socialMedia: {
          facebook: hostData.socialMedia?.facebook || "",
          instagram: hostData.socialMedia?.instagram || "",
          twitter: hostData.socialMedia?.twitter || "",
          website: hostData.socialMedia?.website || "",
        },

        // Document Uploads - Handle documents object structure
        panCard: hostData.documents?.panCard
          ? { url: hostData.documents.panCard, isUrl: true }
          : null,
        gstCertificate: hostData.documents?.gstCertificate
          ? { url: hostData.documents.gstCertificate, isUrl: true }
          : null,
        bankPassbook: hostData.documents?.bankPassbook
          ? { url: hostData.documents.bankPassbook, isUrl: true }
          : null,
        businessLicense: hostData.documents?.businessLicense
          ? { url: hostData.documents.businessLicense, isUrl: true }
          : null,

        // Finance (Admin-only)
        commissionRate: hostData.commissionRate || 0,

        // SEO Information
        seoTitle: hostData.seoTitle || "",
        seoSlug: hostData.seoSlug || "",
        metaDescription: hostData.metaDescription || "",

        // Host Onboarding (self-serve) fields
        displayName: hostData.displayName || "",
        country: hostData.country || "",
        whyHost: hostData.whyHost || "",
        uniqueValue: hostData.uniqueValue || "",
        businessType: hostData.businessType || "",
        altPhone: hostData.altPhone || "",
        emergencyContact: {
          name: hostData.emergencyContact?.name || "",
          role: hostData.emergencyContact?.role || "",
          phone: hostData.emergencyContact?.phone || "",
        },
        serviceQuality: {
          groupSize: hostData.serviceQuality?.groupSize || "",
          duration: hostData.serviceQuality?.duration || "",
          difficulty: hostData.serviceQuality?.difficulty || "",
          ageGroups: hostData.serviceQuality?.ageGroups || [],
          medical: hostData.serviceQuality?.medical || "",
        },
        bankAccounts: hostData.bankAccounts || [],
        idProof: hostData.documents?.idProof
          ? { url: hostData.documents.idProof, isUrl: true }
          : null,
        certificates: [],
        previousCertificates: hostData.documents?.certificates || [],
        insurance: [],
        previousInsurance: hostData.documents?.insurance || [],
      });

      console.log("Form Data Set Successfully");
    }
  }, [isEditMode, existingHost]);

  // ---- Draft auto-save (add mode only) ----
  // On mount, detect an existing draft and offer Continue / Discard.
  useEffect(() => {
    if (isEditMode) return;
    try { if (localStorage.getItem(DRAFT_KEY)) setDraftFound(true); } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  // Debounced save of serialisable fields (File objects can't be persisted).
  useEffect(() => {
    if (isEditMode) return undefined;
    const t = setTimeout(() => {
      try {
        const {
          brandingLogo, coverImage, gallery, panCard, gstCertificate,
          bankPassbook, businessLicense, previousGallery, reels,
          idProof, certificates, insurance, ...serialisable
        } = formData;
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: Date.now(), data: serialisable }));
      } catch { /* quota / serialise errors ignored */ }
    }, 800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, isEditMode]);

  const continueDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.data) setFormData((prev) => ({ ...prev, ...parsed.data }));
    } catch { /* ignore */ }
    setDraftFound(false);
  };
  const discardDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setDraftFound(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set validation attempted flag
    setValidationAttempted(true);

    // Validate required fields - Only Bank Account Details are required
    if (
      !formData.bankName ||
      !formData.accountHolderName ||
      !formData.accountNumber ||
      !formData.ifscCode
    ) {
      // Auto-open the Bank Account Details accordion
      setExpandedAccordion("bankAccountDetails");

      // Scroll to the accordion after a short delay to ensure it's rendered
      setTimeout(() => {
        const accordionElement = document.querySelector(
          '[data-accordion="bankAccountDetails"]'
        );
        if (accordionElement) {
          accordionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      showToast(
        "Please fill in all Bank Account Details fields marked with *",
        "error"
      );
      return;
    }

    const formDataToSend = new FormData();

    // Basic Information
    formDataToSend.append("hostName", formData.hostName);
    formDataToSend.append("completeAddress", formData.completeAddress);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("pincode", formData.pincode);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("state", formData.state);

    // Business Information
    formDataToSend.append("panNumber", formData.panNumber);
    formDataToSend.append("gstNumber", formData.gstNumber);

    // Bank Account Details
    formDataToSend.append("bankName", formData.bankName);
    formDataToSend.append("accountHolderName", formData.accountHolderName);
    formDataToSend.append("accountNumber", formData.accountNumber);
    formDataToSend.append("ifscCode", formData.ifscCode);

    // Branding
    formDataToSend.append("hostTitle", formData.hostTitle);
    formDataToSend.append("tagline", formData.tagline);
    if (formData.brandingLogo && !formData.brandingLogo.isUrl) {
      formDataToSend.append("brandingLogo", formData.brandingLogo);
    }
    if (formData.coverImage && !formData.coverImage.isUrl) {
      formDataToSend.append("coverImage", formData.coverImage);
    }

    // About Information
    formDataToSend.append("hostOverview", formData.hostOverview);
    formDataToSend.append("shortBio", formData.shortBio || "");
    formDataToSend.append("foundedYear", formData.foundedYear);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("hqLocation", formData.hqLocation);
    formDataToSend.append(
      "achievements",
      JSON.stringify(formData.achievements)
    );

    // Specialties & Expertise
    formDataToSend.append("specialties", JSON.stringify(formData.specialties));
    formDataToSend.append("languages", JSON.stringify(formData.languages));
    formDataToSend.append("faqs", JSON.stringify(formData.faqs));
    // Host reels — new videos go up as files (reelVideos), referenced by index;
    // existing reels keep their stored S3 videoUrl. Server rebuilds the array.
    {
      const reelsMeta = [];
      const reelFiles = [];
      (formData.reels || []).forEach((r) => {
        if (r.file) {
          reelsMeta.push({ videoIndex: reelFiles.length });
          reelFiles.push(r.file);
        } else if (r.videoUrl) {
          reelsMeta.push({ videoUrl: r.videoUrl, poster: r.poster, sourceUrl: r.sourceUrl });
        }
      });
      formDataToSend.append("reels", JSON.stringify(reelsMeta));
      reelFiles.forEach((f) => formDataToSend.append("reelVideos", f));
    }
    formDataToSend.append(
      "verificationBadges",
      JSON.stringify(formData.verificationBadges)
    );

    // Trust & Service Quality
    formDataToSend.append("isVerified", formData.isVerified);
    formDataToSend.append("tripsHosted", formData.tripsHosted);
    formDataToSend.append("travellersHosted", formData.travellersHosted);
    formDataToSend.append("successRate", formData.successRate);
    formDataToSend.append("responseRate", formData.responseRate);
    formDataToSend.append("responseTimeLabel", formData.responseTimeLabel);
    formDataToSend.append(
      "regionsHosted",
      JSON.stringify(formData.regionsHosted)
    );

    // Contact Information
    formDataToSend.append("emailAddress", formData.emailAddress);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("whatsapp", formData.whatsapp);
    formDataToSend.append("supportHours", formData.supportHours);

    // Social Media
    formDataToSend.append("socialMedia", JSON.stringify(formData.socialMedia));

    // Document Uploads
    if (formData.panCard && !formData.panCard.isUrl) {
      formDataToSend.append("panCard", formData.panCard);
    }
    if (formData.gstCertificate && !formData.gstCertificate.isUrl) {
      formDataToSend.append("gstCertificate", formData.gstCertificate);
    }
    if (formData.bankPassbook && !formData.bankPassbook.isUrl) {
      formDataToSend.append("bankPassbook", formData.bankPassbook);
    }
    if (formData.businessLicense && !formData.businessLicense.isUrl) {
      formDataToSend.append("businessLicense", formData.businessLicense);
    }

    // Finance (Admin-only)
    formDataToSend.append("commissionRate", formData.commissionRate);

    // SEO Information
    formDataToSend.append("seoTitle", formData.seoTitle);
    formDataToSend.append("seoSlug", formData.seoSlug);
    formDataToSend.append("metaDescription", formData.metaDescription);

    // Host Onboarding (self-serve) fields
    formDataToSend.append("displayName", formData.displayName || "");
    formDataToSend.append("country", formData.country || "");
    formDataToSend.append("whyHost", formData.whyHost || "");
    formDataToSend.append("uniqueValue", formData.uniqueValue || "");
    formDataToSend.append("businessType", formData.businessType || "");
    formDataToSend.append("altPhone", formData.altPhone || "");
    formDataToSend.append("emergencyContact", JSON.stringify(formData.emergencyContact || {}));
    formDataToSend.append("serviceQuality", JSON.stringify(formData.serviceQuality || {}));
    formDataToSend.append("bankAccounts", JSON.stringify(formData.bankAccounts || []));
    // Onboarding documents
    if (formData.idProof && !formData.idProof.isUrl) {
      formDataToSend.append("idProof", formData.idProof);
    }
    (formData.certificates || []).forEach((f) => formDataToSend.append("certificates", f));
    (formData.insurance || []).forEach((f) => formDataToSend.append("insurance", f));

    // Handle gallery images - send previous URLs and new files
    const previousGalleryUrls = formData.previousGallery; // These are already URLs
    const newGalleryFiles = formData.gallery; // These are already files

    formDataToSend.append(
      "previousGallery",
      JSON.stringify(previousGalleryUrls)
    );

    // Add new gallery files
    newGalleryFiles.forEach((file) => {
      formDataToSend.append(`gallery`, file);
    });

    try {
      if (isEditMode) {
        console.log("Calling updateHost API with ID:", id);
        const result = await updateHost({ id, formDataToSend }).unwrap();
        console.log("Update successful:", result);
        showToast("Host updated successfully!", "success");
      } else {
        console.log("Calling createHost API");
        const result = await createHost(formDataToSend).unwrap();
        console.log("Create successful:", result);
        showToast("Host created successfully!", "success");
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      }

      // Wait for toast to be visible before navigating
      setTimeout(() => {
        navigate("/hosts");
      }, 2000);
    } catch (err) {
      console.error("Error saving host:", err);
      showToast("Error saving host. Please try again.", "error");
    }
  };

  const inputStyle = {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      background: "#fff",
      "& fieldset": {
        border: "1px solid #E7E7E7",
      },
      "&:hover fieldset": {
        border: "1px solid #EC3F18",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #EC3F18",
      },
      color: "#000",
      height: "45px",
      borderRadius: "8px",
      fontFamily: "Ubuntu",
    },
  };

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

  // Show loading state while fetching host data in edit mode
  if (isEditMode && isLoadingHost) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <Typography>Loading host data...</Typography>
      </Box>
    );
  }

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
      <form onSubmit={handleSubmit}>
        <Container maxWidth="lg" sx={{ width: "100%" }}>
          {/* Draft restore banner (add mode) */}
          {draftFound && !isEditMode && (
            <Box
              sx={{
                mt: 2, mb: 1, p: 2, borderRadius: "8px",
                background: "#FFF7ED", border: "1px solid #FED7AA",
                display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap",
              }}
            >
              <Typography sx={{ flex: 1, minWidth: 220, color: "#7C2D12", fontSize: "14px" }}>
                Unsaved draft found from a previous session. Uploaded files aren&apos;t restored — please re-attach documents/images.
              </Typography>
              <Button size="small" variant="contained" onClick={continueDraft}
                sx={{ background: "#EC3F18", textTransform: "none", "&:hover": { background: "#c4472c" } }}>
                Continue Draft
              </Button>
              <Button size="small" variant="outlined" onClick={discardDraft}
                sx={{ color: "#7C2D12", borderColor: "#FED7AA", textTransform: "none" }}>
                Discard Draft
              </Button>
            </Box>
          )}
          {/* Page Title */}
          <Box sx={{ mb: 3, pt: 2 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#393938",
                textAlign: "center",
              }}
            >
              {isEditMode ? "Edit Host" : "Add New Host"}
            </Typography>
          </Box>
          {/* Basic Information Section */}
          <Accordion defaultExpanded sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Basic Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Host Name
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="hostName"
                    placeholder="Enter host name"
                    value={formData.hostName}
                    onChange={(e) => handleChange("hostName", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Location
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>City</Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    State
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Pincode
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="pincode"
                    placeholder="Enter pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Complete Address
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="completeAddress"
                    placeholder="Enter complete address"
                    value={formData.completeAddress}
                    onChange={(e) =>
                      handleChange("completeAddress", e.target.value)
                    }
                    multiline
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Business Information Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Business Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    PAN Number
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="panNumber"
                    placeholder="Enter PAN number"
                    value={formData.panNumber}
                    onChange={(e) => handleChange("panNumber", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    GST Number
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="gstNumber"
                    placeholder="Enter GST number"
                    value={formData.gstNumber}
                    onChange={(e) => handleChange("gstNumber", e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Bank Account Details Section */}
          <Accordion
            data-accordion="bankAccountDetails"
            expanded={expandedAccordion === "bankAccountDetails"}
            onChange={handleAccordionChange("bankAccountDetails")}
            sx={{ mb: 2, ...accordionStyle }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
                >
                  Bank Account Details
                </Typography>
                {validationAttempted &&
                  (!formData.bankName ||
                    !formData.accountHolderName ||
                    !formData.accountNumber ||
                    !formData.ifscCode) && (
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
                (!formData.bankName ||
                  !formData.accountHolderName ||
                  !formData.accountNumber ||
                  !formData.ifscCode) && (
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
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Bank Name*
                  </Typography>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        border: "1px solid #E7E7E7",
                      },
                    }}
                    size="small"
                    name="bankName"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    error={validationAttempted && !formData.bankName}
                    helperText={
                      validationAttempted && !formData.bankName
                        ? "Bank Name is required"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Account Holder Name*
                  </Typography>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        border: "1px solid #E7E7E7",
                      },
                    }}
                    size="small"
                    name="accountHolderName"
                    placeholder="Enter account holder name"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      handleChange("accountHolderName", e.target.value)
                    }
                    error={validationAttempted && !formData.accountHolderName}
                    helperText={
                      validationAttempted && !formData.accountHolderName
                        ? "Account Holder Name is required"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Account Number*
                  </Typography>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        border: "1px solid #E7E7E7",
                      },
                    }}
                    size="small"
                    name="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      handleChange("accountNumber", e.target.value)
                    }
                    error={validationAttempted && !formData.accountNumber}
                    helperText={
                      validationAttempted && !formData.accountNumber
                        ? "Account Number is required"
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    IFSC Code*
                  </Typography>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        border: "1px solid #E7E7E7",
                      },
                    }}
                    size="small"
                    name="ifscCode"
                    placeholder="Enter IFSC code"
                    value={formData.ifscCode}
                    onChange={(e) => handleChange("ifscCode", e.target.value)}
                    error={validationAttempted && !formData.ifscCode}
                    helperText={
                      validationAttempted && !formData.ifscCode
                        ? "IFSC Code is required"
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Branding Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Branding
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Host Title
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="hostTitle"
                    placeholder="Enter host title"
                    value={formData.hostTitle}
                    onChange={(e) => handleChange("hostTitle", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Tagline
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="tagline"
                    placeholder="Enter short tagline..."
                    value={formData.tagline}
                    onChange={(e) => handleChange("tagline", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Logo</Typography>
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
                    }}
                  >
                    {formData.brandingLogo ? (
                      <img
                        src={
                          formData.brandingLogo.isUrl
                            ? formData.brandingLogo.url
                            : URL.createObjectURL(formData.brandingLogo)
                        }
                        alt="Logo preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        MX
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("brandingLogo", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Cover Upload
                  </Typography>
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
                    }}
                  >
                    {formData.coverImage ? (
                      <img
                        src={
                          formData.coverImage.isUrl
                            ? formData.coverImage.url
                            : URL.createObjectURL(formData.coverImage)
                        }
                        alt="Cover preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        Cover Image
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("coverImage", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* About Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                About
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Short Bio (card description for Meet Our Hosts) */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Short Bio (card description)
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    fullWidth
                    name="shortBio"
                    placeholder="One-line description shown on the Meet Our Hosts card (optional)"
                    value={formData.shortBio}
                    onChange={(e) => handleChange("shortBio", e.target.value)}
                  />
                </Grid>
                {/* Host Overview */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Host Overview
                  </Typography>
                  <TextField
                    sx={{
                      ...inputStyle,
                      "& .MuiOutlinedInput-root": {
                        ...inputStyle["& .MuiOutlinedInput-root"],
                        height: "auto",
                        minHeight: "120px",
                      },
                    }}
                    size="small"
                    name="hostOverview"
                    placeholder="Enter host overview here..."
                    value={formData.hostOverview}
                    onChange={(e) =>
                      handleChange("hostOverview", e.target.value)
                    }
                    multiline
                    rows={4}
                  />
                </Grid>

                {/* Founded Year, Experience, and HQ Location in one row */}
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Founded Year
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={formData.foundedYear}
                      onChange={(e) =>
                        handleChange("foundedYear", e.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          background: "#fff",
                          "& fieldset": {
                            border: "1px solid #E7E7E7",
                          },
                          "&:hover fieldset": {
                            border: "1px solid #EC3F18",
                          },
                          "&.Mui-focused fieldset": {
                            border: "1px solid #EC3F18",
                          },
                          color: "#000",
                          height: "45px",
                          borderRadius: "8px",
                          fontFamily: "Ubuntu",
                        },
                        "& .MuiSelect-select": {
                          padding: "12px 14px",
                          fontSize: "14px",
                          color: "#000",
                        },
                        "& .MuiSelect-icon": {
                          color: "#EC3F18 !important",
                        },
                        "& .MuiSelect-select.Mui-disabled": {
                          color: "#737373",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      displayEmpty
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,
                            border: "1px solid #E7E7E7",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                            backgroundColor: "#fff",
                            "& .MuiMenuItem-root": {
                              fontSize: "14px",
                              fontFamily: "Ubuntu",
                              color: "#000",
                              "&:hover": {
                                backgroundColor: "#fff5f5",
                                color: "#EC3F18",
                              },
                              "&.Mui-selected": {
                                backgroundColor: "#EC3F18 !important",
                                color: "white !important",
                                "&:hover": {
                                  backgroundColor: "#EC3F18 !important",
                                  color: "white !important",
                                },
                              },
                              "&.Mui-disabled": {
                                color: "#737373",
                                backgroundColor: "#f5f5f5",
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select year
                      </MenuItem>
                      {Array.from({ length: 30 }, (_, i) => 2024 - i).map(
                        (year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Experience
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    placeholder="Enter experience"
                    value={formData.experience}
                    onChange={(e) => handleChange("experience", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    HQ Location
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    placeholder="Enter HQ Location"
                    value={formData.hqLocation}
                    onChange={(e) => handleChange("hqLocation", e.target.value)}
                  />
                </Grid>

                {/* Achievements */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Achievements
                  </Typography>
                  <TextField
                    fullWidth
                    sx={inputStyle}
                    size="small"
                    name="achievements"
                    placeholder="e.g. Wilderness First-Aid, UIMLA Mountain Leader, Top-rated 2025"
                    value={
                      Array.isArray(formData.achievements)
                        ? formData.achievements.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      handleCsvChange("achievements", e.target.value)
                    }
                  />
                  {Array.isArray(formData.achievements) &&
                    formData.achievements.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                        {formData.achievements.map((a) => (
                          <Chip
                            key={a}
                            label={a}
                            onDelete={() =>
                              setFormData((prev) => ({
                                ...prev,
                                achievements: prev.achievements.filter(
                                  (x) => x !== a
                                ),
                              }))
                            }
                            sx={{ backgroundColor: "#FDF3EE", color: "#393938" }}
                          />
                        ))}
                      </Box>
                    )}
                  <Typography sx={{ color: "#9b9b9b", fontSize: "12px", mt: 1 }}>
                    Comma separated. Shown as certification badges on the host
                    page (when no custom verification badges are set).
                  </Typography>
                </Grid>

                {/* Gallery */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Gallery
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}
                  >
                    {/* Display previous gallery images (URLs) */}
                    {formData.previousGallery.map((image, index) => (
                      <Box
                        key={`previous-${index}`}
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
                          src={image}
                          alt={`Previous Gallery ${index + 1}`}
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
                          onClick={() => handlePreviousGalleryRemove(index)}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}

                    {/* Display new gallery images (files) */}
                    {formData.gallery.map((image, index) => (
                      <Box
                        key={`new-${index}`}
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
                          src={URL.createObjectURL(image)}
                          alt={`New Gallery ${index + 1}`}
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
                          onClick={() => handleGalleryRemove(index)}
                        >
                          ×
                        </Button>
                      </Box>
                    ))}
                  </Box>
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
                      onChange={(e) => {
                        Array.from(e.target.files).forEach((file) =>
                          handleGalleryAdd(file)
                        );
                      }}
                    />
                  </Button>
                </Grid>

                {/* Reels Gallery (uploaded 9:16 videos) */}
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 0.5 }}>
                    Reels Gallery
                  </Typography>
                  <Typography
                    sx={{ color: "#9b9b9b", fontSize: "12px", mb: 1.5 }}
                  >
                    Upload short vertical (9:16) videos for this host&apos;s
                    gallery. They are stored on Nomadic Townies and autoplay
                    muted in the gallery — no Instagram player or redirect. Max
                    100MB per video.
                  </Typography>

                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      backgroundColor: "#CF4A2C",
                      "&:hover": { backgroundColor: "#B83F23" },
                      textTransform: "none",
                    }}
                  >
                    + Add Reel Video
                    <input
                      type="file"
                      hidden
                      accept="video/mp4,video/quicktime,video/webm,video/*"
                      multiple
                      onChange={(e) => {
                        handleReelAdd(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </Button>
                  {reelError && (
                    <Typography sx={{ color: "#CF4A2C", fontSize: "12px", mt: 1 }}>
                      {reelError}
                    </Typography>
                  )}

                  {(formData.reels || []).length > 0 && (
                    <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {(formData.reels || []).map((reel, index) => {
                        const src = reel.previewUrl || reel.videoUrl;
                        return (
                          <Box
                            key={reel.videoUrl || reel.previewUrl || index}
                            sx={{
                              width: 132,
                              border: "1px solid #eee",
                              borderRadius: "10px",
                              overflow: "hidden",
                              backgroundColor: "#FAFAFA",
                            }}
                          >
                            <Box sx={{ position: "relative", background: "#000" }}>
                              <video
                                src={src}
                                muted
                                playsInline
                                preload="metadata"
                                style={{
                                  width: "100%",
                                  aspectRatio: "9 / 16",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  left: 4,
                                  fontSize: "10px",
                                  fontWeight: 700,
                                  color: "#fff",
                                  background: "rgba(0,0,0,.5)",
                                  borderRadius: "4px",
                                  px: 0.6,
                                  py: 0.2,
                                }}
                              >
                                {index + 1} · 9:16
                              </Box>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", p: 0.5 }}>
                              <Button
                                size="small"
                                disabled={index === 0}
                                onClick={() => handleReelMove(index, -1)}
                                sx={{ minWidth: 28, color: "#737373" }}
                              >
                                ↑
                              </Button>
                              <Button
                                size="small"
                                disabled={index === (formData.reels || []).length - 1}
                                onClick={() => handleReelMove(index, 1)}
                                sx={{ minWidth: 28, color: "#737373" }}
                              >
                                ↓
                              </Button>
                              <Button
                                size="small"
                                onClick={() => handleReelRemove(index)}
                                sx={{ minWidth: 28, color: "#CF4A2C" }}
                              >
                                ✕
                              </Button>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Specialties & Expertise Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Specialties & Expertise
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Specialties / Expertise (comma separated)
                  </Typography>
                  <TextField
                    fullWidth
                    sx={inputStyle}
                    size="small"
                    name="specialties"
                    placeholder="e.g. Trekking & guiding, Homestays, Photography walks"
                    value={
                      Array.isArray(formData.specialties)
                        ? formData.specialties.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      handleCsvChange("specialties", e.target.value)
                    }
                  />
                  {Array.isArray(formData.specialties) &&
                    formData.specialties.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                        {formData.specialties.map((s) => (
                          <Chip
                            key={s}
                            label={s}
                            onDelete={() =>
                              setFormData((prev) => ({
                                ...prev,
                                specialties: prev.specialties.filter(
                                  (x) => x !== s
                                ),
                              }))
                            }
                            sx={{ backgroundColor: "#FDF3EE", color: "#393938" }}
                          />
                        ))}
                      </Box>
                    )}
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Languages (comma separated)
                  </Typography>
                  <TextField
                    fullWidth
                    sx={inputStyle}
                    size="small"
                    name="languages"
                    placeholder="e.g. English, Nepali, Hindi, Tibetan"
                    value={
                      Array.isArray(formData.languages)
                        ? formData.languages.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      handleCsvChange("languages", e.target.value)
                    }
                  />
                  {Array.isArray(formData.languages) &&
                    formData.languages.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1.5 }}>
                        {formData.languages.map((l) => (
                          <Chip
                            key={l}
                            label={l}
                            onDelete={() =>
                              setFormData((prev) => ({
                                ...prev,
                                languages: prev.languages.filter(
                                  (x) => x !== l
                                ),
                              }))
                            }
                            sx={{ backgroundColor: "#FDF3EE", color: "#393938" }}
                          />
                        ))}
                      </Box>
                    )}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Ask the Host (FAQ) Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Ask the Host (FAQ)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "#737373", mb: 2, fontSize: "13px" }}>
                Add common questions travellers ask, with the host&apos;s answer.
                These appear in the &quot;Ask the host&quot; section of the host
                detail page. Leave empty to show generic defaults.
              </Typography>
              {(formData.faqs || []).map((faq, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #E7E7E7",
                    borderRadius: "8px",
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#393938", fontWeight: 600 }}>
                      Question {index + 1}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleFaqRemove(index)}
                      sx={{ color: "#EC3F18", textTransform: "none" }}
                    >
                      Remove
                    </Button>
                  </Box>
                  <TextField
                    fullWidth
                    sx={{ ...inputStyle, mb: 1.5 }}
                    size="small"
                    placeholder="Question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    sx={inputStyle}
                    size="small"
                    placeholder="Answer"
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                  />
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={handleFaqAdd}
                sx={{
                  border: "1px solid #E7E7E7",
                  color: "#737373",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                + Add Question
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Verification Badges Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Verification Badges
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography sx={{ color: "#737373", mb: 2, fontSize: "13px" }}>
                Add trust badges shown in the &quot;Verification &amp; badges&quot;
                section of the host detail page. Leave empty to auto-generate
                badges from Verified status, Achievements and rebook rate.
              </Typography>
              {(formData.verificationBadges || []).map((badge, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #E7E7E7",
                    borderRadius: "8px",
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#393938", fontWeight: 600 }}>
                      Badge {index + 1}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => handleBadgeRemove(index)}
                      sx={{ color: "#EC3F18", textTransform: "none" }}
                    >
                      Remove
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        sx={inputStyle}
                        size="small"
                        placeholder="Title (e.g. ID verified)"
                        value={badge.title || ""}
                        onChange={(e) =>
                          handleBadgeChange(index, "title", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <Select
                          sx={{
                            ...inputStyle,
                            // The selected value renders in .MuiSelect-select,
                            // which doesn't inherit the root color — force dark
                            // text so the chosen badge is readable (was white).
                            "& .MuiSelect-select": { color: "#1F2937", fontFamily: "Ubuntu" },
                            "& .MuiSelect-icon": { color: "#EC3F18" },
                          }}
                          value={badge.icon || "verified"}
                          onChange={(e) =>
                            handleBadgeChange(index, "icon", e.target.value)
                          }
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                bgcolor: "#fff",
                                "& .MuiMenuItem-root": { color: "#1F2937" },
                                "& .MuiMenuItem-root:hover": { bgcolor: "#F3EDE3", color: "#EC3F18" },
                                "& .MuiMenuItem-root.Mui-selected": { bgcolor: "#FDE7E0", color: "#EC3F18" },
                                "& .MuiMenuItem-root.Mui-selected:hover": { bgcolor: "#FBD9CE", color: "#EC3F18" },
                              },
                            },
                          }}
                        >
                          {BADGE_ICON_OPTIONS.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        sx={inputStyle}
                        size="small"
                        placeholder="Subtitle (e.g. Government ID confirmed)"
                        value={badge.subtitle || ""}
                        onChange={(e) =>
                          handleBadgeChange(index, "subtitle", e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                size="small"
                onClick={handleBadgeAdd}
                sx={{
                  border: "1px solid #E7E7E7",
                  color: "#737373",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                + Add Badge
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Trust & Service Quality Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Trust & Service Quality
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* First Row - Verified Only */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#737373", mr: 8 }}>
                      Verified
                    </Typography>
                    <Switch
                      checked={formData.isVerified}
                      onChange={(e) =>
                        handleChange("isVerified", e.target.checked)
                      }
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#EC3F18",
                          "&:hover": {
                            backgroundColor: "rgba(236, 63, 24, 0.08)",
                          },
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#EC3F18",
                          },
                      }}
                    />
                  </Box>
                </Grid>

                {/* Second Row - Licenses and Rating Avg */}
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Trips Hosted
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="tripsHosted"
                    type="number"
                    placeholder="0"
                    value={formData.tripsHosted}
                    onChange={(e) =>
                      handleChange("tripsHosted", e.target.value)
                    }
                    inputProps={{ min: 0, step: 0 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Travellers Hosted
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="travellersHosted"
                    type="number"
                    placeholder="0"
                    value={formData.travellersHosted}
                    onChange={(e) => handleChange("travellersHosted", e.target.value)}
                    inputProps={{ min: 0, step: 0 }}
                  />
                </Grid>

                {/* Third Row - Rating Count and Response Time Label */}
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Success Rate
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="successRate"
                    type="number"
                    placeholder="0"
                    value={formData.successRate}
                    onChange={(e) =>
                      handleChange("successRate", e.target.value)
                    }
                    inputProps={{ min: 0, step: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Response Time Label
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="responseTimeLabel"
                    placeholder="Enter label..."
                    value={formData.responseTimeLabel}
                    onChange={(e) =>
                      handleChange("responseTimeLabel", e.target.value)
                    }
                  />
                </Grid>

                {/* Fourth Row - Response Rate and Regions Hosted */}
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Response Rate (%)
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="responseRate"
                    type="number"
                    placeholder="0"
                    value={formData.responseRate}
                    onChange={(e) =>
                      handleChange("responseRate", e.target.value)
                    }
                    inputProps={{ min: 0, max: 100, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Regions Hosted (comma separated)
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="regionsHosted"
                    placeholder="e.g. Annapurna, Everest, Mustang"
                    value={
                      Array.isArray(formData.regionsHosted)
                        ? formData.regionsHosted.join(", ")
                        : ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "regionsHosted",
                        e.target.value
                          .split(",")
                          .map((r) => r.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Contact Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Contact
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Email
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="emailAddress"
                    type="email"
                    placeholder="support@example.com"
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleChange("emailAddress", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Phone
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="phoneNumber"
                    placeholder="(#91)"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleChange("phoneNumber", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    WhatsApp
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="contactWhatsapp"
                    placeholder="Enter link..."
                    value={formData.whatsapp}
                    onChange={(e) => handleChange("whatsapp", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Support Hours
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="supportHours"
                    placeholder="Enter hours..."
                    value={formData.supportHours}
                    onChange={(e) =>
                      handleChange("supportHours", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Social Media Section — disabled per request (P3). Code kept, not rendered. */}
          {false && (
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Social Media (Optional)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Facebook
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="facebook"
                    placeholder="Enter Facebook profile URL"
                    value={formData.socialMedia.facebook}
                    onChange={(e) =>
                      handleSocialMediaChange("facebook", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Instagram
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="instagram"
                    placeholder="Enter Instagram profile URL"
                    value={formData.socialMedia.instagram}
                    onChange={(e) =>
                      handleSocialMediaChange("instagram", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Twitter
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="twitter"
                    placeholder="Enter Twitter profile URL"
                    value={formData.socialMedia.twitter}
                    onChange={(e) =>
                      handleSocialMediaChange("twitter", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Website
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="website"
                    placeholder="Enter Website URL"
                    value={formData.socialMedia.website}
                    onChange={(e) =>
                      handleSocialMediaChange("website", e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          )}

          {/* Document Uploads Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Document Uploads
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    PAN Card
                  </Typography>
                  <Box
                    sx={{
                      width: "250px",
                      height: "120px",
                      border: "2px dashed #E7E7E7",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      background: "#f5f5f5",
                      overflow: "hidden",
                    }}
                  >
                    {formData.panCard ? (
                      <img
                        src={
                          formData.panCard.isUrl
                            ? formData.panCard.url
                            : URL.createObjectURL(formData.panCard)
                        }
                        alt="PAN Card preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        PAN Card
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("panCard", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    GST Certificate
                  </Typography>

                  <Box
                    sx={{
                      width: "250px",
                      height: "120px",
                      border: "2px dashed #E7E7E7",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      background: "#f5f5f5",
                      overflow: "hidden",
                    }}
                  >
                    {formData.gstCertificate ? (
                      <img
                        src={
                          formData.gstCertificate.isUrl
                            ? formData.gstCertificate.url
                            : URL.createObjectURL(formData.gstCertificate)
                        }
                        alt="GST Certificate preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        GST Certificate
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("gstCertificate", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Bank Passbook
                  </Typography>
                  <Box
                    sx={{
                      width: "250px",
                      height: "120px",
                      border: "2px dashed #E7E7E7",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      background: "#f5f5f5",
                      overflow: "hidden",
                    }}
                  >
                    {formData.bankPassbook ? (
                      <img
                        src={
                          formData.bankPassbook.isUrl
                            ? formData.bankPassbook.url
                            : URL.createObjectURL(formData.bankPassbook)
                        }
                        alt="Bank Passbook preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        Bank Passbook
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("bankPassbook", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Business License
                  </Typography>

                  <Box
                    sx={{
                      width: "250px",
                      height: "120px",
                      border: "2px dashed #E7E7E7",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                      background: "#f5f5f5",
                      overflow: "hidden",
                    }}
                  >
                    {formData.businessLicense ? (
                      <img
                        src={
                          formData.businessLicense.isUrl
                            ? formData.businessLicense.url
                            : URL.createObjectURL(formData.businessLicense)
                        }
                        alt="Business License preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <Typography sx={{ color: "#737373", fontSize: "12px" }}>
                        Business License
                      </Typography>
                    )}
                  </Box>
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
                    Change
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleChange("businessLicense", e.target.files[0])
                      }
                    />
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Host Onboarding (self-serve) Section — populated when a host
              completes the onboarding portal; all fields optional/editable. */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Host Onboarding Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Display Name</Typography>
                  <TextField sx={inputStyle} size="small" placeholder="Public-facing name"
                    value={formData.displayName}
                    onChange={(e) => handleChange("displayName", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Country</Typography>
                  <TextField sx={inputStyle} size="small" placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Business Type</Typography>
                  <TextField sx={inputStyle} size="small" placeholder="Individual / Pvt Ltd / LLP"
                    value={formData.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Why they host</Typography>
                  <TextField sx={inputStyle} size="small" multiline placeholder="Motivation"
                    value={formData.whyHost}
                    onChange={(e) => handleChange("whyHost", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>What makes them unique</Typography>
                  <TextField sx={inputStyle} size="small" multiline placeholder="Unique value"
                    value={formData.uniqueValue}
                    onChange={(e) => handleChange("uniqueValue", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Alternate Phone</Typography>
                  <TextField sx={inputStyle} size="small" placeholder="Alternate / emergency phone"
                    value={formData.altPhone}
                    onChange={(e) => handleChange("altPhone", e.target.value)} />
                </Grid>

                {/* Emergency contact */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: "#393938", mt: 1 }}>Emergency Contact</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Contact Name</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.emergencyContact.name}
                    onChange={(e) => handleChange("emergencyContact", { ...formData.emergencyContact, name: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Role</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.emergencyContact.role}
                    onChange={(e) => handleChange("emergencyContact", { ...formData.emergencyContact, role: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Emergency preparedness / phone</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.emergencyContact.phone}
                    onChange={(e) => handleChange("emergencyContact", { ...formData.emergencyContact, phone: e.target.value })} />
                </Grid>

                {/* Service quality */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: "#393938", mt: 1 }}>Service Quality</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Max Group Size</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.serviceQuality.groupSize}
                    onChange={(e) => handleChange("serviceQuality", { ...formData.serviceQuality, groupSize: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Typical Duration</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.serviceQuality.duration}
                    onChange={(e) => handleChange("serviceQuality", { ...formData.serviceQuality, duration: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Difficulty Levels</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.serviceQuality.difficulty}
                    onChange={(e) => handleChange("serviceQuality", { ...formData.serviceQuality, difficulty: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Age Groups (comma-separated)</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={(formData.serviceQuality.ageGroups || []).join(", ")}
                    onChange={(e) => handleChange("serviceQuality", { ...formData.serviceQuality, ageGroups: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>First-aid on trips?</Typography>
                  <TextField sx={inputStyle} size="small"
                    value={formData.serviceQuality.medical}
                    onChange={(e) => handleChange("serviceQuality", { ...formData.serviceQuality, medical: e.target.value })} />
                </Grid>

                {/* Extra onboarding documents */}
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: 600, color: "#393938", mt: 1 }}>Additional Documents</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    ID Proof (Aadhaar / Passport)
                    {formData.idProof?.isUrl ? " — uploaded ✓" : ""}
                  </Typography>
                  <Button component="label" variant="outlined" size="small"
                    sx={{ border: "1px solid #E7E7E7", color: "#737373", borderRadius: "8px", textTransform: "none" }}>
                    {formData.idProof && !formData.idProof.isUrl ? formData.idProof.name : "Upload"}
                    <input type="file" hidden accept="image/*,application/pdf"
                      onChange={(e) => handleChange("idProof", e.target.files[0])} />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Certifications & Licenses
                    {formData.previousCertificates?.length ? ` (${formData.previousCertificates.length} on file)` : ""}
                  </Typography>
                  <Button component="label" variant="outlined" size="small"
                    sx={{ border: "1px solid #E7E7E7", color: "#737373", borderRadius: "8px", textTransform: "none" }}>
                    {formData.certificates?.length ? `${formData.certificates.length} selected` : "Upload (replaces)"}
                    <input type="file" hidden multiple accept="image/*,application/pdf"
                      onChange={(e) => handleChange("certificates", Array.from(e.target.files))} />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Insurance Documents
                    {formData.previousInsurance?.length ? ` (${formData.previousInsurance.length} on file)` : ""}
                  </Typography>
                  <Button component="label" variant="outlined" size="small"
                    sx={{ border: "1px solid #E7E7E7", color: "#737373", borderRadius: "8px", textTransform: "none" }}>
                    {formData.insurance?.length ? `${formData.insurance.length} selected` : "Upload (replaces)"}
                    <input type="file" hidden multiple accept="image/*,application/pdf"
                      onChange={(e) => handleChange("insurance", Array.from(e.target.files))} />
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Finance (Admin-only) Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                Finance{" "}
                <span style={{ fontWeight: 400, color: "#737373" }}>
                  (Admin-only)
                </span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/*Commission Rate */}
                <Grid item xs={12} sm={6} md={4}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Commission Rate
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      sx={{
                        ...inputStyle,
                        "& .MuiOutlinedInput-root": {
                          ...inputStyle["& .MuiOutlinedInput-root"],
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                      size="small"
                      name="commissionRate"
                      type="number"
                      placeholder="0"
                      value={formData.commissionRate}
                      onChange={(e) =>
                        handleChange("commissionRate", e.target.value)
                      }
                      inputProps={{ min: 0, step: 0.1 }}
                    />
                    <Box
                      sx={{
                        height: "45px",
                        border: "1px solid #E7E7E7",
                        borderLeft: "none",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        backgroundColor: "#f5f5f5",
                        color: "#737373",
                        fontFamily: "Ubuntu",
                      }}
                    >
                      %
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* SEO Section */}
          <Accordion sx={{ mb: 2, ...accordionStyle }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}
              >
                SEO
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    SEO Title
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoTitle"
                    placeholder="Enter SEO title"
                    value={formData.seoTitle}
                    onChange={(e) => handleChange("seoTitle", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>Slug</Typography>

                  <TextField
                    sx={inputStyle}
                    size="small"
                    name="seoSlug"
                    placeholder="Enter slug"
                    value={formData.seoSlug}
                    onChange={(e) => handleChange("seoSlug", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: "#737373", mb: 1 }}>
                    Meta Description
                  </Typography>

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
                    placeholder="Enter meta description"
                    value={formData.metaDescription}
                    onChange={(e) =>
                      handleChange("metaDescription", e.target.value)
                    }
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Submit Buttons */}
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
              onClick={() => navigate(-1)}
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
              disabled={isLoading}
              sx={{
                color: "#fff",
                background: "#EC3F18",
                borderRadius: "32px",
                width: "140px",
                "&:hover": {
                  background: "#EC3F18",
                },
                "&:disabled": {
                  background: "#ccc",
                  color: "#666",
                },
              }}
            >
              {isLoading
                ? "Saving..."
                : isEditMode
                ? "Update Host"
                : "Add Host"}
            </Button>
          </Box>
        </Container>
      </form>

      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default AddHost;
