// Shared host-markup pricing. Nomadic Townies buys at the host's B2B rate and
// sells to customers at B2B + markup%. Markup % = the host's commissionRate
// (reused as agreed — see Add Trip brief; "markup is commission").
//
//   selling (excl GST) = B2B × (1 + markup/100)
//
// Computed in integer paise to avoid float money drift, then returned as rupees
// rounded to 2 dp. GST is a separate, explicitly-configured step — never folded
// in here.

export const toPaise = (rupees) => {
  const n = Number(rupees);
  if (!isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100);
};

// Returns { ok, markupPaise, sellingPaise, markupRupees, sellingRupees } or
// { ok:false, reason } for invalid/missing inputs. Never fabricates a price.
export const computeSelling = (b2bRupees, markupPct) => {
  const b2b = Number(b2bRupees);
  const pct = Number(markupPct);
  if (b2bRupees === "" || b2bRupees == null || !isFinite(b2b) || b2b < 0) {
    return { ok: false, reason: "b2b" };
  }
  if (markupPct === "" || markupPct == null || !isFinite(pct) || pct < 0) {
    return { ok: false, reason: "markup" };
  }
  const b2bPaise = Math.round(b2b * 100);
  const markupPaise = Math.round((b2bPaise * pct) / 100);
  const sellingPaise = b2bPaise + markupPaise;
  return {
    ok: true,
    markupPaise,
    sellingPaise,
    markupRupees: markupPaise / 100,
    sellingRupees: sellingPaise / 100,
  };
};

// Convenience: selling price in rupees, or "" when inputs are invalid/missing.
export const sellingRupees = (b2bRupees, markupPct) => {
  const r = computeSelling(b2bRupees, markupPct);
  return r.ok ? r.sellingRupees : "";
};

export const inr = (rupees) =>
  "₹" + (Number(rupees) || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
