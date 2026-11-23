import { baseUrl } from "../Redux/utils/api";

// Aadhaar is a PRIVATE host document: the API never returns a public URL. Both
// the upload and the preview go through the admin JWT, and the image bytes are
// streamed from an authenticated endpoint into a blob object URL for <img>.
// (An <img src> to the protected route would send no Authorization header, so
// we fetch with fetch() + bearer and build an object URL instead.)

const authHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

// Fetch one side ("front" | "back") for a host and return a blob object URL,
// or null when not uploaded / unavailable. Caller must URL.revokeObjectURL it.
export const fetchHostAadhaar = async (hostId, side) => {
  const auth = authHeader();
  if (!auth || !hostId) return null;
  try {
    const res = await fetch(`${baseUrl}/host/${hostId}/aadhaar/${side}`, {
      headers: { Authorization: auth },
    });
    if (!res.ok) return null; // 404 = not uploaded (normal)
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
};

// Upload front and/or back (either may be omitted). `files` = { front?, back? }
// where each is a File. Returns { ok, message }.
export const uploadHostAadhaar = async (hostId, files) => {
  const auth = authHeader();
  if (!auth || !hostId) return { ok: false, message: "Missing auth or host." };
  const fd = new FormData();
  if (files.front) fd.append("aadhaarFront", files.front);
  if (files.back) fd.append("aadhaarBack", files.back);
  try {
    const res = await fetch(`${baseUrl}/host/${hostId}/aadhaar`, {
      method: "POST",
      headers: { Authorization: auth },
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: data?.message || `Upload failed (${res.status}).` };
    return { ok: true, message: data?.message || "Aadhaar saved." };
  } catch (e) {
    return { ok: false, message: e?.message || "Network error." };
  }
};
