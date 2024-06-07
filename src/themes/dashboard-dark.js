import { createTheme, responsiveFontSizes } from "@mui/material";
import { red, purple, grey } from "@mui/material/colors";

let DashboardThemeDark = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeightRegular: 300,
    body2: {
      "@media (max-width:296px)": {
        fontSize: "0.70rem",
      },
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: "1.25rem",
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: "#ffffff00",
          left: "3px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: grey[200],
          fontSize: "0.95rem",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#000",
          boxSizing: "border-box",
          color: "white",
          backgroundImage: `url("//www.gstatic.com/mobilesdk/190424_mobilesdk/nav_nachos@2x.png")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "256px 556px",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: { main: grey[600], light: grey[700], dark: grey[800] },
    secondary: {
      main: "rgb(18 39 53)",
    },
    background: {
      default: grey[900],
    },
    text: {
      primary: grey[300],
      secondary: grey[500],
    },
    visibilityIcon: {
      main: purple[500],
    },
    danger: {
      main: red[500],
    },
  },
});
DashboardThemeDark = responsiveFontSizes(DashboardThemeDark);
export default DashboardThemeDark;
