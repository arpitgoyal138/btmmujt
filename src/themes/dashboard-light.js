import { createTheme, responsiveFontSizes } from "@mui/material";
import { red, purple, grey } from "@mui/material/colors";

let DashboardThemeLight = createTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    fontWeightRegular: 300,
    body2: {
      "@media (max-width:300px)": {
        fontSize: "0.75rem",
      },
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          fontSize: "1.5rem",
          "@media (max-width:600px)": {
            fontSize: "1.25rem",
          },
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
          fontSize: "0.95rem",
          //color: "white", // Text color of button
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: process.env.REACT_APP_BG_COLOR,
          color: "#fff", // Text color of button
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: process.env.REACT_APP_BG_COLOR, //"#021d31",
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
    mode: "light",
    primary: {
      main: process.env.REACT_APP_BG_COLOR,
    },
    secondary: {
      main: "rgb(0 48 48)",
    },
    visibilityIcon: {
      main: purple[500],
    },
    danger: {
      main: red[500],
    },
    ShoppingCartIcon: {
      main: grey[800],
    },
    PersonIcon: {
      main: grey[800],
    },
  },
});

DashboardThemeLight = responsiveFontSizes(DashboardThemeLight);

export default DashboardThemeLight;
