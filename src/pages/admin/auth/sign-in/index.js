import React, { useEffect, useState } from "react";
import "./styles.css";
import LogoImage from "./../../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import SignInForm from "../../../../components/app/forms/sign-in";
import { onAuthStateChanged } from "firebase/auth";
import AuthAPI from "../../../../api/firebase/AuthAPI";
import { auth } from "./../../../../firebase";
import Loader from "../../../../components/loader/Loader";

const SignIn = () => {
  const authAPI = new AuthAPI();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const subscribe = onAuthStateChanged(auth, (user) => {
      console.log("Logged In User :", user);

      if (user) {
        setIsLoggedIn(true);
        setLoading(true);
        const userId = user.uid || user.id;
        // console.log(
        //   "LOGIN PAGE ====> User signed in:",
        //   user,
        //   " userId:",
        //   userId
        // );

        authAPI.getUserDetailById(userId).then((res) => {
          console.log("In Login ===> getUserDetailById RES:", res);
          if (!res) {
            handleLogout();
            setLoading(false);
            setIsLoggedIn(false);
            console.log("User signed out");
            navigate("/login");
            return;
          }
          if (res.role === "Admin") {
            console.log("Redirect to Admin");
            // Full Authority
            navigate("/admin");
          } else if (res.role === "Staff") {
            // Limited Authority
            // redirect("/staff");
          }
        });
      } else {
        setLoading(false);
        setIsLoggedIn(false);
        console.log("User signed out");
      }
    });
    return subscribe;
  }, []);
  const handleLogout = () => {
    authAPI.signoutUser();
  };
  return (
    <>
      <div className="container-fluid align-items-center py-4 bg-body-tertiary">
        {loading && <Loader />}
        {!loading && (
          <div>
            <div className="row" style={{ marginBottom: "1rem" }}>
              <div className="col-12">
                <Link className="list-group-item" to="/">
                  <h1
                    className="display-5 text-center"
                    style={{ color: "green", marginTop: "1rem" }}
                  >
                    भारतीय ठेकेदार मिस्त्री मजदूर यूनियन <br />
                    <span style={{ fontSize: "0.65em" }}>
                      अन्तर्गत (B.T.M.M / जनकल्याण ट्रस्ट)
                    </span>
                  </h1>
                </Link>
              </div>
            </div>
            <div className="row text-center mb-3">
              <div className="col-12">
                <Link to="/">
                  <img src={LogoImage} alt="logo" width="100" height="100" />
                </Link>
              </div>
            </div>
            <SignInForm />
          </div>
        )}
      </div>
    </>
  );
};

export default SignIn;
