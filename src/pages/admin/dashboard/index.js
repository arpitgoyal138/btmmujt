import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import AuthAPI from "../../../api/firebase/AuthAPI";
import MembersAPI from "../../../api/firebase/MembersAPI";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AddIcon from "@mui/icons-material/Add";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DonationsGivenAPI from "../../../api/firebase/DonationsGivenAPI";
import DonationsReceivedAPI from "../../../api/firebase/DonationsReceivedAPI";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const authAPI = new AuthAPI();
  const membersAPI = new MembersAPI();
  const donationsGivenAPI = new DonationsGivenAPI();
  const donationsReceivedAPI = new DonationsReceivedAPI();
  const [totMembers, setTotMembers] = useState(0);
  const [totAmountDonated, setTotAmountDonated] = useState(0);
  const [totAmountReceived, setTotAmountReceived] = useState(0);
  useEffect(() => {
    membersAPI.getMembers().then((res) => {
      setTotMembers(res.data.length);
    });
    donationsGivenAPI.totalDonatedAmount().then((res) => {
      if (res.success) {
        setTotAmountDonated(res.data);
      }
    });
    donationsReceivedAPI.totalDonationReceivedAmount().then((res) => {
      if (res.success) {
        setTotAmountReceived(res.data);
      }
    });
  }, []);

  return (
    <>
      <Box component="div" sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          Dashboard
        </Typography>
      </Box>
      <Grid container spacing={2} className="justify-content-evenly">
        <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box members"
            onClick={() => navigate("/admin/members")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <PeopleAltIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" align="center">
                  कुल सदस्य
                </Typography>
              </Box>
              <Box sx={{ pt: 0.5, pb: 0.5 }}>
                <Typography variant="h5" align="center">
                  {totMembers}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left", mt: 1 }}></Box>
            </Container>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box received"
            onClick={() => navigate("/admin/donations-received")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <CurrencyRupeeIcon sx={{ fontSize: 40 }} />
                <AddIcon sx={{ fontSize: 28, ml: "-12px" }} />
                <Typography variant="h5" align="center">
                  प्राप्त हुई राशि
                </Typography>
              </Box>
              <Box sx={{ pt: 0.5, pb: 0.5 }}>
                <Typography variant="h5" align="center">
                  ₹{totAmountReceived}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "left", mt: 2 }}></Box>
            </Container>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box donated"
            onClick={() => navigate("/admin/add-donation")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <VolunteerActivismIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" align="center">
                  दान की गयी राशि
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
        </Grid>
        <Grid item xs={12} sm={5} lg={3}>
          <Paper
            className="dashboard-box balance"
            // onClick={() => navigate("/admin/sales")}
          >
            <Container className="p-2" maxWidth="sm">
              <Box className="text-start">
                <AccountBalanceIcon sx={{ fontSize: 40 }} />
                <Typography variant="h5" align="center">
                  शेष राशि
                </Typography>
              </Box>
              <Box sx={{ pt: 0.5, pb: 0.5 }}>
                <Typography variant="h5" align="center">
                  ₹{totAmountReceived - totAmountDonated}
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

export default AdminDashboard;
