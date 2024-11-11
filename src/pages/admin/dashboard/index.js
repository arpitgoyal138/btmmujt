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
import Loader from "../../../components/loader/Loader";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const authAPI = new AuthAPI();
  const membersAPI = new MembersAPI();
  const donationsGivenAPI = new DonationsGivenAPI();
  const donationsReceivedAPI = new DonationsReceivedAPI();
  const [totMembers, setTotMembers] = useState(0);
  const [totAmountDonated, setTotAmountDonated] = useState(0);
  const [totAmountReceived, setTotAmountReceived] = useState(0);
  const [totalAutoPayments, setTotalAutoPayments] = useState(0);
  const [initialAutoPayments, setInitialAutoPayments] = useState(0);
  const [loading, setLoading] = useState(false);
  let totalPaidAmount = 0;
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
    donationsReceivedAPI.getDonationAutoPaidAmount().then((res) => {
      // console.log("res totalAutoPaidAmount:", res.data.amount);
      if (res.success) {
        setInitialAutoPayments(res.data.amount);
        setTotalAutoPayments(res.data.amount);
      }
    });
    //getAutoPayments();
  }, []);
  const getAutoPayments = () => {
    //setTotalAutoPayments(0);
    totalPaidAmount = 0;
    setLoading(true);
    const allDonations = donationsReceivedAPI.getDonations();
    allDonations
      .then((resData) => {
        // console.log("received donations:", resData);
        if (!resData) {
          return;
        }

        let subscriptionsArray = resData.data.filter(function (item) {
          return (
            item.subscription_id !== undefined &&
            item.subscription_id !== null &&
            item.subscription_id !== ""
          );
        });
        if (subscriptionsArray.length === 0) {
          setLoading(false);
          return;
        }
        subscriptionsArray.forEach((item) => {
          // console.log("subscription id: ", item.subscription_id);
          // fetch subscription details
          fetchSubscription(
            item.subscription_id,
            item.member_id,
            item.amount - 100
          );
        });
      })
      .catch((err) => {
        console.log("Error in getAutoPayments: ", err);
        setLoading(false);
      });
  };
  const fetchSubscription = (subscription_id, member_id, plan_amount) => {
    setLoading(true);
    // console.log(
    //   "fetching subscription_id: ",
    //   subscription_id,
    //   "member_id: ",
    //   member_id
    // );
    const url = "https://razorpayapi-ryltdekpdq-uc.a.run.app/fetchSubscription";
    const options = {
      subscriptionId: subscription_id,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(
          //   "Resp: fetchSubscription -> data from razorpay API:",
          //   data
          // );
          // update payment in member table
          const dataForPayment = {
            id: member_id,
            payload: {
              payment: {
                ...data,
              },
            },
          };
          membersAPI.setMember(dataForPayment, true);
          // console.log(
          //   "data.paid_count: ",
          //   data.paid_count,
          //   "plan_amount: ",
          //   plan_amount,
          //   "totalAutoPayments: ",
          //   totalAutoPayments
          // );
          let autoPaidAmount = plan_amount * (data.paid_count - 1);

          totalPaidAmount = totalPaidAmount + autoPaidAmount;
          // console.log(
          //   "total auto Paid amount: ",
          //   totalPaidAmount,
          //   "initial:",
          //   initialAutoPayments
          // );

          if (totalPaidAmount > initialAutoPayments) {
            const dataForAutoPayment = {
              id: "auto_payment_amount",
              payload: {
                amount: totalPaidAmount,
              },
            };
            donationsReceivedAPI.setDonation(dataForAutoPayment, false);
            setTotalAutoPayments(totalPaidAmount);
          }
          setLoading(false);
        });
    } catch (error) {
      console.log("Server Error:", error);
      setLoading(false);
    }
  };
  return (
    <>
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
            <IconButton
              aria-label="refresh"
              size="large"
              onClick={getAutoPayments}
            >
              <RefreshIcon />
            </IconButton>
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
                    ₹
                    {totAmountReceived -
                      initialAutoPayments +
                      totalAutoPayments}
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
                    ₹
                    {totAmountReceived -
                      initialAutoPayments +
                      totalAutoPayments -
                      totAmountDonated}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "left", mt: 2 }}></Box>
              </Container>
            </Paper>
          </Grid>
        </Grid>
      </>
      {loading && <Loader type="CIRCULAR"></Loader>}
    </>
  );
};

export default AdminDashboard;
