import * as React from "react";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

export default function Loader({type = "CIRCULAR", fullHeight = true}) {
  if (type === "CIRCULAR") {
    return (
      <Box sx={{height: fullHeight ? "100vh" : "auto"}}>
        <Backdrop sx={{color: "#fff", zIndex: 10}} open={true}>
          <CircularProgress color="inherit" disableShrink />
        </Backdrop>
      </Box>
    );
  } else {
    return (
      <Box sx={{width: "100%", height: "100vh"}}>
        <LinearProgress />
      </Box>
    );
  }
}
