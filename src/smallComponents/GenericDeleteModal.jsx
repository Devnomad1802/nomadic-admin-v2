/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { Box, Button, Dialog, Slide, Typography } from "@mui/material";
import React, { useState } from "react";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { Button1 } from "./Button1";
import Loading from "./Loading";
import Toastify from "./Toastify";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GenericDeleteModal = ({
  delModal,
  setDelModal,
  itemId,
  onDelete,
  entityType = "item",
  itemName = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });

  const showToast = (msg, type) => {
    return setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };

  const handleClose = () => setDelModal(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await onDelete(itemId);
      showToast(
        res?.message || `${entityType} deleted successfully`,
        "success"
      );
      setLoading(false);
      setDelModal(false);
    } catch (error) {
      setLoading(false);
      showToast(
        error?.data?.message ||
          error?.data?.error ||
          `Failed to delete ${entityType}`,
        "error"
      );
      console.error("Error", error);
      setDelModal(false);
    }
  };

  return (
    <>
      <Dialog
        open={delModal}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="sm"
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          color: "#fff",
          "& .MuiDialog-paper": {
            padding: "30px",
            zIndex: 100,
            mx: "auto",
            p: { xs: 2, md: 4 },
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
        <Loading isLoading={loading} />
        <Toastify setAlertState={setAlertState} alertState={alertState} />
        <Box sx={{}}>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "column",
              gap: "20px 0px",
              color: "#000",
            }}
          >
            <HighlightOffRoundedIcon sx={{ fontSize: "50px", color: "red" }} />
            <Typography
              sx={{
                textAlign: "center",
                fontSize: { xs: "20px", sm: "30px" },
                fontWeight: "bold",
                color: "#636363",
              }}
            >
              Are You Sure ?
            </Typography>
            <Typography sx={{ textAlign: "center", px: { xs: 3, sm: 10 } }}>
              {itemName ? (
                <>
                  Do You Really Want To Delete <strong>{itemName}</strong>? This
                  Process Cannot be undone
                </>
              ) : (
                <>
                  Do You Really Want To Delete This {entityType}? This Process
                  Cannot be undone
                </>
              )}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "0px 20px",
              }}
            >
              <Button
                onClick={handleClose}
                sx={{
                  width: "100%",
                  //   background: { xs: "#fff", md: "#EC3F18" },
                  border: "1px solid transparent",
                  borderRadius: { xs: "15px", md: "36px" },
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.5, sm: 0.8, md: 1 },
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  color: "#000",
                  "&:hover": {
                    border: "1px solid #EC3F18",
                    color: { xs: "#000" },
                  },
                }}
              >
                Cancel
              </Button>
              <Button1 onClick={handleDelete}>Delete</Button1>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default GenericDeleteModal;
