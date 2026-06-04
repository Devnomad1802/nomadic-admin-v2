const BRAND_SUFFIX = "| Nomadic Townies";
const SEO_TITLE_MAX = 60;
const META_DESC_MIN = 140;
const META_DESC_MAX = 160;

/**
 * Converts a string to an SEO-friendly slug.
 * lowercase, hyphens, no special characters, no leading/trailing hyphens.
 */
export function generateSlug(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   // remove special chars
    .replace(/[\s_]+/g, "-")    // spaces/underscores → hyphens
    .replace(/-+/g, "-")        // collapse multiple hyphens
    .replace(/^-+|-+$/g, "");   // strip leading/trailing hyphens
}

/**
 * Generates an SEO title: "Trip Title | Nomadic Townies"
 * Trims to SEO_TITLE_MAX characters, always ends with brand suffix.
 */
export function generateSeoTitle(title) {
  if (!title) return "";
  const base = title.trim();
  const full = `${base} ${BRAND_SUFFIX}`;
  if (full.length <= SEO_TITLE_MAX) return full;
  // Trim the title part to fit within limit
  const maxBase = SEO_TITLE_MAX - BRAND_SUFFIX.length - 1;
  return `${base.substring(0, maxBase).trim()} ${BRAND_SUFFIX}`;
}

/**
 * Generates a meta description between 140–160 characters.
 * Uses trip title, location, and category.
 */
export function generateMetaDescription(title, location, categories) {
  if (!title) return "";

  const locationStr = location ? ` in ${location}` : "";
  const categoryStr =
    Array.isArray(categories) && categories.length > 0
      ? ` — ${categories[0]} trip`
      : "";

  const desc = `Join our ${title}${categoryStr}${locationStr} with expert hosts, scenic routes, and unforgettable adventures. Book your seat today with Nomadic Townies.`;

  if (desc.length >= META_DESC_MIN && desc.length <= META_DESC_MAX) {
    return desc;
  }

  if (desc.length > META_DESC_MAX) {
    return desc.substring(0, META_DESC_MAX - 1).trimEnd() + ".";
  }

  // Pad if too short (rare)
  return desc + " Limited seats available.";
}
