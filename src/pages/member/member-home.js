import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddIcon from "@mui/icons-material/Add";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AuthAPI from "../../api/firebase/AuthAPI";
import MembersAPI from "../../api/firebase/MembersAPI";
const MemberHomepage = () => {
  const navigate = useNavigate();
  const authAPI = new AuthAPI();
  const membersAPI = new MembersAPI();
  const [totMembers, setTotMembers] = useState(0);
  const [totAmountDonated, setTotAmountDonated] = useState(0);
  const [currentMember, setCurrentMember] = useState({});

  useEffect(() => {
    if (localStorage.getItem("user") && localStorage.getItem("user").uid) {
      const memberUid = localStorage.getItem("user").uid;
      membersAPI.getMembers().then((res) => {
        if (res.success) {
          setTotMembers(res.data.length);
        }
      });
      console.log("memberUid:", memberUid);
      membersAPI.getMemberById(localStorage.getItem("user").uid).then((res) => {
        setCurrentMember(res.data);
      });
    }

    // donationsGivenAPI.totalDonatedAmount().then((res) => {
    //   if (res.success) {
    //     setTotAmountDonated(res.data);
    //   }
    // });
  }, []);

  return (
    <>
      <Box component="div" sx={{ display: { xs: "none", sm: "block" } }}>
        {/* <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          My Dashboard
        </Typography> */}
      </Box>
      <Grid container spacing={2} className="justify-content-evenly">
        {/* <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box donated"
            onClick={() => navigate("/member/my-donations")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <VolunteerActivismIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" align="center">
                  My Donations
                </Typography>
              </Box>
              <Box sx={{ pt: 0.5, pb: 0.5 }}>
                <Typography variant="h5" align="center">
                  ₹{totAmountDonated}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left", mt: 2 }}></Box>
            </Container>
          </Paper>
        </Grid> */}
        <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box balance"
            onClick={() => navigate("/member/my-subscription")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <AccountBalanceIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" align="center">
                  My Subscription
                </Typography>
              </Box>
              <Box sx={{ pt: 0.5, pb: 0.5 }}>
                <Typography variant="h5" align="center">
                  ₹0
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left", mt: 2 }}></Box>
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default MemberHomepage;
