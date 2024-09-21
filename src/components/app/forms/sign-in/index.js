import React, { useEffect, useRef, useState } from "react";
import AuthAPI from "../../../../api/firebase/AuthAPI";
import Collapse from "@mui/material/Collapse";
import {
  Alert,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Slide,
  Typography,
} from "@mui/material";
import Loader from "../../../loader/Loader";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IndiaFlag from "./../../../../assets/images/india-flag.png";
import EmailIcon from "@mui/icons-material/Email";
import PasswordIcon from "@mui/icons-material/Password";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  getAuth,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../../../firebase";
import MembersAPI from "../../../../api/firebase/MembersAPI";

const SignInForm = () => {
  //auth.settings.appVerificationDisabledForTesting = true;
  const authAPI = new AuthAPI();
  const membersAPI = new MembersAPI();
  // References
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [mobileNum, setMobileNum] = useState(null);
  const [otpValue, setOtpValue] = useState(null);
  const submitBtnRef = useRef(null);
  // States
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [loginWithMobile, setLoginWithMobile] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verifyButtonClicked, setVerifyButtonClicked] = useState(false);
  const [submitButtonClicked, setSubmitButtonClicked] = useState(false);
  const [buttonText, setButtonText] = useState("पुष्टि कोड भेजें");
  const [verifyButtonText, setVerifyButtonText] = useState("सत्यापित करें");
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("email");
  const [alertMsg, setAlertMsg] = useState({
    type: "",
    title: "",
    show: false,
  });
  const [userData, setUserData] = useState(null);
  const [userUid, setUserUid] = useState(null);
  //

  useEffect(() => {
    if (!otpSent) {
      setOtpTimer(0);
      window.otpTimer = 0;
      return;
    }
    const intervalId = setInterval(() => {
      // console.log(
      //   "OTPSent:",
      //   otpSent,
      //   "__OTP Timer:",
      //   otpTimer,
      //   " verifyButtonClicked:",
      //   verifyButtonClicked
      // );
      if (otpTimer > 0) {
        //console.log("here verifyButtonClicked: ", verifyButtonClicked);
        if (!verifyButtonClicked) {
          //submitBtnRef.current.disabled = true;
          console.log("set button text: ");
          //setButtonText("पुनः पुष्टि कोड भेजें (" + otpTimer + "s)");
        }

        setOtpTimer(otpTimer - 1);
        window.otpTimer = otpTimer - 1;
      } else {
        //submitBtnRef.current.disabled = false;
        setSubmitButtonClicked(false);
        window.buttonClicked = false;
        setButtonText("पुष्टि कोड भेजें");
        clearInterval(intervalId);
        window.otpTimer = 0;
        window.otpSent = false;
      }
    }, 1000); // Update every 1 second

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [otpSent, otpTimer]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // Handle the form submission event.
  const handleSubmit = (event) => {
    setAlertMsg({ type: "", title: "", show: false });
    if ((otpSent && otpTimer !== 0) || window.buttonClicked) {
      return;
    }

    if (mobileNum !== null && mobileNum.length === 10) {
      setLoading(true);
      membersAPI.getMemberByPhoneNumber(mobileNum).then((res) => {
        if (res.success && res.data.length === 1) {
          window.buttonClicked = true;
          setButtonText("पुष्टि कोड भेजा जा रहा है...");
          setSubmitButtonClicked(true);
          onSendOTP();
          return;
        } else {
          setLoading(false);
          const alertOptions = {
            type: "warning",
            title: "यह मोबाइल नंबर रजिस्टर्ड नहीं है |",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          return;
        }
      });
    } else {
      // Get the values entered by the user.
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      console.log("email: ", email);
      console.log("password: ", password);
      // Call the sign in method with these details.
      authAPI
        .signInWithEmailPassword(email, password)
        .then((res) => {
          console.log("Res from API:", res);
          if (!res.status) {
            let errMsg = res.error.message;
            if (
              res.error.code === "auth/wrong-password" ||
              res.error.code === "auth/user-not-found" ||
              res.error.code === "auth/invalid-login-credentials" ||
              res.error.code === "auth/invalid-credential"
            ) {
              errMsg = "Invalid Login Credentials";
            } else if (res.error.code === "auth/invalid-email") {
              errMsg = "Invalid Email Id";
            }
            setErrorMsg(errMsg);
          }
          if (res.status) {
            authAPI.getUserProfile();
          }
        })
        .catch((error) => {
          let errorCode = error.code;
          let errorMessage = error.message;
          alert(`Error ${errorCode}: ${errorMessage}`);
        });
    }
    // Prevent the default form submit behavior
  };
  async function handleSignIn() {
    try {
      const WindowOtpSent = window.otpSent;
      const WindowOtpTimer = window.otpTimer;
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = "+91" + mobileNum;
      console.log(
        "Handle Sign in with OTP with verifier:",
        appVerifier,
        " WindowOtpSent:",
        WindowOtpSent,
        " WindowOtpTimer:",
        WindowOtpTimer
      );
      if (WindowOtpSent && WindowOtpTimer !== 0) {
        return;
      }

      const auth = getAuth();
      // const confirmationResult = await signInWithPhoneNumber(
      //   auth,
      //   phoneNumber,
      //   appVerifier
      // );
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          setLoading(false);
          console.log("Confirmation Result in:", confirmationResult);
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setOtpSent(true);
          setOtpTimer(60);
          window.otpSent = true;
          window.otpTimer = 60;
          setButtonText("पुष्टि कोड सत्यापित करें");
          // ...
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error sending OTP:", error);
          // Error; SMS not sent
          // window.recaptchaVerifier.render().then(function (widgetId) {
          //   grecaptcha.reset(widgetId);
          // });
          const alertOptions = {
            type: "danger",
            title: "कुछ समय पश्चात प्रयास करें ",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          setOtpSent(false);
          window.otpSent = false;
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setButtonText("पुष्टि कोड भेजें");
          // ...
        });
      console.log("confirmationResult here:", window.confirmationResult);

      // setOtpSent(true);
      // setOtpTimer(60);
    } catch (error) {
      setLoading(false);
      console.error("Error sending OTP:", error);
      const alertOptions = {
        type: "danger",
        title: "कुछ समय पश्चात प्रयास करें",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setOtpSent(false);
      window.otpSent = false;
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
      setButtonText("पुष्टि कोड भेजें");
    }
  }
  const onSendOTP = async () => {
    try {
      setAlertMsg({ type: "", title: "", show: false });
      console.log("OTP भेजें");
      //submitBtnRef.current.disabled = true;
      // const appVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
      //   size: "invisible",
      //   callback: (response) => {
      //     console.log("response:", response);
      //     handleSignIn(appVerifier);
      //   },
      // });
      // appVerifier.verify();
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
        callback: (response) => {
          //submitBtnRef.current.disabled = true;
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("response:", response);
          if (window.otpSent && window.otpTimer !== 0) {
            return;
          }
          handleSignIn();
        },
      });
      window.recaptchaVerifier.verify();
    } catch (err) {
      console.log("err:", err);
      const alertOptions = {
        type: "warning",
        title: "पुष्टि कोड भेजने में विफल",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setOtpSent(false);
      window.otpSent = false;
      window.buttonClicked = false;
      setSubmitButtonClicked(false);
      setOtpTimer(0);
      setButtonText("पुष्टि कोड भेजें");
    }
  };
  const verifyOTP = async () => {
    try {
      setLoading(true);
      setVerifyButtonClicked(true);
      console.log("पुष्टि करें - ", otpValue);

      window.confirmationResult
        .confirm(otpValue)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          setUserUid(user.uid);
          console.log("userCredential after Login:", user);
          setOtpSent(false);
          window.otpSent = false;
          window.buttonClicked = false;
          setSubmitButtonClicked(false);
          setOtpTimer(0);
          setLoading(false);
          //fetchUserData(user.uid);
          // Submit Form Details
          //formValuesIntoDB();
          // ...
        })
        .catch((error) => {
          setLoading(false);
          // User couldn't sign in (bad verification code?)
          console.log("Invalid OTP:", error);
          const alertOptions = {
            type: "warning",
            title: "पुष्टि कोड अमान्य है | कृपया पुनः दर्ज करें |",
            show: true,
          };
          setAlertMsg({ ...alertOptions });
          setVerifyButtonClicked(false);
          setVerifyButtonText("सत्यापित करें");
          // ...
        });

      //Clear form values
    } catch (err) {
      console.log("err:", err);
      const alertOptions = {
        type: "warning",
        title: "पुष्टि कोड अमान्य है | कृपया पुनः दर्ज करें |",
        show: true,
      };
      setAlertMsg({ ...alertOptions });
      setVerifyButtonClicked(false);
      setVerifyButtonText("सत्यापित करें");
      // Invalid OTP
    }
  };
  const fetchUserData = async (userUid) => {
    try {
      console.log("fetchUserData using membersAPI getMemberById:", userUid);
      const response = await membersAPI.getMemberById(userUid);
      console.log("response:", response);
      if (response) {
        setUserData(response.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };
  return (
    <main className="row m-auto justify-content-center">
      {loading && <Loader fullHeight={false} />}
      <form
        className="form-signin col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-3"
        style={{ maxWidth: "100%" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h3 className="h4 mb-5 fw-normal text-center">
          Sign in using mobile number
        </h3>
        <Collapse in={errorMsg !== ""}>
          <Alert
            className="alert alert-danger"
            sx={{ margin: "0 0 10px 0" }}
            severity="error"
          >
            {errorMsg}
          </Alert>
        </Collapse>
        {/* <Grid
          container
          direction="row"
          spacing={2}
          sx={{
            mt: 1,
            mb: 2,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        > */}
        {/* <Tabs
          value={value}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
          sx={{ mt: 1, mb: 2, width: "100%" }}
        >
          <Tab
            value="email"
            label="Email Id"
            onClick={() => {
              setLoginWithEmail(true);
              setLoginWithMobile(false);
            }}
            sx={{ width: "50%" }}
          />
          <Tab
            value="mobile"
            label="Mobile Number"
            onClick={() => {
              setLoginWithMobile(true);
              setLoginWithEmail(false);
            }}
            sx={{ width: "50%" }}
          />
        </Tabs> */}
        {/* </Grid> */}

        <Slide direction="left" in={loginWithEmail} mountOnEnter unmountOnExit>
          <Grid container direction={"column"} spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <Input
                  type="email"
                  inputRef={emailRef}
                  id="input-email"
                  placeholder="Email Id"
                  startAdornment={
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <Input
                  type={showPassword ? "text" : "password"}
                  inputRef={passwordRef}
                  id="input-password"
                  placeholder="Password"
                  startAdornment={
                    <InputAdornment position="start">
                      <PasswordIcon />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <div className="form-check text-start my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="remember-me"
                  id="flexCheckDefault"
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  Remember me
                </label>
              </div>
            </Grid>
            <Grid item xs={12}>
              <button
                className="btn btn-primary w-100 py-2"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                Sign in
              </button>
            </Grid>
          </Grid>
        </Slide>
        <Slide
          direction="left"
          in={loginWithMobile && !otpSent}
          mountOnEnter
          unmountOnExit
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <Input
                  type="text"
                  id="input-mobile"
                  startAdornment={
                    <InputAdornment position="start">
                      <img src={IndiaFlag} alt="india flag" height={24} />
                    </InputAdornment>
                  }
                  placeholder="Mobile Number"
                  onKeyDown={(evt) => {
                    let ASCIICode = evt.key.charCodeAt(0);
                    let isValidKey =
                      evt.key === "Backspace" ||
                      evt.key === "Delete" ||
                      evt.key === "ArrowLeft" ||
                      evt.key === "ArrowRight" ||
                      evt.key === "ArrowUp" ||
                      evt.key === "ArrowDown";
                    //console.log("ASCIICode:", ASCIICode);
                    if (evt.target.value.length === 10 && !isValidKey) {
                      evt.preventDefault();
                      return false;
                    }
                    if (
                      ASCIICode > 31 &&
                      !isValidKey &&
                      (ASCIICode < 48 || ASCIICode > 57)
                    ) {
                      evt.preventDefault();
                      return false;
                    }
                  }}
                  onChange={(e) => {
                    setMobileNum(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <button
                className="btn btn-primary w-100 py-2"
                id="sign-in-button"
                type="submit"
                disabled={mobileNum == null || mobileNum.length < 10}
              >
                {buttonText}
              </button>
            </Grid>
          </Grid>
        </Slide>
        <Slide
          direction="left"
          in={loginWithMobile && otpSent}
          mountOnEnter
          unmountOnExit
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                className="text-center"
                sx={{ color: "darkgreen" }}
              >
                +91-{mobileNum} नंबर पर पुष्टि कोड भेजा गया है
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="standard" fullWidth>
                <Input
                  type="text"
                  id="input-otp"
                  placeholder={"पुष्टि कोड दर्ज करें"}
                  onKeyDown={(evt) => {
                    let ASCIICode = evt.key.charCodeAt(0);
                    let isValidKey =
                      evt.key === "Backspace" ||
                      evt.key === "Delete" ||
                      evt.key === "ArrowLeft" ||
                      evt.key === "ArrowRight" ||
                      evt.key === "ArrowUp" ||
                      evt.key === "ArrowDown";
                    if (evt.target.value.length === 6 && !isValidKey) {
                      evt.preventDefault();
                      return false;
                    }
                    // console.log("ASCIICode:", ASCIICode);
                    if (
                      ASCIICode > 31 &&
                      !isValidKey &&
                      (ASCIICode < 48 || ASCIICode > 57)
                    ) {
                      evt.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    setOtpValue(e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <button
                className="btn btn-primary w-100 py-2"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setOtpSent(false);
                  setAlertMsg({ type: "", title: "", show: false });
                  setMobileNum(null);
                }}
                disabled={otpSent && otpTimer > 0}
              >
                पुनः भेजें {otpTimer > 0 ? `(${otpTimer}s)` : ""}
              </button>
            </Grid>
            <Grid item xs={6}>
              <button
                className="btn btn-primary w-100 py-2"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  //setVerifyButtonText("सत्यापित किया जा रहा है...");
                  verifyOTP();
                }}
              >
                {verifyButtonText}
              </button>
            </Grid>
          </Grid>
        </Slide>
        <div
          className={`mt-3 align-items-center justify-content-between alert alert-${
            alertMsg.type
          } alert-dissmissible fade ${
            alertMsg.show ? "d-flex show" : "d-none"
          }`}
          role="alert"
        >
          {alertMsg.title}
          <button
            type="button"
            className="btn btn-close"
            aria-label="Close"
            onClick={() => {
              setAlertMsg({ type: "", title: "", show: false });
            }}
          ></button>
        </div>
      </form>
    </main>
  );
};

export default SignInForm;
