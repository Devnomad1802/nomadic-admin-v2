import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetUsersQuery } from "../Redux/services/authApis";
import {
  useGetAllBookingQuery,
  useGetAllEnquriesQuery,
  useGetTripsQuery,
} from "../Redux/services";

const RUST = "#CD482A";
const GREEN = "#22c55e";
const AMBER = "#F59E0B";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const INK = "#1F2937";
const GRAY = "#6B7280";

const fmt = (n) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
const fmtShort = (n) => {
  const v = Number(n) || 0;
  if (v >= 100000) return "₹" + (v / 100000).toFixed(1) + "L";
  if (v >= 1000) return "₹" + (v / 1000).toFixed(0) + "k";
  return "₹" + v;
};

// Creation date embedded in a Mongo ObjectId hex string.
const idDate = (id) => {
  try {
    return new Date(parseInt(String(id).substring(0, 8), 16) * 1000);
  } catch {
    return null;
  }
};

const safeParse = (v) => {
  if (typeof v !== "string") return v || {};
  try {
    return JSON.parse(v);
  } catch {
    return {};
  }
};

// Reconstruct a booking's grand total from its cardData.
const grandTotal = (b) => {
  const cd = safeParse(b?.cardData);
  const base = Array.isArray(cd.cardSectionData)
    ? cd.cardSectionData.reduce(
        (s, it) =>
          s + (Number(it?.TitlePrice) || 0) * (Number(it?.quantity) || 0),
        0
      )
    : 0;
  const gst = Number(cd.gstTax) || 0;
  const discount = Number(b?.coupenDiscount) || 0;
  return base + gst - discount;
};

const tripName = (b) => safeParse(b?.paymentDetail)?.title || "Unknown Trip";
const bookingDate = (b) =>
  b?.DateOfBooking ? new Date(b.DateOfBooking) : idDate(b?._id);

const RANGES = [
  { key: "7d", label: "7 Days", days: 7 },
  { key: "30d", label: "30 Days", days: 30 },
  { key: "90d", label: "90 Days", days: 90 },
  { key: "year", label: "This Year", days: 365 },
];

const card = {
  background: "#fff",
  borderRadius: "16px",
  border: "1px solid #F0F0F0",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  p: 2.5,
};

function KpiCard({ icon, color, label, value }) {
  return (
    <Box sx={card}>
      <Box sx={{ width: 38, height: 38, borderRadius: "10px", display: "grid", placeItems: "center", background: `${color}1A`, color, mb: 1.5 }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: "12px", color: GRAY, fontWeight: 600, mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontSize: "24px", fontWeight: 800, color: INK, lineHeight: 1.1 }}>{value}</Typography>
    </Box>
  );
}

const Analytics = () => {
  const [range, setRange] = useState("30d");

  const { data: bookingsRes, isLoading: lb } = useGetAllBookingQuery();
  const { data: usersRes, isLoading: lu } = useGetUsersQuery();
  const { data: enquiriesRes, isLoading: le } = useGetAllEnquriesQuery({ range: "All" });
  const { data: tripsRes, isLoading: lt } = useGetTripsQuery();

  const isLoading = lb || lu || le || lt;

  const from = useMemo(() => {
    const now = new Date();
    const r = RANGES.find((x) => x.key === range) || RANGES[1];
    return range === "year"
      ? new Date(now.getFullYear(), 0, 1)
      : new Date(now.getTime() - r.days * 24 * 60 * 60 * 1000);
  }, [range]);

  const stats = useMemo(() => {
    const allBookings = bookingsRes?.data || [];
    const allUsers = usersRes?.users || [];
    const allEnquiries = enquiriesRes?.data || [];
    const now = new Date();
    const inRange = (d) => d && d >= from && d <= now;

    const bookings = allBookings.filter((b) => inRange(bookingDate(b)));

    let totalSales = 0;
    let totalPending = 0;
    let fullPaid = 0;
    let partial = 0;
    const tripAgg = {};
    const dailyAgg = {};

    bookings.forEach((b) => {
      const paid = Number(b.total) || 0;
      const grand = grandTotal(b);
      const pending = grand - paid > 0 ? grand - paid : 0;
      totalSales += paid;
      totalPending += pending;
      if (pending > 0) partial += 1;
      else fullPaid += 1;

      const name = tripName(b);
      const key = b.tripId || name;
      if (!tripAgg[key]) tripAgg[key] = { name, bookings: 0, revenue: 0 };
      tripAgg[key].bookings += 1;
      tripAgg[key].revenue += paid;

      const d = bookingDate(b);
      if (d) {
        const dk = d.toISOString().slice(0, 10);
        if (!dailyAgg[dk]) dailyAgg[dk] = { date: dk, revenue: 0 };
        dailyAgg[dk].revenue += paid;
      }
    });

    const enquiries = allEnquiries.filter((e) =>
      inRange(e?.Date ? new Date(e.Date) : idDate(e?._id))
    );
    const newUsers = allUsers.filter(
      (u) => u?.role !== "Admin" && inRange(idDate(u?._id))
    );

    const bookingsCount = bookings.length;
    return {
      kpis: {
        totalSales,
        totalPending,
        bookings: bookingsCount,
        newUsers: newUsers.length,
        enquiries: enquiries.length,
        avgBookingValue: bookingsCount ? Math.round(totalSales / bookingsCount) : 0,
      },
      split: { fullPaid, partial },
      timeSeries: Object.values(dailyAgg).sort((a, b) => (a.date < b.date ? -1 : 1)),
      topTrips: Object.values(tripAgg).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      funnel: {
        bookings: bookingsCount,
        paid: fullPaid,
        awaiting: partial,
        conversion: bookingsCount ? Math.round((fullPaid / bookingsCount) * 100) : 0,
      },
      recent: [...bookings]
        .sort((a, b) => (bookingDate(b) || 0) - (bookingDate(a) || 0))
        .slice(0, 5)
        .map((b) => {
          const paid = Number(b.total) || 0;
          const pending = grandTotal(b) - paid;
          return {
            user: b.userName || "—",
            trip: tripName(b),
            amount: paid,
            status: pending > 0 ? "Partial" : "Booked",
            date: bookingDate(b),
          };
        }),
    };
  }, [bookingsRes, usersRes, enquiriesRes, from]);

  const k = stats.kpis;
  const pieData = [
    { name: "Full Paid", value: stats.split.fullPaid, color: GREEN },
    { name: "Partial", value: stats.split.partial, color: AMBER },
  ];
  const maxTripRev = Math.max(1, ...stats.topTrips.map((t) => t.revenue));
  const maxFunnel = Math.max(1, stats.funnel.bookings, stats.funnel.paid, stats.funnel.awaiting);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: "#F9FAFB", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <Typography sx={{ fontSize: { xs: "22px", md: "28px" }, fontWeight: 800, color: INK }}>
          Analytics &amp; Insights
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {RANGES.map((r) => (
            <Button key={r.key} onClick={() => setRange(r.key)} sx={{
              textTransform: "none", fontSize: "13px", fontWeight: 600, borderRadius: "999px", px: 2, py: 0.5, minWidth: "auto",
              color: range === r.key ? "#fff" : GRAY,
              background: range === r.key ? RUST : "#fff",
              border: "1px solid #E5E7EB",
              "&:hover": { background: range === r.key ? "#B03A1F" : "#F3F4F6" },
            }}>
              {r.label}
            </Button>
          ))}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: RUST }} />
        </Box>
      ) : (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<PaymentsOutlinedIcon />} color={GREEN} label="Total Sales" value={fmt(k.totalSales)} /></Grid>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<HourglassBottomOutlinedIcon />} color={AMBER} label="Total Pending" value={fmt(k.totalPending)} /></Grid>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<ConfirmationNumberOutlinedIcon />} color={RUST} label="Bookings" value={k.bookings} /></Grid>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<GroupAddOutlinedIcon />} color={BLUE} label="New Users" value={k.newUsers} /></Grid>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<ForumOutlinedIcon />} color={PURPLE} label="Enquiries" value={k.enquiries} /></Grid>
            <Grid item xs={6} sm={4} md={2}><KpiCard icon={<TrendingUpOutlinedIcon />} color={INK} label="Avg Value" value={fmt(k.avgBookingValue)} /></Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <Box sx={{ ...card, height: "100%" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: INK, mb: 0.5 }}>Revenue Over Time</Typography>
                <Typography sx={{ fontSize: "12px", color: GRAY, mb: 2 }}>Collected payments per day</Typography>
                {stats.timeSeries.length === 0 ? (
                  <Box sx={{ height: 260, display: "grid", placeItems: "center", color: GRAY }}>No bookings in this period</Box>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={stats.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={RUST} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={RUST} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: GRAY }} tickFormatter={(d) => d.slice(5)} />
                      <YAxis tick={{ fontSize: 11, fill: GRAY }} tickFormatter={fmtShort} width={48} />
                      <Tooltip formatter={(v) => fmt(v)} labelStyle={{ color: INK }} />
                      <Area type="monotone" dataKey="revenue" stroke={RUST} strokeWidth={2.5} fill="url(#rev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ ...card, height: "100%" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: INK, mb: 0.5 }}>Payments Split</Typography>
                <Typography sx={{ fontSize: "12px", color: GRAY, mb: 2 }}>Full vs partial bookings</Typography>
                <Box sx={{ position: "relative" }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={2}>
                        {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography sx={{ fontSize: "20px", fontWeight: 800, color: INK }}>{fmtShort(k.totalSales)}</Typography>
                      <Typography sx={{ fontSize: "11px", color: GRAY }}>collected</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 1 }}>
                  {pieData.map((e) => (
                    <Box key={e.name} sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: e.color }} />
                      <Typography sx={{ fontSize: "12px", color: GRAY }}>{e.name} ({e.value})</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...card, height: "100%" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: INK, mb: 2 }}>Top Trips by Revenue</Typography>
                {stats.topTrips.length === 0 ? (
                  <Typography sx={{ color: GRAY, fontSize: "14px" }}>No data yet</Typography>
                ) : stats.topTrips.map((t, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: INK, maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</Typography>
                      <Typography sx={{ fontSize: "13px", fontWeight: 700, color: INK }}>{fmt(t.revenue)}</Typography>
                    </Box>
                    <Box sx={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                      <Box sx={{ height: "100%", width: `${(t.revenue / maxTripRev) * 100}%`, background: RUST, borderRadius: 3 }} />
                    </Box>
                    <Typography sx={{ fontSize: "11px", color: GRAY, mt: 0.3 }}>{t.bookings} booking{t.bookings !== 1 ? "s" : ""}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ ...card, height: "100%" }}>
                <Typography sx={{ fontSize: "16px", fontWeight: 700, color: INK, mb: 2 }}>Bookings → Fully Paid</Typography>
                {[
                  { label: "Total Bookings", value: stats.funnel.bookings, color: "#E5E7EB", text: INK },
                  { label: "Fully Paid", value: stats.funnel.paid, color: RUST, text: "#fff" },
                  { label: "Awaiting Payment", value: stats.funnel.awaiting, color: "#FBD7CC", text: INK },
                ].map((step, i) => (
                  <Box key={i} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                      <Typography sx={{ fontSize: "12px", color: GRAY, fontWeight: 600 }}>{step.label}</Typography>
                      <Typography sx={{ fontSize: "13px", fontWeight: 700, color: INK }}>{step.value}</Typography>
                    </Box>
                    <Box sx={{ height: 30, borderRadius: "8px", background: step.color, width: `${Math.max(8, (step.value / maxFunnel) * 100)}%`, display: "flex", alignItems: "center", px: 1.5 }}>
                      <Typography sx={{ fontSize: "12px", fontWeight: 700, color: step.text }}>{step.value}</Typography>
                    </Box>
                  </Box>
                ))}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography sx={{ fontSize: "12px", color: GRAY }}>Payment Completion Rate</Typography>
                  <Typography sx={{ fontSize: "26px", fontWeight: 800, color: RUST }}>{stats.funnel.conversion}%</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box sx={card}>
            <Typography sx={{ fontSize: "16px", fontWeight: 700, color: INK, mb: 2 }}>Recent Bookings</Typography>
            {stats.recent.length === 0 ? (
              <Typography sx={{ color: GRAY, fontSize: "14px" }}>No recent bookings</Typography>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Box sx={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr", gap: 1, py: 1, borderBottom: "1px solid #F0F0F0", minWidth: 600 }}>
                  {["User", "Trip", "Amount", "Status", "Date"].map((h) => (
                    <Typography key={h} sx={{ fontSize: "11px", fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</Typography>
                  ))}
                </Box>
                {stats.recent.map((r, i) => (
                  <Box key={i} sx={{ display: "grid", gridTemplateColumns: "1.5fr 2fr 1fr 1fr 1fr", gap: 1, py: 1.5, borderBottom: "1px solid #F9FAFB", minWidth: 600, alignItems: "center" }}>
                    <Typography sx={{ fontSize: "13px", color: INK, fontWeight: 600 }}>{r.user}</Typography>
                    <Typography sx={{ fontSize: "13px", color: GRAY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.trip}</Typography>
                    <Typography sx={{ fontSize: "13px", color: INK, fontWeight: 600 }}>{fmt(r.amount)}</Typography>
                    <Box>
                      <Chip label={r.status} size="small" sx={{
                        fontSize: "11px", fontWeight: 700, height: "22px",
                        background: r.status === "Booked" ? "#DCFCE7" : "#FEF3C7",
                        color: r.status === "Booked" ? "#15803D" : "#B45309",
                      }} />
                    </Box>
                    <Typography sx={{ fontSize: "12px", color: GRAY }}>
                      {r.date ? new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Analytics;
