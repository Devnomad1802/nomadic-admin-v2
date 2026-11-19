// Run: node src/utils/pricing.test.mjs
import assert from "node:assert";
import { computeSelling, sellingRupees } from "./pricing.js";

let pass = 0;
const ok = (n, c) => { assert.ok(c, n); console.log("  ✓", n); pass++; };

// Brief examples
let r = computeSelling(30000, 15);
ok("₹30000 @15% → markup 4500", r.markupRupees === 4500);
ok("₹30000 @15% → selling 34500", r.sellingRupees === 34500);

r = computeSelling(28500, 15);
ok("₹28500 @15% → markup 4275", r.markupRupees === 4275);
ok("₹28500 @15% → selling 32775", r.sellingRupees === 32775);

// 0% valid
r = computeSelling(1000, 0);
ok("0% markup → selling = B2B", r.ok && r.sellingRupees === 1000 && r.markupRupees === 0);

// zero price
r = computeSelling(0, 15);
ok("₹0 B2B → selling 0", r.ok && r.sellingRupees === 0);

// decimals, paise-safe: 333 @15% = 49.95
r = computeSelling(333, 15);
ok("₹333 @15% → 49.95 markup", r.markupRupees === 49.95 && r.sellingRupees === 382.95);

// missing / invalid
ok("missing B2B → not ok", !computeSelling("", 15).ok && computeSelling("", 15).reason === "b2b");
ok("missing markup → not ok", !computeSelling(30000, null).ok && computeSelling(30000, null).reason === "markup");
ok("negative B2B → not ok", !computeSelling(-5, 15).ok);
ok("negative markup → not ok", !computeSelling(100, -5).ok);
ok("NaN B2B → not ok", !computeSelling("abc", 15).ok);
ok("sellingRupees helper blank on invalid", sellingRupees("", 15) === "");

// large price
r = computeSelling(1000000, 20);
ok("₹10,00,000 @20% → 12,00,000", r.sellingRupees === 1200000);

console.log(`\nAll ${pass} checks passed.`);
