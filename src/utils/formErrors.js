// Universal Admin form-error helpers. Normalize an API error (RTK Query or
// fetch) into a friendly message + a { field: message } map the form can use
// for field-level highlighting, an error summary, and scroll-to-first-error.

// Turn any API error into { message, fields }.
export const parseApiError = (err) => {
  const body = err?.data ?? err?.response?.data ?? err;
  const structured = body?.error; // { type, message, fields }
  const fields =
    structured?.fields && typeof structured.fields === "object" ? structured.fields : {};
  const message =
    structured?.message ||
    body?.message ||
    (typeof body === "string" ? body : "") ||
    "Something went wrong. Please review the form and try again.";
  return { message, fields };
};

// Scroll to + focus the first errored field (by id `fld-<name>`). Returns the
// field name it focused, or null. Pass an optional beforeScroll callback to,
// e.g., open the accordion that contains the field first.
export const focusFirstError = (fields, beforeScroll) => {
  const first = Object.keys(fields || {})[0];
  if (!first) return null;
  if (beforeScroll) beforeScroll(first);
  // Let any accordion expand before scrolling.
  setTimeout(() => {
    const el = document.getElementById(`fld-${first}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusable = el.querySelector("input, textarea, select") || el;
      try { focusable.focus({ preventScroll: true }); } catch { /* ignore */ }
    }
  }, 120);
  return first;
};
