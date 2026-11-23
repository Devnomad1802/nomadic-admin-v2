import { useEffect, useRef, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Box,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { fetchHostAadhaar, uploadHostAadhaar } from "../../utils/aadhaar";

const accordionStyle = {
  borderRadius: "12px",
  border: "1px solid #E7E7E7",
  "&:before": { display: "none" },
  boxShadow: "none",
};

const slotBox = {
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
};

const changeBtn = {
  border: "1px solid #E7E7E7",
  color: "#737373",
  borderRadius: "8px",
  textTransform: "none",
};

// One labelled Aadhaar side (Front/Back): preview + file picker.
function Side({ label, preview, onPick }) {
  return (
    <Grid item xs={12} sm={6}>
      <Typography sx={{ color: "#737373", mb: 1 }}>{label}</Typography>
      <Box sx={slotBox}>
        {preview ? (
          <img
            src={preview}
            alt={`Aadhaar ${label} preview`}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Typography sx={{ color: "#737373", fontSize: "12px" }}>
            {label}
          </Typography>
        )}
      </Box>
      <Button component="label" variant="outlined" size="small" sx={changeBtn}>
        {preview ? "Replace" : "Upload"}
        <input
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => onPick(e.target.files?.[0] || null)}
        />
      </Button>
    </Grid>
  );
}

// Aadhaar Card — one logical document group, two independently stored sides.
// PRIVATE: saved via POST /host/:id/aadhaar, previewed via an authenticated
// stream. Only available once the host exists (needs an id), so in Add mode we
// prompt to save the host first.
export default function AadhaarCard({ hostId }) {
  const [frontPreview, setFrontPreview] = useState(null); // remote blob URL
  const [backPreview, setBackPreview] = useState(null);
  const [frontFile, setFrontFile] = useState(null); // locally picked File
  const [backFile, setBackFile] = useState(null);
  const [localFront, setLocalFront] = useState(null); // local object URL
  const [localBack, setLocalBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, severity: "success", message: "" });

  // Track object URLs to revoke on unmount / replace (avoid leaks).
  const urls = useRef(new Set());
  const track = (u) => { if (u) urls.current.add(u); return u; };

  const loadPreviews = async () => {
    if (!hostId) return;
    setLoading(true);
    const [f, b] = await Promise.all([
      fetchHostAadhaar(hostId, "front"),
      fetchHostAadhaar(hostId, "back"),
    ]);
    setFrontPreview(track(f));
    setBackPreview(track(b));
    setLoading(false);
  };

  useEffect(() => {
    loadPreviews();
    return () => {
      urls.current.forEach((u) => URL.revokeObjectURL(u));
      urls.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostId]);

  const pick = (side, file) => {
    if (!file) return;
    const local = track(URL.createObjectURL(file));
    if (side === "front") { setFrontFile(file); setLocalFront(local); }
    else { setBackFile(file); setLocalBack(local); }
  };

  const save = async () => {
    if (!frontFile && !backFile) return;
    setSaving(true);
    const { ok, message } = await uploadHostAadhaar(hostId, {
      front: frontFile,
      back: backFile,
    });
    setSaving(false);
    setToast({ open: true, severity: ok ? "success" : "error", message });
    if (ok) {
      setFrontFile(null); setBackFile(null);
      setLocalFront(null); setLocalBack(null);
      await loadPreviews(); // reflect the stored version
    }
  };

  const bothMissing = !frontPreview && !backPreview && !frontFile && !backFile;

  return (
    <Accordion sx={{ mb: 2, ...accordionStyle }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#393938" }}>
          Aadhaar Card
          {!hostId ? "" : bothMissing ? " — not uploaded" : frontPreview && backPreview ? " — complete" : " — incomplete"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {!hostId ? (
          <Typography sx={{ color: "#737373", fontSize: "14px" }}>
            Save the host first, then upload the Aadhaar card here. Aadhaar is
            stored privately (separate from the other documents).
          </Typography>
        ) : (
          <>
            <Typography sx={{ color: "#9a9a9a", fontSize: "12px", mb: 2 }}>
              Front and back are stored as one private document. Each side can be
              replaced independently. JPEG, PNG or WebP.
            </Typography>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Side label="Front Side" preview={localFront || frontPreview} onPick={(f) => pick("front", f)} />
                <Side label="Back Side" preview={localBack || backPreview} onPick={(f) => pick("back", f)} />
              </Grid>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="small"
                disabled={saving || (!frontFile && !backFile)}
                onClick={save}
                sx={{ textTransform: "none", borderRadius: "8px", background: "#393938" }}
              >
                {saving ? "Saving…" : "Save Aadhaar"}
              </Button>
            </Box>
          </>
        )}
      </AccordionDetails>
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert severity={toast.severity} variant="filled" sx={{ width: "100%" }}>
          {toast.message}
        </MuiAlert>
      </Snackbar>
    </Accordion>
  );
}
