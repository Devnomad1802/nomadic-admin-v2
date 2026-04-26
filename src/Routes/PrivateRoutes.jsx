import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
const PrivateRoutes = ({ theme }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.users);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default PrivateRoutes;
