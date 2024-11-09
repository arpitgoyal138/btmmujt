import React, { useEffect, useState } from "react";
import "./styles.css";
import LogoImage from "./../../../assets/images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import AuthAPI from "../../../api/firebase/AuthAPI";
import { auth } from "../../../firebase";
import Loader from "../../../components/loader/Loader";
import SignInForm from "../../../components/app/forms/sign-in";
import MembersAPI from "../../../api/firebase/MembersAPI";

const SignIn = () => {
  const authAPI = new AuthAPI();
  const membersAPI = new MembersAPI();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("Auth State Subscribed");
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
        membersAPI.getMemberById(userId).then((res) => {
          console.log("In Login ===> getMemberById RES:", res);
          if (
            !res.success &&
            user.phoneNumber !== null &&
            user.phoneNumber.length >= 10
          ) {
            // Fetch data from members table where contact_no = phoneNumber
            membersAPI
              .getMemberByPhoneNumber(user.phoneNumber.substring(3))
              .then((res) => {
                console.log("In Login ===> getMemberByPhoneNumber RES:", res);
                if (res.success && res.data.length === 1) {
                  const dataForNewRecord = {
                    id: user.uid,
                    payload: {
                      ...res.data[0],
                      role: ["Member"],
                      uid: user.uid,
                    },
                  };

                  delete dataForNewRecord.payload.createdAt;
                  // Create new record in members table with uid and fetched data
                  membersAPI.setMember(dataForNewRecord, true).then((res) => {
                    console.log("In Login ===> setMember RES:", res);
                    if (res.success) {
                      console.log(
                        "Delete record by unique_code:",
                        res.unique_code
                      );
                      setLoading(false);
                      setIsLoggedIn(true);
                      localStorage.setItem(
                        "user",
                        JSON.stringify(dataForNewRecord.payload)
                      );

                      // Delete old record from members table
                      membersAPI
                        .deleteMember(res.unique_code)
                        .then((res) => {
                          console.log("In Login ===> deleteMember RES:", res);
                          navigate("/member");
                        })
                        .catch((err) => {
                          console.log(
                            "Exception while deleteMember() API:",
                            err
                          );
                          navigate("/member");
                          return;
                        });
                    }
                  });
                } else {
                  console.log("you are not registered");
                  setLoading(false);
                  setIsLoggedIn(false);
                  localStorage.setItem("user", null);
                  handleLogout();
                  console.log("User signed out");
                  navigate("/login");
                  return;
                }
              });
          }
          console.log("res.data here", res.data);

          localStorage.setItem("user", JSON.stringify(res.data));
          if (
            res.data !== undefined &&
            res.data.role !== undefined &&
            res.data.role.includes("Admin")
          ) {
            console.log("Redirect to Admin");
            // Full Authority
            navigate("/admin");
          } else if (
            res.data !== undefined &&
            res.data.role !== undefined &&
            res.data.role.includes("Member")
          ) {
            setLoading(false);
            console.log("Redirect to Member");
            // Limited Authority
            navigate("/member");
          } else {
            setLoading(false);
            setIsLoggedIn(false);
            handleLogout();
            console.log("User signed out");
            navigate("/login");
          }
        });
      } else {
        setLoading(false);
        setIsLoggedIn(false);
        handleLogout();
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
                  <img
                    src={LogoImage}
                    alt="logo"
                    className="img-logo"
                    width="150"
                    height="150"
                  />
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
