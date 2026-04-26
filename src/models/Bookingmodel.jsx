import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";
import { Container, Grid, IconButton, Typography } from "@mui/material";

import { indr } from "../Images";

const style = {
  scrollY: "auto",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "981px",
  bgcolor: "background.paper",
  border: "2px solid #FBFBFB",
  boxShadow: 24,
  background: "#FBFBFB",
  borderRadius: "32px",
  width: "100%",
  p: 4,
  height: "auto",
};

export default function Bookingmodel() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Button
        onClick={handleOpen}
        variant="simplebtn"
        sx={{
          background: "#393938",
          color: "#fff",
          border: "1.5px solid #393938",

          "&:hover": {
            border: "1.5px solid #CD482A",
            background: "#FBFBFB",
            color: "#CD482A",
          },
        }}
      >
        Login
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      ></Modal>
    </Box>
  );
}
