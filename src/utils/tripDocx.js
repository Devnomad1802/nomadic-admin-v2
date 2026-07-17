import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow,
  TableCell, WidthType, AlignmentType, BorderStyle, PageNumber, Footer,
} from "docx";

// ── helpers ─────────────────────────────────────────────────────────────
const safeParse = (v, f) => {
  try { return typeof v === "string" ? JSON.parse(v) : (v ?? f); } catch { return f; }
};
// Strip HTML tags from rich-text values into readable plain text.
const plain = (html) =>
  String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
const val = (v) => {
  const s = String(v ?? "").trim();
  return s && s !== "undefined" && s !== "null" ? s : "Not provided";
};
const fmtDate = (d) => {
  if (!d) return "Not provided";
  const t = new Date(d);
  return isNaN(t) ? "Not provided" : t.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const inr = (n) => {
  const x = Number(n);
  return Number.isFinite(x) && x > 0 ? `₹ ${x.toLocaleString("en-IN")}` : "Not provided";
};

const h1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 }, children: [new TextRun({ text: t, bold: true })] });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 100 }, children: [new TextRun({ text: t, bold: true })] });
const p = (t) => new Paragraph({ spacing: { after: 80 }, children: [new TextRun(String(t))] });
const bullet = (t) => new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun(String(t))] });
const kv = (k, v2) => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${k}: `, bold: true }), new TextRun(String(v2))] });

const cell = (t, bold = false) => new TableCell({
  width: { size: 25, type: WidthType.PERCENTAGE },
  children: [new Paragraph({ children: [new TextRun({ text: String(t), bold })] })],
});

// Multi-line rich text → paragraphs; bullet lines become bullets.
const richBlock = (html) => {
  const text = plain(html);
  if (!text) return [p("Not provided")];
  return text.split("\n").filter(Boolean).map((line) =>
    line.startsWith("• ") ? bullet(line.slice(2)) : p(line)
  );
};

// ── main export ─────────────────────────────────────────────────────────
export const downloadTripDocx = async (trip) => {
  const isCustomized = trip?.type === "Customized";
  const batches = safeParse(trip?.selectDate, []);
  const ends = safeParse(trip?.endSelectDate, []);
  const seats = safeParse(trip?.numberOfSeats, []);
  const daysArr = safeParse(trip?.numberOfDays, []);
  const addDays = safeParse(trip?.addDays, []);
  const sections = safeParse(trip?.addsection, []);
  const faqs = Array.isArray(trip?.faqs) ? trip.faqs : [];
  const highlights = Array.isArray(trip?.highlights) ? trip.highlights : [];
  const partialOn = trip?.partialPaymentEnabled !== false && Number(trip?.firstBookingPrice) > 0;
  const host = trip?.host && typeof trip.host === "object" ? trip.host : null;

  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: "NOMADIC TOWNIES", bold: true, size: 48 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new TextRun({ text: "Trip Document", size: 24, color: "888888" })] }),
    h1(val(trip?.title)),
  ];
  if (trip?.subTitle) children.push(p(plain(trip.subTitle)));

  children.push(
    h2("Trip Overview"),
    kv("Trip ID", val(trip?._id)),
    kv("Destination", val(trip?.location)),
    kv("Trip type", isCustomized ? "Customized (inquiry-based)" : "Batch (fixed departures)"),
    kv("Duration", trip?.nights && trip?.days ? `${trip.nights} Nights · ${trip.days} Days` : "Not provided"),
    kv("Category", Array.isArray(trip?.categories) && trip.categories.length ? plain(trip.categories.join(", ")) : "Not provided"),
    kv("Difficulty", val(trip?.difficulty)),
    kv("Max travellers / group size", val(trip?.groupSize)),
    kv("Status", trip?.enableBooking ? "Booking enabled" : "Booking disabled"),
    kv("Host", host ? `${host.hostTitle || host.hostName || "—"}${host.hqLocation ? ` · ${host.hqLocation}` : ""}` : "Not provided"),
  );

  children.push(
    h2("Pricing"),
    kv("Price (per person)", inr(trip?.price)),
    kv("Strike price", inr(trip?.strikePrice)),
    kv("Partial payment", partialOn ? "Enabled" : "Disabled"),
  );
  if (partialOn) {
    children.push(
      kv("Booking amount", inr(trip?.firstBookingPrice)),
      kv("Balance due", "15 days before the selected batch departure date"),
    );
  }
  children.push(
    kv("Commission rate", val(trip?.commissionRate)),
    kv("GST", "5% applied at checkout"),
  );

  if (Array.isArray(sections) && sections.length) {
    children.push(h2("Add-ons / Price options"));
    sections.forEach((sec) => {
      (sec?.array || []).forEach((it) => {
        if (it?.Title) children.push(bullet(`${plain(it.Title)} — ${inr(it.TitlePrice)}`));
      });
    });
  }

  children.push(h2("Batches"));
  if (isCustomized) {
    children.push(p("Fixed batches are not applicable — this is a Customized, inquiry-based trip. Dates are planned with each traveller."));
  } else if (batches.length) {
    const rows = [
      new TableRow({ children: [cell("Start date", true), cell("End date", true), cell("Seats", true), cell("Days", true)] }),
      ...batches.map((b, i) => new TableRow({
        children: [
          cell(fmtDate(b?.BatchDate)),
          cell(fmtDate(ends?.[i]?.EndBatchDate)),
          cell(val(seats?.[i]?.batchSeats)),
          cell(val(daysArr?.[i]?.selectDays)),
        ],
      })),
    ];
    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.SINGLE }, bottom: { style: BorderStyle.SINGLE }, left: { style: BorderStyle.SINGLE }, right: { style: BorderStyle.SINGLE }, insideHorizontal: { style: BorderStyle.SINGLE }, insideVertical: { style: BorderStyle.SINGLE } },
      rows,
    }));
  } else {
    children.push(p("Not provided"));
  }

  children.push(h2("Overview"), ...richBlock(trip?.overview));

  if (highlights.length) {
    children.push(h2("Highlights"));
    highlights.forEach((hl) => children.push(bullet(plain(hl))));
  }

  if (Array.isArray(addDays) && addDays.length) {
    children.push(h2("Day-wise Itinerary"));
    addDays.forEach((d, i) => {
      children.push(new Paragraph({ spacing: { before: 140, after: 60 }, children: [new TextRun({ text: `Day ${i + 1}${d?.daysTitle ? ` — ${plain(d.daysTitle)}` : ""}`, bold: true })] }));
      if (d?.daysDescription) richBlock(d.daysDescription).forEach((x) => children.push(x));
    });
  }

  children.push(h2("Inclusions"), ...richBlock(trip?.Inclusion));
  children.push(h2("Exclusions"), ...richBlock(trip?.Exclusion));
  children.push(h2("Things to Carry / Other Information"), ...richBlock(trip?.ThingsToCarry || trip?.importantInfo));

  if (faqs.length) {
    children.push(h2("FAQs"));
    faqs.forEach((f) => {
      children.push(new Paragraph({ spacing: { before: 100, after: 40 }, children: [new TextRun({ text: `Q: ${plain(f?.q)}`, bold: true })] }));
      children.push(p(`A: ${plain(f?.a) || "Not provided"}`));
    });
  }

  children.push(h2("Cancellation & Refund Terms"), ...richBlock(trip?.Cancellation));
  children.push(
    h2("Payment Terms"),
    bullet("Payments are collected securely via Razorpay on nomadictownies.com."),
    bullet(partialOn
      ? `Book with ${inr(trip?.firstBookingPrice)}; the balance is due 15 days before departure.`
      : "The full amount is payable at the time of booking."),
    bullet("GST @ 5% is added at checkout."),
  );

  children.push(
    h2("SEO & Metadata"),
    kv("SEO title", val(trip?.seoTitle)),
    kv("Meta description", val(trip?.metaDescription)),
    kv("Slug", val(trip?.seoSlug)),
    kv("Created", fmtDate(trip?.date || trip?.createdAt)),
    kv("Updated", fmtDate(trip?.updatedAt)),
  );

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES], size: 18, color: "888888" })],
          })],
        }),
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = String(trip?.title || "Trip").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Nomadic-Townies-${safeTitle}-${trip?._id || "draft"}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
