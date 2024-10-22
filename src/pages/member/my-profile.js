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
import NewMemberForm from "../../components/app/forms/new-member";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const MyProfile = ({ forMember = null }) => {
  //console.log("forMember: ", forMember);
  const [currentUser, setCurrentUser] = useState(null);
  const [subscriptionDetail, setSubscriptionDetail] = useState(null);
  const [startSubscription, setStartSubscription] = useState(false);
  const [loading, setLoading] = useState(false);

  // For snackbar
  const [snackbarState, setSnackbarState] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [openDialog, setOpenDialog] = useState(false);

  //console.log("current user: ", currentUser);
  let user = useOutletContext();

  //console.log("user: ", user);
  if (user === null || user === undefined) {
    user = JSON.parse(localStorage.getItem("user"));
  }
  if (forMember !== null) {
    user = forMember;
  }
  // Fetch subscription detail from razorpay
  useEffect(() => {
    if (forMember !== null) {
      setCurrentUser(forMember);
    } else {
      setCurrentUser(user);
    }

    if (user.payment && user.payment.id && user.payment.id !== "") {
      //console.log("user.payments", user.payment);
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
    <Container>
      <Box component="div" sx={{ display: { xs: "none", sm: "block" } }}>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h4"
          component="h4"
        >
          My Profile
        </Typography>
      </Box>
      <Grid container spacing={2} className="justify-content-evenly">
        <Grid item xs={12} lg={8} xl={6}>
          <NewMemberForm memberData={currentUser} fromMyProfile={true} />
        </Grid>
      </Grid>

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
            agreeButtonText="सदस्यता रोकें"
            cancelButtonText="सदस्यता जारी रखें"
            title="कृपया पुष्टि करें"
            description={"आप सदस्यता के लाभों का उपयोग नहीं कर पाएंगे."}
            cancelButtonDanger={true}
          />
        </Grid>
      </Grid>
      {loading && <Loader />}
    </Container>
  );
};

export default MyProfile;
