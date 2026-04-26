import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme1 = createTheme({
  palette: {
    background: {
      default: "#FFFFFF",
      color: "#fff",
    },
    text: {
      primary: "#fff",
      secondary: "rgba(255, 255, 255, 0.60)",
    },
    primary: {
      main: "#58C5DA",
    },
  },
  typography: {
    fontFamily: [" 'Poppins', sans-serif", "'Lexend', sans-serif"].join(","),
    h1: {
      fontFamily: "Poppins, sans-serif",
      fontSize: "54px",
      fontWeight: "900",
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
      fontSize: "40px",
      fontWeight: "700",
    },
    h3: {
      fontFamily: "Poppins, sans-serif",
      fontSize: "32px",
      fontWeight: "700",
    },
    h4: {
      fontFamily: "Poppins, sans-serif",
      fontSize: "22px",
    },

    body: {
      fontFamily: "Poppins, sans-serif",
      fontSize: "16px",
    },
    body1: {
      fontFamily: "Poppins, sans-serif",
    },
    body2: {
      fontFamily: "Poppins, sans-serif",
      fontStyle: "normal",
      fontWeight: 400,
      color: "#D6D6D6",
    },
    subtitle: {
      color: "#FFF",
      fontFamily: "Poppins",
      fontSize: "32px",
      fontStyle: "normal",
      fontWeight: 700,
    },
    gray: {
      fontFamily: "Poppins, sans-serif",
      fontStyle: "normal",
      fontWeight: 400,
      color: "rgba(255, 255, 255, 0.60)",
      fontSize: "16px",
    },
    geryBold: {
      fontFamily: "Poppins, sans-serif",
      fontStyle: "normal",
      fontWeight: 700,
      color: "#D6D6D6",
      fontSize: "14px",
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "simplebtn" },
          style: {
            textTransform: "capitalize",
            minWidth: "180.6px",
            fontSize: "14px",
            borderRadius: "10px",
            px: 2,
            color: "#fff",
            height: "45px",
            background:
              "linear-gradient(270deg, #008080 52.96%, rgba(0, 128, 128, 0.50) 125.63%)",
            "&:hover": {
              background:
                "linear-gradient(270deg,rgba(0, 128, 128, 0.50)52.96%,  #008080  125.63%)",
            },
          },
        },
        {
          props: { variant: "borderbtn" },
          style: {
            border: "2px solid #2CBCA5",
            padding: "8px 35px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: "16px",
            background: "transparent",
            borderRadius: "18px",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            textTransform: "capitalize",
            color: "#F4F3EF",
            "&:hover": {
              background: "transparent",
            },
          },
        },
        {
          props: { variant: "tablebtn" },
          style: {
            border: "2px solid #2CBCA5",
            padding: "2px 35px",
            fontFamily: "Poppins",
            fontStyle: "normal",
            fontWeight: "600",
            fontSize: "12px",
            background: "transparent",
            borderRadius: "18px",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            textTransform: "capitalize",
            color: "#F4F3EF",
            "&:hover": {
              background: "transparent",
            },
          },
        },
      ],
    },
  },
});

theme1.overrides = {
  MuiCssBaseline: {
    "@global": {
      body: {
        fontFamily: "Roboto, sans-serif",
        backgroundColor: "#080A0B",
        color: "#fff",
      },
      ".img-fluid": {
        maxWidth: "100%",
        height: "auto",
      },
    },
  },
};

const theme = responsiveFontSizes(theme1);

export default theme;
