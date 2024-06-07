import React, {useEffect, useRef, useState} from "react";
import AuthAPI from "../../../../api/firebase/AuthAPI";
import Collapse from "@mui/material/Collapse";
import {Alert} from "@mui/material";
const SignInForm = () => {
  const authAPI = new AuthAPI();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  // Handle the form submission event.
  const handleSubmit = (event) => {
    // Prevent the default form submit behavior
    event.preventDefault();
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
  };
  return (
    <main className="row m-auto justify-content-center">
      <form
        className="form-signin col-xs-12 col-sm-6 col-md-6 col-lg-4"
        style={{maxWidth: "100%"}}
        onSubmit={handleSubmit}
      >
        <Collapse in={errorMsg !== ""}>
          <Alert
            className="alert alert-danger"
            sx={{margin: "0 0 10px 0"}}
            severity="error"
          >
            {errorMsg}
          </Alert>
        </Collapse>
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

        <div className="form-floating">
          <input
            ref={emailRef}
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating">
          <input
            ref={passwordRef}
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

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
        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
      </form>
    </main>
  );
};

export default SignInForm;
