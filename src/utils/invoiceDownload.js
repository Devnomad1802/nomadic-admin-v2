import { baseUrl } from "../Redux/utils/api";

// Admin invoice download — GET /invoice/:bookingId with the admin JWT.
export const downloadInvoice = async (bookingDbId) => {
  const token = localStorage.getItem("token");
  if (!token || !bookingDbId) return false;
  try {
    const res = await fetch(`${baseUrl}/invoice/${bookingDbId}`, {
      headers: { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`invoice ${res.status}`);
    const blob = await res.blob();
    const cd = res.headers.get("Content-Disposition") || "";
    const name = /filename="?([^";]+)"?/.exec(cd)?.[1] || "invoice.pdf";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    return true;
  } catch (e) {
    console.error("invoice download failed:", e);
    return false;
  }
};
