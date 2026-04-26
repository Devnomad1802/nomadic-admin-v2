/* eslint-disable react/prop-types */
import { Box, Typography, Dialog, Slide, IconButton } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "859px",
  bgcolor: "background.paper",
  border: "2px solid #FBFBFB",
  boxShadow: 24,
  background: "#FBFBFB",
  borderRadius: "32px",
  p: 4,
};
import CloseIcon from "@mui/icons-material/Close";

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
export default function EnquireModal({ opens, setOpens, enquireDetail }) {
  const handleClose = () => setOpens(false);
  console.log("enquireDetail.....", enquireDetail);
  const { Name, Phone, Message, Email, Date } = enquireDetail;
  return (
    <Dialog
      open={opens}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        color: "#fff",
        "& .MuiDialog-paper": {
          padding: "30px",
          zIndex: 100,
          mx: "auto",
          //   p: { xs: 2, md: 4 },
          borderRadius: { xs: "16px", sm: "24px" },
          border: "2px solid #FBFBFB",
          background: "#FBFBFB",
          overflowY: "auto",
          height: { xs: "auto", md: "auto" }, // Set an initial height
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "none",
            borderRadius: "3px",
            height: "40px", // Adjust the height as needed
          },
          "& *": {
            scrollbarWidth: "auto",
            scrollbarColor: "none #ffffff",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderRadius: "15px",
          color: "#FBFBFB",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          <IconButton
            onClick={() => {
              setOpens(false);
            }}
          >
            <CloseIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "10px 10px",
            width: "100%",
          }}
        >
          <Box sx={{}}>
            <Typography sx={{ color: "grey" }}>User Name</Typography>
            <Typography sx={{ color: "black" }}>
              {" "}
              <b>{Name}</b>
            </Typography>
          </Box>
          <Box sx={{}}>
            <Typography sx={{ color: "grey" }}>E-mail</Typography>
            <Typography sx={{ color: "black" }}>
              <b>{Email} </b>
            </Typography>
          </Box>
          <Box sx={{}}>
            <Typography sx={{ color: "grey" }}>Phone</Typography>
            <Typography sx={{ color: "black" }}>
              <b>{Phone}</b>
            </Typography>
          </Box>
          <Box sx={{}}>
            <Typography sx={{ color: "grey" }}>enquriyDate</Typography>
            <Typography sx={{ color: "black" }}>
              <b>{Date}</b>
            </Typography>
          </Box>
        </Box>
        <hr />
        <box>
          <Typography
            sx={{
              color: "grey",
            }}
          >
            Massage
          </Typography>
          <Typography sx={{ color: "black", py: 6 }}>{Message}</Typography>
        </box>
      </Box>
    </Dialog>
  );
}
