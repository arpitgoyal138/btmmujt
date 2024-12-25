import { Box, Container, CssBaseline, Typography } from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import CustomButton from "../../common/Button/CustomButton";
import { useNavigate } from "react-router-dom";
import "./thank-animate.css";
const ThankYouForDonation = () => {
  return (
    <Container maxWidth="sm" align="center">
      <CssBaseline />
      <Typography
        variant="h3"
        align="center"
        sx={{ mt: 4 }}
        className="animate-charcter"
      >
        Membership Successful !
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CheckIcon fontSize="large" sx={{ fontSize: 80 }} color="success" />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" sx={{ mt: 4 }} color="success">
          सदस्यता ग्रहण करने के लिए धन्यवाद
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          {/* जल्द ही आपका I.D. कार्ड आपके व्हाट्सप्प नंबर पर भेज दिया जायगा */}
          <br></br>अधिक जानकारी के लिए कृप्या{" "}
          <b style={{ fontWeight: 500 }}> 9720060562</b> नंबर पर संपर्क करें
        </Typography>
      </Box>
    </Container>
  );
};

export default ThankYouForDonation;
