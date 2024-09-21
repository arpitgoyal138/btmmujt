import React, { useState, useContext, useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { drawerItems } from "./items";
import { drawerStyles } from "./styles";
import { useNavigate, Outlet, Link } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import AuthAPI from "../../../api/firebase/AuthAPI";
import CustomButton from "../../common/Button/CustomButton";

const LeftResponsiveDrawerMember = (props) => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const authAPI = new AuthAPI();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleLogout = async () => {
    try {
      await authAPI
        .signoutUser()
        .then(() => {
          localStorage.clear();
          console.log("Sign out success");
          navigate("/");
        })
        .catch((err) => {
          console.log("Error in SignOut:", err);
        });
    } catch (ex) {
      console.log("Error sign out:", ex);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    console.log(
      "local current user: ",
      JSON.parse(localStorage.getItem("user"))
    );
    setCurrentUser(JSON.parse(localStorage.getItem("user")));
    setTimeout(() => {
      setSelectedTab("Dashboard");
      navigate("/member/my-subscription");
    }, 500);
  }, []);

  const drawer = (
    <div>
      <Box sx={drawerStyles.topBox}>
        <Typography variant="h5" sx={{ margin: "0.5rem" }}>
          <Link to="/" className="list-group-item">
            {process.env.REACT_APP_SHORT_NAME}
          </Link>
        </Typography>
        <Divider sx={drawerStyles.divider} />
        <Box sx={{ marginTop: "10px" }}>
          <Avatar
            alt={currentUser !== null ? currentUser.name : "Member"}
            src={
              currentUser !== null
                ? currentUser.latest_photo.url
                : "/static/images/avatar/1.jpg"
            }
            sx={drawerStyles.avatar}
          />
          <Typography variant="body1">
            {currentUser !== null ? currentUser.name : "Member"}
          </Typography>
          <CustomButton
            color="primary"
            variant="contained"
            fullWidth
            sx={drawerStyles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </CustomButton>
        </Box>
      </Box>

      <Divider sx={drawerStyles.divider} />
      <List>
        {drawerItems.map((item, index) => (
          <ListItemButton
            className={`${selectedTab === item.label ? "bg-primary" : ""}`}
            sx={drawerStyles.listItems}
            key={item.id}
            onClick={() => {
              setSelectedTab(item.label);
              navigate(item.route);
              handleDrawerToggle();
            }}
          >
            <ListItemIcon sx={drawerStyles.icons}>{item.icon}</ListItemIcon>
            <ListItemText sx={drawerStyles.text} primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline enableColorScheme />
      <AppBar position="fixed" sx={drawerStyles.appBar}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={drawerStyles.appBarIcon}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div">
            {selectedTab}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={drawerStyles.drawerBox}>
        {isMobile && (
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={drawerStyles.temporaryDrawer}
          >
            {drawer}
          </Drawer>
        )}
        <Drawer
          className={drawerStyles.drawer}
          variant="permanent"
          sx={drawerStyles.permanentDrawer}
          open={!mobileOpen}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={drawerStyles.outletBox}>
        <Toolbar sx={{ display: { sm: "none", xs: "block" } }} />
        <Outlet context={currentUser} />
      </Box>
    </Box>
  );
};

export default LeftResponsiveDrawerMember;
