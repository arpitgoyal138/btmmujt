import React, { useState, useEffect } from "react";
import logoImage from "./../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { Box, Fade, Modal } from "@mui/material";
import DonateNowForm from "../forms/donate-now";
import { styles } from "./styles";
import MembersAPI from "../../../api/firebase/MembersAPI";
const navItems = [
  // {title: "उद्देश्य जानें", url: "/objectives"},
  { title: "Objectives", url: "/objectives" },
  // { title: "Privacy Policy", url: "/privacy-policy" },
  // { title: "Terms and Conditions", url: "/terms-and-conditions" },
  // { title: "Refund or Cancellations", url: "/refund-and-cancellations" },
  { title: "Login", url: "/login" },
  // {title: "संपर्क करें", url: "/contactUs"},
];

function DrawerAppBar(props) {
  // For Add Donation Modal
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const [membersArr, setMembersArr] = useState([]);
  const membersAPI = new MembersAPI();
  const showAddDonationModal = () => {
    setOpenDonationModal(true);
  };
  const hideAddDonationModal = () => {
    // console.log("close modal");
    setOpenDonationModal(false);
  };
  useEffect(() => {
    const allMembers = membersAPI.getMembers();
    allMembers.then((resData) => {
      // console.log("received allMembers:", resData);
      if (!resData) {
        return;
      }
      setMembersArr(resData.data);
      // console.log("Done fetching all members: ", resData.data);
    });
  }, []);
  return (
    <>
      <nav className="navbar sticky-top navbar-expand-sm bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {/* logo image */}
            <img
              src={logoImage}
              alt="भारतीय ठेकेदार मिस्त्री मजदूर यूनियन जनकल्याण ट्रस्ट"
              height="40"
            />
            {/* भारतीय ठेकेदार मिस्त्री मजदूर यूनियन जनकल्याण ट्रस्ट */}
          </Link>
          <button
            className="btn btn-success mt-0 d-block d-sm-none"
            onClick={() => {
              showAddDonationModal();
            }}
          >
            Donate Now
          </button>
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={openDonationModal}
            onClose={hideAddDonationModal}
            closeAfterTransition
          >
            <Fade in={openDonationModal}>
              <Box sx={styles.boxStyle}>
                <DonateNowForm
                  membersArr={membersArr}
                  hideModal={hideAddDonationModal}
                />
              </Box>
            </Fade>
          </Modal>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {navItems.map((item, index) => {
                return (
                  <li key={index} className="nav-item">
                    <Link
                      className="nav-link"
                      aria-current="page"
                      to={item.url}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
              <button
                className="btn btn-success ms-4 mt-0 d-none d-sm-block"
                onClick={() => {
                  showAddDonationModal();
                }}
              >
                Donate Now
              </button>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default DrawerAppBar;
