import { blue } from "@mui/material/colors";

const drawerWidth = 230;
const drawerBg = {
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#021d31", //"#021d31",
    boxSizing: "border-box",
    color: "white",
    backgroundImage: `url("//www.gstatic.com/mobilesdk/190424_mobilesdk/nav_nachos@2x.png")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "256px 556px",
  },
};
export const drawerStyles = {
  temporaryDrawer: {
    ...drawerBg,
    display: { xs: "block", sm: "none" },
  },
  permanentDrawer: {
    ...drawerBg,
    display: { xs: "none", sm: "block" },
  },
  listItems: {
    padding: "2px 5px",
    margin: "2px 5px",
    "&:hover": {
      backgroundColor: "#284b666e",
      borderRadius: "3px",
    },
  },
  icons: {
    minWidth: "40px",
    color: "white",
    marginLeft: "10px",
  },
  text: {
    "& span": {
      fontWeight: "1",
      fontSize: "16px",
    },
  },
  logoutButton: {
    borderColor: "white",
    margin: "10px 0 10px 0",
    color: "white",
    "&:hover": {
      backgroundColor: "secondary.light",
    },
    fontSize: "12px",
  },
  avatar: {
    width: 48,
    height: 48,
    margin: "auto",
  },
  divider: {
    bgcolor: "primary.light",
  },
  topBox: { textAlign: "center", padding: "5px" },
  appBar: {
    display: { sm: "none" },
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
  },
  appBarIcon: { mr: 0, display: { sm: "none" } },
  drawerBox: { width: { sm: drawerWidth }, flexShrink: { sm: 0 } },
  outletBox: {
    flexGrow: 1,
    p: 3,
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    minHeight: "100vh",
  },
};
