import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { useCreateCustomerMutation } from "../../Redux/services";

const INK = "#1D2939";
const field = {
  mb: 1.5,
  "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 14, background: "#fff", color: "#111" },
};

// Reusable admin "Add Customer" dialog. onCreated(customer) fires with the new
// (or existing-on-email) profile so a caller can auto-select it.
export default function AddCustomerModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState("");
  const [existing, setExisting] = useState(null); // {customer} on EMAIL_EXISTS

  const [createCustomer, { isLoading }] = useCreateCustomerMutation();

  const reset = () => { setName(""); setEmail(""); setPhone(""); setConsent(false); setErr(""); setExisting(null); };
  const close = () => { reset(); onClose?.(); };

  const submit = async () => {
    setErr(""); setExisting(null);
    if (!name.trim() || !email.trim() || !phone.trim()) { setErr("Name, email and phone are required."); return; }
    if (!consent) { setErr("Confirm the customer authorised you to create this profile."); return; }
    try {
      const res = await createCustomer({ name, email, phone, consent }).unwrap();
      onCreated?.(res.customer);
      close();
    } catch (e) {
      const code = e?.data?.code;
      if (code === "EMAIL_EXISTS" && e?.data?.customer) {
        setExisting(e.data.customer); // offer to use it
      } else if (code === "PHONE_CONFLICT") {
        setErr("This phone number belongs to a different account. Resolve manually — not auto-merged.");
      } else {
        setErr(e?.data?.message || "Could not create the customer.");
      }
    }
  };

  const useExisting = () => { onCreated?.(existing); close(); };

  return (
    <Dialog open={!!open} onClose={close} maxWidth="sm" fullWidth PaperProps={{ sx: { color: INK } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18, color: INK }}>
        Add customer
        <Typography sx={{ fontSize: 12, color: "#667085", mt: 0.5 }}>
          Creates a pending-activation profile. No password is set; the customer activates later. They can be booked now.
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ background: "#F9FAFB" }}>
        {err && <Alert severity="error" sx={{ mb: 1.5 }}>{err}</Alert>}
        {existing && (
          <Alert severity="info" sx={{ mb: 1.5 }} action={<Button size="small" onClick={useExisting} sx={{ textTransform: "none" }}>Use this</Button>}>
            A customer with this email already exists: <b>{existing.name || "—"}</b> ({existing.email}). Use that profile instead of creating a duplicate.
          </Alert>
        )}
        <TextField size="small" fullWidth label="Full name" value={name} onChange={(e) => setName(e.target.value)} sx={field} />
        <TextField size="small" fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={field} />
        <TextField size="small" fullWidth label="Phone (with country code, e.g. +91…)" value={phone} onChange={(e) => setPhone(e.target.value)} sx={field} />
        <FormControlLabel
          control={<Checkbox checked={consent} onChange={(e) => setConsent(e.target.checked)} size="small" />}
          label={<Typography sx={{ fontSize: 13, color: INK }}>The customer authorised me to create this profile for a booking.</Typography>}
        />
        <Typography sx={{ fontSize: 12, color: "#98A2B3", mt: 0.5 }}>
          Email/phone are not marked verified. Do not enter another person&apos;s details without their consent.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={close} sx={{ textTransform: "none" }}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={isLoading} sx={{ textTransform: "none" }}>
          {isLoading ? <CircularProgress size={18} color="inherit" /> : "Create customer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
