import {Box, Collapse, Container, Typography} from "@mui/material";
import React, {useState, useEffect} from "react";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import PublicIcon from "@mui/icons-material/Public";
const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  useEffect(() => {
    function onlineHandler() {
      setIsOnline(true);
    }

    function offlineHandler() {
      setIsOnline(false);
    }

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);
  useEffect(() => {
    console.log("isOnline:", isOnline);
    if (isOnline) {
      setTimeout(() => {
        setShowStatus(false);
      }, 2000);
    } else {
      setShowStatus(true);
    }
  }, [isOnline]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      className={` ${
        isOnline ? "text-bg-success" : "text-bg-danger"
      } text-center`}
    >
      <Collapse in={showStatus}>
        <Box className="centered-flex p-xs-0 p-1">
          {isOnline ? (
            <PublicIcon sx={{fontSize: "1rem"}} />
          ) : (
            <CloudOffIcon sx={{fontSize: "1rem"}} />
          )}
          <Typography
            variant="body2"
            component="span"
            textAlign="center"
            m="0 0.35rem"
          >
            {isOnline ? "Back Online" : "No internet connection"}
          </Typography>
        </Box>
      </Collapse>
    </Container>
  );
};

export default NetworkStatus;
