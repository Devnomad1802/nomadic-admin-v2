import { Box, Typography } from "@mui/material";

/**
 * Reusable Admin form error summary. Renders "Please fix N issues" plus a
 * clickable list of field errors; clicking an item scrolls to that field
 * (elements are expected to carry id `fld-<name>`). Reusable by any admin form.
 *
 * Props:
 *  - fields: { [name]: message }
 *  - labels: { [name]: "Human Label" } (optional; falls back to the name)
 *  - onJump: (name) => void (optional; e.g. open the accordion before scrolling)
 */
const FormErrorSummary = ({ fields = {}, labels = {}, onJump }) => {
  const entries = Object.entries(fields);
  if (!entries.length) return null;

  const jump = (name) => {
    if (onJump) onJump(name);
    setTimeout(() => {
      const el = document.getElementById(`fld-${name}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const f = el.querySelector("input, textarea, select");
        if (f) { try { f.focus({ preventScroll: true }); } catch { /* ignore */ } }
      }
    }, 120);
  };

  return (
    <Box
      role="alert"
      sx={{
        mt: 2, mb: 1, p: 2, borderRadius: "8px",
        background: "#FEF2F2", border: "1px solid #FECACA",
      }}
    >
      <Typography sx={{ color: "#991B1B", fontWeight: 700, fontSize: "14px", mb: 0.5 }}>
        Please fix {entries.length} {entries.length === 1 ? "issue" : "issues"} before submitting.
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
        {entries.map(([name, msg]) => (
          <Box component="li" key={name} sx={{ color: "#B91C1C", fontSize: "13px", mb: 0.25 }}>
            <Box
              component="button"
              type="button"
              onClick={() => jump(name)}
              sx={{
                p: 0, border: "none", background: "none", cursor: "pointer",
                color: "#B91C1C", textAlign: "left", font: "inherit",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <strong>{labels[name] || name}</strong> — {msg}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FormErrorSummary;
