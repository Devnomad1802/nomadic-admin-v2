import { Box, Button } from "@mui/material";
export const Button1 = (props) => {
  return (
    <Button
      {...props}
      sx={{
        width: "100%",
        background: "#EC3F18",
        border: "1px solid transparent",
        borderRadius: { xs: "15px", md: "36px" },
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 0.5, sm: 0.8, md: 1 },
        fontSize: { xs: "12px", sm: "14px", md: "16px" },
        color: "#fff",
        "&:hover": {
          border: "1px solid #EC3F18",
          color: { xs: "#000" },
        },
      }}
    >
      {" "}
      {props.children}{" "}
    </Button>
    // </Box>
  );
};
