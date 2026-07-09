import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetReviewsByHostIdQuery,
  useAddHostReviewMutation,
  useDeleteHostReviewMutation,
} from "../../Redux/services/reviewApi";
import { useGetHostByIdQuery } from "../../Redux/services/hostsApi";

const inputStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": { borderColor: "#E7E7E7" },
    "&:hover fieldset": { borderColor: "#EC3F18" },
    "&.Mui-focused fieldset": { borderColor: "#EC3F18" },
  },
};

const emptyForm = {
  name: "",
  rating: 5,
  review: "",
  location: "",
  tripName: "",
  profileImage: "",
  source: "manual",
};

// Admin manager for a single host's reviews. These are entity-scoped host
// reviews (UserReviews) — completely separate from Nomadic Townies brand
// reviews, which are managed on the Reviews page.
const HostReviews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: hostRes } = useGetHostByIdQuery(id, { skip: !id });
  const { data, isLoading, isFetching } = useGetReviewsByHostIdQuery(id, {
    skip: !id,
  });
  const [addHostReview, { isLoading: adding }] = useAddHostReviewMutation();
  const [deleteHostReview] = useDeleteHostReviewMutation();

  const host = hostRes?.data || hostRes || {};
  const hostName = host?.hostTitle || host?.hostName || "Host";

  const reviews = useMemo(() => {
    const r = data?.data ?? data ?? [];
    return Array.isArray(r) ? r : [];
  }, [data]);

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.review.trim()) {
      setError("Name and review are required.");
      return;
    }
    try {
      await addHostReview({
        hostId: id,
        name: form.name,
        rating: Number(form.rating) || 5,
        review: form.review,
        location: form.location,
        tripName: form.tripName,
        profileImage: form.profileImage || null,
        source: form.source, // "manual" or "google"
        date: new Date().toISOString(),
      }).unwrap();
      setForm(emptyForm);
    } catch {
      setError("Could not add the review. Please try again.");
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteHostReview(reviewId).unwrap();
    } catch {
      /* no-op; list stays as-is on failure */
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <IconButton onClick={() => navigate("/hosts")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#393938" }}>
          Reviews — {hostName}
        </Typography>
      </Box>
      <Typography sx={{ color: "#737373", fontSize: "13px", mb: 3 }}>
        Host reviews are dedicated to this host and never shown on Nomadic
        Townies brand sections. Add manual reviews, or paste a Google review
        (set source to &quot;google&quot;).
      </Typography>

      {/* Add review form */}
      <Box
        component="form"
        onSubmit={handleAdd}
        sx={{
          border: "1px solid #E7E7E7",
          borderRadius: "10px",
          p: 2.5,
          mb: 3,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#393938", mb: 2 }}>
          Add a review
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Reviewer name *
            </Typography>
            <TextField
              fullWidth
              size="small"
              sx={inputStyle}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Location
            </Typography>
            <TextField
              fullWidth
              size="small"
              sx={inputStyle}
              placeholder="e.g. Pokhara, Nepal"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Trip (optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              sx={inputStyle}
              value={form.tripName}
              onChange={(e) => setField("tripName", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Profile photo URL (optional)
            </Typography>
            <TextField
              fullWidth
              size="small"
              sx={inputStyle}
              value={form.profileImage}
              onChange={(e) => setField("profileImage", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Rating
            </Typography>
            <Rating
              value={Number(form.rating)}
              onChange={(_, v) => setField("rating", v || 1)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Source
            </Typography>
            <Select
              fullWidth
              size="small"
              sx={inputStyle}
              value={form.source}
              onChange={(e) => setField("source", e.target.value)}
            >
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="google">Google</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography sx={{ color: "#737373", mb: 0.5, fontSize: "14px" }}>
              Review *
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              size="small"
              sx={inputStyle}
              value={form.review}
              onChange={(e) => setField("review", e.target.value)}
            />
          </Grid>
        </Grid>
        {error && (
          <Typography sx={{ color: "#C0392B", fontSize: "13px", mt: 1 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          disabled={adding}
          sx={{
            mt: 2,
            backgroundColor: "#EC3F18",
            textTransform: "none",
            "&:hover": { backgroundColor: "#d4350f" },
          }}
        >
          {adding ? "Adding…" : "Add review"}
        </Button>
      </Box>

      {/* Existing reviews */}
      <Typography sx={{ fontWeight: 600, color: "#393938", mb: 1.5 }}>
        Existing reviews ({reviews.length})
      </Typography>
      {isLoading || isFetching ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={26} sx={{ color: "#EC3F18" }} />
        </Box>
      ) : reviews.length === 0 ? (
        <Typography sx={{ color: "#9b9b9b", fontSize: "14px", py: 2 }}>
          No reviews yet for this host.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {reviews.map((rv) => (
            <Box
              key={rv._id}
              sx={{
                border: "1px solid #E7E7E7",
                borderRadius: "10px",
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontWeight: 600, color: "#393938" }}>
                  {rv.name || "Traveller"}
                </Typography>
                <Rating value={Number(rv.rating) || 0} readOnly size="small" />
                <Chip
                  size="small"
                  label={rv.source || "traveller"}
                  sx={{
                    height: 20,
                    fontSize: "11px",
                    backgroundColor:
                      rv.source === "google"
                        ? "#E8F0FE"
                        : rv.source === "manual"
                        ? "#FDF3EE"
                        : "#EEE",
                    color: "#555",
                  }}
                />
                <Box sx={{ flex: 1 }} />
                <IconButton
                  size="small"
                  onClick={() => handleDelete(rv._id)}
                  sx={{ color: "#C0392B" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              {(rv.location || rv.tripName) && (
                <Typography sx={{ color: "#9b9b9b", fontSize: "12px", mb: 0.5 }}>
                  {[rv.tripName, rv.location].filter(Boolean).join(" · ")}
                </Typography>
              )}
              <Typography sx={{ color: "#555", fontSize: "14px" }}>
                {rv.review}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default HostReviews;
