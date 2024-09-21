/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Snackbar,
  Typography,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Container,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { useNavigate, useOutletContext } from "react-router-dom";
import DonationsReceivedAPI from "../../api/firebase/DonationsReceivedAPI";
import Loader from "../../components/loader/Loader";
import AlertDialogSlide from "../../components/common/Dialog/AlertDialogSlide";
import StartMembership from "../../components/app/start-membership/StartMembership";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const MySubscription = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [subscriptionDetail, setSubscriptionDetail] = useState(null);
  const [startSubscription, setStartSubscription] = useState(false);
  const [loading, setLoading] = useState(false);

  // For snackbar
  const [snackbarState, setSnackbarState] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [openDialog, setOpenDialog] = useState(false);

  console.log("current user: ", currentUser);
  let user = useOutletContext();

  console.log("user: ", user);
  if (user === null || user === undefined) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  // Fetch subscription detail from razorpay
  useEffect(() => {
    setCurrentUser(user);
    if (user.payment && user.payment.id && user.payment.id !== "") {
      console.log("user.payments", user.payment);
      fetchSubscription(user.payment.id);
    } else {
      setStartSubscription(true);
    }
  }, []);
  const showSnackbar = () => {
    setSnackbarState(true);
  };
  const hideSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState(false);
  };
  const fetchSubscription = async (subscription_id) => {
    setLoading(true);
    const url = "https://razorpayapi-ryltdekpdq-uc.a.run.app/fetchSubscription";
    const options = {
      subscriptionId: subscription_id,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "Resp: fetchSubscription -> data from razorpay API:",
            data
          );
          setSubscriptionDetail({ ...data });
          setLoading(false);
        });
    } catch (error) {
      console.log("Server Error:", error);
      setLoading(false);
    }
  };
  const unixTimeToDate = (unixTime) => {
    const date = new Date(unixTime * 1000);
    return date.toLocaleDateString();
  };
  const handlePauseClick = async () => {
    setLoading(true);
    const url = "https://razorpayapi-ryltdekpdq-uc.a.run.app/pauseSubscription";
    const options = {
      subscriptionId: subscriptionDetail.id,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "Resp: pauseSubscription -> data from razorpay API:",
            data
          );
          setSubscriptionDetail({ ...data });
          setLoading(false);
        });
    } catch (error) {
      console.log("Server Error:", error);
      setLoading(false);
    }
  };
  const handleResumeClick = async () => {
    setLoading(true);
    const url =
      "https://razorpayapi-ryltdekpdq-uc.a.run.app/resumeSubscription";
    const options = {
      subscriptionId: subscriptionDetail.id,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "Resp: resumeSubscription -> data from razorpay API:",
            data
          );
          setSubscriptionDetail({ ...data });
          setLoading(false);
        });
    } catch (error) {
      console.log("Server Error:", error);
      setLoading(false);
    }
  };
  const handleCancelClick = async () => {
    setLoading(true);
    const url =
      "https://razorpayapi-ryltdekpdq-uc.a.run.app/cancelSubscription";
    const options = {
      subscriptionId: subscriptionDetail.id,
      method: process.env.REACT_APP_PAYMENT_METHOD, //LIVE or TEST
    };
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(
            "Resp: resumeSubscription -> data from razorpay API:",
            data
          );
          setSubscriptionDetail({ ...data });
          setLoading(false);
        });
    } catch (error) {
      console.log("Server Error:", error);
      setLoading(false);
    }
  };
  const handleAgreeDialog = () => {
    handlePauseClick();
    setOpenDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <Container maxWidth="lg">
      <Box component="div" sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          My Subscription
        </Typography>
      </Box>
      {!startSubscription && subscriptionDetail && (
        <Grid container spacing={2} maxWidth="sm" justifyContent="center">
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Plan
                    </TableCell>
                    <TableCell align="right">
                      Monthly Amount - {user.payment.plan_amount} <br></br>
                      <span className="text-secondary">
                        Billed Every 1 month
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Link
                    </TableCell>
                    <TableCell align="right">
                      <a
                        href={subscriptionDetail.short_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {subscriptionDetail.short_url}
                      </a>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Recurring Billing
                    </TableCell>
                    <TableCell align="right">
                      ₹{user.payment.plan_amount}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Status
                    </TableCell>
                    <TableCell align="right">
                      {subscriptionDetail.status === "active" && (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            width: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <span className="p-1 rounded-1 small text-bg-success text-light ps-2 pe-2 fw-bold">
                            Active
                          </span>
                          <Button
                            variant="outlined"
                            // color="warning"
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpenDialog(true);
                            }}
                          >
                            Pause
                          </Button>
                        </Stack>
                      )}

                      {subscriptionDetail.status === "paused" && (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            width: "100%",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <span className="p-1 rounded-1 small text-bg-warning text-light ps-2 pe-2 fw-bold">
                            Paused
                          </span>
                          <Button
                            variant="outlined"
                            // color="sucecss"
                            size="small"
                            onClick={(e) => {
                              e.preventDefault();
                              handleResumeClick();
                            }}
                          >
                            Resume
                          </Button>
                        </Stack>
                      )}
                      {subscriptionDetail.status === "cancelled" && (
                        <span className="p-1 rounded-1 small text-bg-danger text-light ps-2 pe-2 fw-bold">
                          Cancelled
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Payment method
                    </TableCell>
                    <TableCell align="right" className="text-capitalize">
                      {subscriptionDetail.payment_method}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      Created at
                    </TableCell>
                    <TableCell align="right">
                      {unixTimeToDate(subscriptionDetail.start_at)}
                    </TableCell>
                  </TableRow>
                  {subscriptionDetail.status === "active" && (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        Next due on
                      </TableCell>
                      <TableCell align="right">
                        {unixTimeToDate(subscriptionDetail.charge_at)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
      {startSubscription && (
        <Grid container spacing={2} className="justify-content-evenly">
          <Grid item xs={12}>
            <Typography variant="h4" align="center" className="mt-3 mb-2">
              Start Donation
            </Typography>
          </Grid>
          <Grid item xs={12} lg={6} xl={6}>
            <StartMembership
              memberDetails={currentUser}
              setMemberDetails={setCurrentUser}
              setLoading={setLoading}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item>
          <Snackbar
            open={snackbarState}
            autoHideDuration={3000}
            onClose={hideSnackbar}
          >
            <Alert
              onClose={hideSnackbar}
              severity={message.type}
              sx={{ width: "100%" }}
            >
              {message.text}
            </Alert>
          </Snackbar>
          <AlertDialogSlide
            handleOnAgree={handleAgreeDialog}
            handleOnClose={handleCloseDialog}
            isOpen={openDialog}
            agreeButtonText="Pause Membership"
            title="Pause subscription"
            description={"You will not be able to use benefits of membership."}
          />
        </Grid>
      </Grid>
      {loading && <Loader />}
    </Container>
  );
};

export default MySubscription;
