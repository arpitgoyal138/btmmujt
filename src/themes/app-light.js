import { createTheme } from "@mui/material";
import { red, purple } from "@mui/material/colors";

export const AppThemeLight = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          //color: "white", // Text color of button
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: process.env.REACT_APP_BG_COLOR,
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
      main: "rgb(47 93 126)",
      light: "rgb(65 121 162)",
    },
    visibilityIcon: {
      main: purple[500],
    },
    danger: {
      main: red[500],
    },
  },
});
