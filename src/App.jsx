import { Box } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import UserTabs from "./Components/User/UserTabs";
import Blogs from "./Pages/Blogs";
import Bookings from "./Pages/Bookings";
import Dashboard from "./Pages/Dashboard";
import Enquire from "./Pages/Enquire";
import ResponsiveDrawer from "./Pages/Parent";
import Reviews from "./Pages/Reviews";
import TripsTabs from "./Pages/TripsTabs";

import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import AboutEdit from "./Components/AboutUs/AboutEdit";
import AddBlog from "./Components/Blogs/AddBlog";
import PublishBlog from "./Components/Blogs/PublishBlog";
import AddCoupon from "./Components/Coupon/AddCoupon";
import CouponTabs from "./Components/Coupon/CouponTabs";
import AddHost from "./Components/Hosts/AddHost";
import HostReviews from "./Components/Hosts/HostReviews";
import AddReview from "./Components/Reviews/AddReview";
import PublishReview from "./Components/Reviews/PublishReview";
import AddTrip from "./Components/Trips/AddTrip";
import TripBookings from "./Components/Trips/TripBookings";
import Proposals from "./Components/Trips/Proposals";
import HostApplications from "./Components/Hosts/HostApplications";
import AddVendors from "./Components/Vendor/AddVendors";
import VenderTabs from "./Components/Vendor/VenderTabs";
import AboutUs from "./Pages/AboutUs";
import Banner from "./Pages/Banner";
import Category from "./Pages/Category";
import Coupons from "./Pages/Coupons";
import Hosts from "./Pages/Hosts";
import UserBooking from "./Pages/UserBooking";
import Vendors from "./Pages/Vendors";
import Emailvarification from "./smallComponents/Emailvarification";
import PrivateRoutes from "./Routes/PrivateRoutes";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { logout } from "./Redux/slices/userSlice";
import Payouts from "./Pages/Payouts";
import Seo from "./Pages/Seo";
import Settings from "./Pages/Settings";
import Analytics from "./Pages/Analytics";

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && isLoggedIn) {
      // If no token but user is marked as logged in, logout
      dispatch(logout());
    }
  }, [dispatch, isLoggedIn]);
  return (
    <Box
      sx={{
        maxWidth: "2000px",
        mx: "auto",
        width: "100%",
      }}
    >
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/email-verification" element={<Emailvarification />} />
        <Route element={<PrivateRoutes />}>

          <Route exact path="/" element={<ResponsiveDrawer />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/trip" element={<TripBookings />} />
            <Route path="/trip/addtrip" element={<AddTrip />} />
            <Route path="/trip/proposals" element={<Proposals />} />
            <Route path="/trip/tripTabs" element={<TripsTabs />} />
            <Route path="/user" element={<UserBooking />} />
            <Route path="/user/userTabs" element={<UserTabs />} />
            <Route path="/enquire" element={<Enquire />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/addBlog" element={<AddBlog />} />
            <Route
              path="/blogs/publishBlog"
              element={<PublishBlog />}
            />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/addReview" element={<AddReview />} />
            <Route
              path="/reviews/PublishReview"
              element={<PublishReview />}
            />

            <Route path="/vendors" element={<Vendors />} />
            <Route
              path="/vendors/addVendors"
              element={<AddVendors />}
            />
            <Route
              path="/vendors/vendorTabs"
              element={<VenderTabs />}
            />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/coupons/addCoupon" element={<AddCoupon />} />
            <Route
              path="/coupons/couponTabs"
              element={<CouponTabs />}
            />
            <Route path="/banner" element={<Banner />} />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/hosts/applications" element={<HostApplications />} />
            <Route path="/hosts/addHost" element={<AddHost />} />
            <Route path="/hosts/edit/:id" element={<AddHost />} />
            <Route path="/hosts/:id/reviews" element={<HostReviews />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/aboutus/editabout" element={<AboutEdit />} />
            <Route path="/category" element={<Category />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/seo" element={<Seo />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

      </Routes>
    </Box>
  );
};

export default App;
