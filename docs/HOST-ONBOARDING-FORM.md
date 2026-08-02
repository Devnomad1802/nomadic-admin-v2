# Nomadic Townies — Host Onboarding Google Form (Phase 1)

Build-ready spec. Every question maps to a real backend field on the `Host`
model / Admin → Add New Host form, so Phase 2 can auto-import responses.
Types: **[Short]** short answer · **[Para]** paragraph · **[MC]** multiple
choice · **[CB]** checkboxes · **[DD]** dropdown · **[File]** file upload ·
**[Lin]** linear scale. **(R)** = required.

> Google Forms setup: enable **file uploads** (forces respondent sign-in to
> Google — mention this in the welcome), progress bar ON, one section per
> screen, response receipts ON, collect email ON.
> Excluded by design (internal-only): `commissionRate`, SEO/`metaDescription`,
> `isVerified`, stats (`tripsHosted`, `successRate`, `responseRate`),
> `contact_id`, admin visibility/status.

---

## Section 1 — Welcome to Nomadic Townies 🏔

**Description (no questions):**

> **Become a Nomadic Townies Host**
>
> Nomadic Townies is a curated marketplace for community-driven travel —
> treks, retreats, workshops and cultural immersions run by passionate local
> hosts. This form collects everything we need to build your host profile
> and get your experiences live.
>
> ⏱ Takes about **15–20 minutes**.
> 📄 Keep handy: your photos/logo, certification documents, PAN, and bank
> details for payouts.
> 🔒 Your information is used only to create your host profile and process
> payouts. Banking and ID documents are never shown publicly. You'll need to
> be signed in to a Google account for the file-upload questions.

---

## Section 2 — Basic Information
*"Let's start with the essentials — how travellers and our team can reach you."*

| # | Question | Type | Req | Helper text | → Backend |
|---|---|---|---|---|---|
| 2.1 | Your full name | [Short] | R | As on your ID | `hostName` |
| 2.2 | Brand / community name | [Short] | R | The name travellers will see, e.g. "Mountain Collective" | `hostTitle` |
| 2.3 | Email address | [Short, email validation] | R | We'll use this for your host account | `emailAddress` |
| 2.4 | Mobile number | [Short, regex `^[0-9+ -]{10,15}$`] | R | With country code, e.g. +91 98765 43210 | `phoneNumber` |
| 2.5 | WhatsApp number | [Short] | – | Only if different from mobile | `whatsapp` |
| 2.6 | City | [Short] | R | Where you're based | `city` |
| 2.7 | State | [Short] | R | | `state` |
| 2.8 | Country | [DD: India, Nepal, Bhutan, Sri Lanka, Other] | R | | (part of `hqLocation`) |
| 2.9 | Home base / operating location | [Short] | R | e.g. "Manali, Himachal Pradesh" — shown on your profile | `hqLocation` / `location` |
| 2.10 | Languages you speak | [CB: Hindi, English, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Nepali, Other] | R | Pick all that apply | `languages[]` |

## Section 3 — About You
*"This is the heart of your profile — travellers choose hosts they connect with. Write naturally; we'll help polish it."*

| # | Question | Type | Req | Helper | → Backend |
|---|---|---|---|---|---|
| 3.1 | Tell us your story | [Para] | R | Who are you? How did you get into travel? (150–300 words works great) | `hostOverview` |
| 3.2 | One-line intro for your profile card | [Short, max ~120 chars] | R | e.g. "Trekking the Himalayas with small groups since 2015" | `shortBio` |
| 3.3 | Why do you host experiences? | [Para] | R | What drives you? | (merged into `hostOverview`) |
| 3.4 | What makes your experiences different? | [Para] | R | Your secret sauce — the thing guests remember | (merged into `hostOverview` / `achievements`) |
| 3.5 | Which year did you start hosting/leading trips? | [Short, number] | R | e.g. 2016 | `foundedYear` |
| 3.6 | Years of experience (summary) | [Short] | R | e.g. "8+ years leading Himalayan treks" | `experience` |

## Section 4 — What kind of experiences do you host?
*"Select everything you offer — this decides where your trips appear."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 4.1 | Experience types | [CB]: Backpacking · Trekking · Adventure sports · Camping · Photography tours · Wellness & yoga · Spiritual journeys · Cultural immersions · Wildlife · Food trails · Road trips · Bike expeditions · Digital-nomad stays · Workshops · Corporate retreats · Other (text) | R | `specialties[]` |

## Section 5 — Expertise & Regions
*"Show travellers you know your terrain."*

| # | Question | Type | Req | Helper | → Backend |
|---|---|---|---|---|---|
| 5.1 | Your areas of expertise | [Para] | R | e.g. "High-altitude treks, winter expeditions, first-timer groups" | `specialties[]` |
| 5.2 | Certifications & training | [Para] | – | List each with year, e.g. "Basic Mountaineering Course, NIM, 2018" | `achievements[]` |
| 5.3 | Regions / mountains you cover | [Para] | R | e.g. "Himachal, Uttarakhand, Ladakh, Spiti" | `regionsHosted[]` |
| 5.4 | Countries you operate in | [Short] | R | e.g. "India, Nepal" | `regionsHosted[]` |
| 5.5 | Special skills worth mentioning | [Para] | – | Photography, storytelling, local cuisine, wildlife spotting… | `achievements[]` |
| 5.6 | Proudest achievements | [Para] | – | Awards, records, media features, milestone expeditions | `achievements[]` |

## Section 6 — Your Brand
*"How you'll look on Nomadic Townies."*

| # | Question | Type | Req | Helper | → Backend |
|---|---|---|---|---|---|
| 6.1 | Tagline | [Short, ~60 chars] | R | Short and punchy, e.g. "Small groups. Big mountains." | `tagline` |
| 6.2 | Instagram | [Short, URL] | – | Full link | `socialMedia.instagram` |
| 6.3 | Facebook | [Short, URL] | – | | `socialMedia.facebook` |
| 6.4 | Twitter/X | [Short, URL] | – | | `socialMedia.twitter` |
| 6.5 | Website | [Short, URL] | – | | `socialMedia.website` |
| 6.6 | Google reviews page link | [Short, URL] | – | If your business is on Google Maps — we can showcase your reviews | `googleReviewUrl` |

## Section 7 — Profile Images
*"Great photos = more bookings. Upload the best you have; our team can help crop/adjust."*

| # | Question | Type | Req | Helper | → Backend |
|---|---|---|---|---|---|
| 7.1 | Your logo or profile photo | [File: images only, max 10 MB, 1 file] | R | Square works best (min 400×400). JPG/PNG | `brandingLogo` |
| 7.2 | Cover photo | [File: images only, max 10 MB, 1 file] | R | Wide landscape shot (min 1600×900) that captures your vibe | `coverImage` |

## Section 8 — Photo Gallery
*"Show travellers what your experiences feel like."*

| # | Question | Type | Req | Helper | → Backend |
|---|---|---|---|---|---|
| 8.1 | Gallery photos | [File: images only, max 10 MB each, **up to 10 files**] | R | 5–10 photos: groups in action, campsites, trails, workshops, food, candid moments. JPG/PNG | `gallery[]` |

## Section 9 — Trust & Verification
*"Verified hosts get a badge and rank higher. Tell us what you hold — upload proof in Section 12."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 9.1 | Which of these do you have? | [CB]: Government ID · Business registration · GST registration · First-aid certification · Trek leader certification · Wilderness/rescue training · Adventure tourism license · Local guide license · Liability insurance · Other (text) | R | `verificationBadges[]` |
| 9.2 | Typical response time to traveller messages | [MC]: Within an hour · Within a few hours · Same day · Within 2 days | R | `responseTimeLabel` |
| 9.3 | Support hours | [Short] | – e.g. "9 AM – 9 PM IST" | `supportHours` |

## Section 10 — How You Operate
*"Helps us match you with the right travellers."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 10.1 | Maximum group size | [MC]: Up to 10 · 11–20 · 21–40 · 40+ | R | (trip `groupSize` default) |
| 10.2 | Typical trip length | [CB]: Day trips · Weekend (2–3 days) · 4–7 days · 8+ days | R | (trip planning) |
| 10.3 | Difficulty levels you run | [CB]: Easy · Moderate · Challenging · Expert | R | (trip `difficulty` default) |
| 10.4 | Age groups you host | [CB]: Under 18 (with guardians) · 18–35 · 35–50 · 50+ · Families | R | (trip planning) |
| 10.5 | Emergency preparedness | [Para] | R — e.g. first-aid kits, evacuation plans, satellite phones, nearest-hospital protocols | (vetting) |
| 10.6 | Is a first-aid-trained person present on your trips? | [MC]: Always · Usually · Planning to add | R | (vetting) |

## Section 11 — Payout Details 🔒
*"Used only to send your payouts. Never shown publicly. You can also share these later directly with our team if you prefer — just type 'Will share later'."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 11.1 | Account holder name | [Short] | R | `accountHolderName` |
| 11.2 | Bank name | [Short] | R | `bankName` |
| 11.3 | Branch | [Short] | – | (with `bankName`) |
| 11.4 | Account number | [Short] | R | `accountNumber` |
| 11.5 | IFSC code | [Short, regex `^[A-Za-z]{4}0[A-Za-z0-9]{6}$`] | R | `ifscCode` |
| 11.6 | UPI ID | [Short] | – | (payouts) |
| 11.7 | PAN number | [Short, regex `^[A-Za-z]{5}[0-9]{4}[A-Za-z]$`] | R | `panNumber` |
| 11.8 | GST number | [Short] | – | `gstNumber` |
| 11.9 | Registered business address | [Para] | R | `completeAddress` + `pincode` |

## Section 12 — Documents 🔒
*"Upload clear photos or PDFs. JPG/PNG/PDF, max 10 MB each."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 12.1 | PAN card | [File, 1] | R | `documents.panCard` |
| 12.2 | Aadhaar / Passport | [File, up to 2] | R | (identity verification) |
| 12.3 | GST certificate | [File, 1] | – | `documents.gstCertificate` |
| 12.4 | Business registration | [File, 1] | – | `documents.businessLicense` |
| 12.5 | Bank passbook / cancelled cheque | [File, 1] | R | `documents.bankPassbook` |
| 12.6 | Certifications & licenses | [File, up to 5] | – | (verification review) |
| 12.7 | Insurance documents | [File, up to 2] | – | (verification review) |

## Section 13 — Almost Done!
*"Last few things."*

| # | Question | Type | Req | → Backend |
|---|---|---|---|---|
| 13.1 | Experiences you plan to launch first | [Para] | R — 1–3 trip ideas with rough dates/regions | (trip pipeline) |
| 13.2 | Common questions travellers ask you (with your answers) | [Para] | – Becomes the FAQ on your profile | `faqs[]` |
| 13.3 | Anything else we should know? | [Para] | – | (admin notes) |
| 13.4 | Questions for the Nomadic Townies team? | [Para] | – | (follow-up) |
| 13.5 | I confirm the information provided is accurate and I agree to be contacted by Nomadic Townies. | [CB, single, R] | R | (consent) |

---

## Confirmation message (after submit)

> **You're in! 🎉**
> Thanks for applying to host with Nomadic Townies. Our team reviews every
> application personally — expect to hear from us **within 2–3 working days**
> at the email you provided. Next steps: profile review → a short intro call
> → your profile goes live. Meanwhile, follow us on Instagram
> @nomadictownies. See you out there!

---

## Completion-rate recommendations

1. **Order matters:** easy/identity questions first, banking + documents last (already structured this way) — people finish what they've invested in.
2. **Progress bar ON** + "Section X of 13" implied by Forms.
3. **"Will share later" escape hatch** on banking (11) keeps privacy-cautious hosts from abandoning; team collects later on the intro call.
4. Mark truly optional things optional — only ~60% of fields are required.
5. Keep paragraph helpers with **examples** (already in spec) — blank-box paralysis is the #1 drop-off cause.
6. Warn about Google sign-in requirement (file uploads) in the welcome, so nobody hits a surprise wall at Section 7.
7. Send the form with a short personal note + WhatsApp reminder after 48h.
8. Phase 2: export Sheet columns are exactly the "→ Backend" fields; a small import script can POST straight into Add New Host.
