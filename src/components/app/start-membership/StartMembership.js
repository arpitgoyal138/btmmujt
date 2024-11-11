import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";

import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import CheckoutButton from "../../common/CheckoutButton/CheckoutButton";
import DonationsReceivedAPI from "../../../api/firebase/DonationsReceivedAPI";
import MembersAPI from "../../../api/firebase/MembersAPI";
import { useNavigate } from "react-router-dom";

const StartMembership = (props) => {
  //   console.log("props:", props);
  const { memberDetails, setMemberDetails, setLoading, fromAdmin } = props;
  const planAmountRef = useRef(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);
  const PLAN_60_ID = process.env.REACT_APP_PLAN_60_ID;
  const PLAN_100_ID = process.env.REACT_APP_PLAN_100_ID;
  const PLAN_200_ID = process.env.REACT_APP_PLAN_200_ID;
  const PLAN_500_ID = process.env.REACT_APP_PLAN_500_ID;
  const navigate = useNavigate();
  const handleCreateOrder = (props) => {
    console.log("handleCreateOrder:", props);
    const { success, subscription } = props;
    if (!success) {
      console.log("Failed to create order:", props);
      setLoading(false);
      return;
    }
    setCurrentPayment(subscription);
    console.log("subscriptionData:", subscription);
  };
  const handlePaymentUpdate = (props) => {
    setLoading(true);
    console.log(
      "handlePaymentUpdate props:",
      props,
      "__currentPayment:",
      currentPayment,
      "__member:",
      memberDetails
    );
    const membersAPI = new MembersAPI();
    const donationsReceivedAPI = new DonationsReceivedAPI();
    //return;
    const { success, response } = props;
    if (success) {
      // sendMail();
      // Payment Completed
      const payment_id = response.razorpay_payment_id;
      const subscription_id = response.razorpay_subscription_id;
      const dataForDonationReceivedTable = {
        payload: {
          member_id: memberDetails.uid,
          member_unique_code: memberDetails.unique_code,
          name: memberDetails.name,
          contact_no: memberDetails.contact_no,
          method: "online",
          status: "Completed",
          uid: payment_id,
          plan_id: currentPayment.plan_id,
          subscription_id: subscription_id,
          amount: currentPayment.amount + 100,
          address: memberDetails.address,
          district: memberDetails.district,
          state: memberDetails.state,
        },
        id: payment_id,
      };

      donationsReceivedAPI
        .setDonation(dataForDonationReceivedTable)
        .then((resPayment) => {
          console.log("RES resPayment:", resPayment);

          const dataForMembersTable = {
            id: memberDetails.uid,
            payload: {
              payment: {
                ...currentPayment,
                plan_amount: memberDetails.donate_amount,
                amount: currentPayment.amount + 100,
                payment_id: payment_id,
                status: "Completed",
              },
            },
          };
          // console.log("dataForUsersTable:", dataForUsersTable);
          membersAPI
            .setMember(dataForMembersTable, true)
            .then((res) => {
              console.log("RES from user data update:", res);
              if (res.success) {
                //alert("Payment Successfull");
                // navigate to order placed page
                if (!fromAdmin) {
                  navigate("/thank-you");
                } else {
                  navigate("/admin/members");
                }

                setLoading(false);
              } else {
                setLoading(false);
              }
            })
            .catch((err) => {
              setLoading(false);
              console.log("err:", err);
            });
        });
    } else {
      // Payment failed
      console.log("Payment Failed");
      setLoading(false);
    }
  };
  return (
    <Grid container spacing={2} className="justify-content-evenly">
      <Grid
        container
        item
        xs={12}
        spacing={2}
        justifyContent="space-around"
        className="mt-2 mb-3"
      >
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Typography variant="h4" className="text-center">
            मासिक दान राशि{" "}
            <VolunteerActivismIcon sx={{ fontSize: 36, mt: "-12px" }} />
          </Typography>
        </Grid>
        <Grid
          item
          xs={10}
          sm={12}
          md={6}
          lg={6}
          sx={{ margin: "auto", textAlign: "center" }}
        >
          <FormControl sx={{ alignContent: "center" }} variant="standard">
            <Input
              sx={{ fontSize: "1.5rem", color: "darkgreen" }}
              type="number"
              inputRef={planAmountRef}
              placeholder="न्यूनतम ₹60"
              id="donate_amount"
              startAdornment={
                <InputAdornment position="start">
                  <p
                    style={{
                      fontSize: "1.7rem",
                      margin: 0,
                      color: "darkgreen",
                    }}
                  >
                    ₹
                  </p>
                </InputAdornment>
              }
              onKeyDown={(evt) => {
                let ASCIICode = evt.key.charCodeAt(0);
                //console.log("ASCIICode:", ASCIICode);

                if (
                  ASCIICode > 31 &&
                  ASCIICode !== 66 && //Backspace
                  ASCIICode !== 65 && // Arrow Left/Right/Up/Down
                  (ASCIICode < 48 || ASCIICode > 57)
                ) {
                  evt.preventDefault();
                }
              }}
              onChange={(e) => {
                setMemberDetails({
                  ...memberDetails,
                  donate_amount: Number(e.target.value),
                });
                if (Number(e.target.value) < 60) {
                  setCurrentPlanId(PLAN_60_ID);
                }

                switch (Number(e.target.value)) {
                  case 60:
                    setCurrentPlanId(PLAN_60_ID);
                    break;
                  case 100:
                    setCurrentPlanId(PLAN_100_ID);
                    break;
                  case 200:
                    setCurrentPlanId(PLAN_200_ID);
                    break;
                  case 500:
                    setCurrentPlanId(PLAN_500_ID);
                    break;
                  default:
                    setCurrentPlanId(null);
                    break;
                }
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Paper
          className="amount-box amount-60"
          onClick={() => {
            planAmountRef.current.value = 60;
            setCurrentPlanId(PLAN_60_ID);
            setMemberDetails({
              ...memberDetails,
              donate_amount: 60,
            });
          }}
        >
          <Container className="p-1" maxWidth="sm">
            {/* <Box className="text-start">
                      <VolunteerActivismIcon sx={{ fontSize: 32 }} />
                    </Box> */}
            <Box sx={{ pt: 0.5, pb: 0.5 }}>
              <Typography variant="h5" align="center">
                ₹60
              </Typography>
            </Box>
            {/* <Box sx={{ textAlign: "left", mt: 1 }}></Box> */}
          </Container>
        </Paper>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Paper
          className="amount-box amount-100"
          onClick={() => {
            planAmountRef.current.value = 100;
            setCurrentPlanId(PLAN_100_ID);
            setMemberDetails({
              ...memberDetails,
              donate_amount: 100,
            });
          }}
        >
          <Container className="p-1" maxWidth="sm">
            <Box sx={{ pt: 0.5, pb: 0.5 }}>
              <Typography variant="h5" align="center">
                ₹100
              </Typography>
            </Box>
            {/* <Box sx={{ textAlign: "left", mt: 2 }}></Box> */}
          </Container>
        </Paper>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Paper
          className="amount-box amount-200"
          onClick={() => {
            planAmountRef.current.value = 200;
            setCurrentPlanId(PLAN_200_ID);
            setMemberDetails({
              ...memberDetails,
              donate_amount: 200,
            });
          }}
        >
          <Container className="p-1" maxWidth="sm">
            <Box sx={{ pt: 0.5, pb: 0.5 }}>
              <Typography variant="h5" align="center">
                ₹200
              </Typography>
            </Box>
            {/* <Box sx={{ textAlign: "left", mt: 2 }}></Box> */}
          </Container>
        </Paper>
      </Grid>
      <Grid item xs={6} lg={2}>
        <Paper
          className="amount-box amount-500"
          onClick={() => {
            planAmountRef.current.value = 500;
            setCurrentPlanId(PLAN_500_ID);
            setMemberDetails({
              ...memberDetails,
              donate_amount: 500,
            });
          }}
        >
          <Container className="p-1" maxWidth="sm">
            <Box sx={{ pt: 0.5, pb: 0.5 }}>
              <Typography variant="h5" align="center">
                ₹500
              </Typography>
            </Box>
            {/* <Box sx={{ textAlign: "left", mt: 2 }}></Box> */}
          </Container>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        {Number(memberDetails.donate_amount) >= 60 && (
          <Typography variant="body1" className="mt-2">
            ₹{memberDetails.donate_amount} (+ ₹100 सदस्यता ग्रहण शुल्क) अभी
            भुकतान करें और प्रति माह ₹{memberDetails.donate_amount} दान करें{" "}
          </Typography>
        )}

        <CheckoutButton
          styles={{ mt: "1rem", mb: "1rem" }}
          member={memberDetails}
          amount={memberDetails.donate_amount}
          onCreateOrder={handleCreateOrder}
          currentPlanId={currentPlanId}
          currentPayment={currentPayment}
          onPayment={handlePaymentUpdate}
        />
      </Grid>
    </Grid>
  );
};

export default StartMembership;
