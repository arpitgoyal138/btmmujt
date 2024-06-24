import React, { useRef, useEffect, useState } from "react";
import "./styles.css";
import { toPng } from "html-to-image";
import LogoImage from "../../../assets/images/logo.png";
import whatsappLogo from "../../../assets/images/whatsapp-logo.webp";
import callUpLogo from "../../../assets/images/call-up-logo.png";
const IdentityCard = ({ memberData = null }) => {
  const elementRef = useRef(null);
  const htmlToImageConvert = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "id-card_" + memberData.unique_code + ".png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const printIDCard = () => {
    window.print();
  };
  return (
    <>
      <div
        ref={elementRef}
        className="main-box bg-white p-1"
        id="identity-card"
      >
        <div className="top-row d-flex justify-content-between p-1">
          <div className="col-logo text-center">
            <img src={LogoImage} alt="logo" className=" m-0 logo" />
            <p
              className="mt-1 mb-1 small text-start"
              style={{ fontSize: "0.75rem" }}
            >
              Regd. no. 202400702011174
            </p>
          </div>

          <div className="col-detail text-center align-content-around p-0">
            <div className="col-user-photo text-end">
              <img
                src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
                alt="user photo"
                className="m-0 border user-photo"
              />
            </div>
            <div className="text-center" style={{ marginTop: "-1rem" }}>
              <h6
                className="text-decoration-underline text-success"
                style={{ fontSize: "0.75rem", marginBottom: "5px" }}
              >
                कार्यालय
              </h6>
              <p
                className="mb-0"
                style={{
                  fontSize: "0.75rem",
                  color: "brown",
                  fontWeight: "500",
                }}
              >
                शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा, सहारनपुर - 247001 (उo
                प्रo)
              </p>
              <div
                className="col-12 small text-center mt-1 mb-1"
                style={{ fontSize: "0.75rem" }}
              >
                <img
                  src={whatsappLogo}
                  style={{
                    height: "18px",
                    width: "18px",
                    marginTop: "-2px",
                    marginRight: "4px",
                  }}
                ></img>
                9720060562 , 9720060246
              </div>
            </div>
          </div>
        </div>

        <div className="row text-center mb-3">
          <h4 className="mt-2 mb-0 fw-semibold text-success">
            {process.env.REACT_APP_NAME}
          </h4>

          <span
            style={{
              display: "block",
              fontSize: "0.75em",
            }}
          >
            अन्तर्गत
          </span>
          <span
            className="text-success"
            style={{ display: "block", fontSize: "0.85em", fontWeight: "bold" }}
          >
            (B.T.M.M / जनकल्याण ट्रस्ट)
          </span>

          <h5 className="p-1 mt-1 mb-1" style={{ color: "brown" }}>
            Identity Card
          </h5>
        </div>
        <div className="p-2 pt-0 row-user-detail">
          <p className="row">
            <label className="user-detail-label">क्रम संख्या:</label>
            <label className="user-detail-p">{memberData.unique_code}</label>
          </p>
          <p className="row">
            <label className="user-detail-label text-success">नाम:</label>
            <label className="user-detail-p text-success">
              {memberData.name}
            </label>
          </p>
          <p className="row">
            <label className="user-detail-label">पिता का नाम:</label>
            <label className="user-detail-p">{memberData.fathers_name}</label>
          </p>
          <p className="row">
            <label className="user-detail-label" style={{ color: "brown" }}>
              स्थायी पता:
            </label>
            <label className="user-detail-p" style={{ color: "brown" }}>
              {memberData.address}, {memberData.district}, {memberData.state}
            </label>
          </p>
          <p className="row">
            <label className="user-detail-label">मोबाइल नंo:</label>
            <label className="user-detail-p">
              {memberData.contact_no}, {memberData.alternate_contact_no}
            </label>
          </p>

          <p className="row">
            <label className="user-detail-label text-success">पद का नाम:</label>
            <label className="user-detail-p text-success"></label>
          </p>
        </div>
        <div className="bottom-row mt-1 pt-2">
          <p className="text-end">अध्यक्ष/पदाधिकारी</p>
        </div>
      </div>
      {/* <button className="btn btn-primary mt-3" onClick={htmlToImageConvert}>
        Download ID Card
      </button> */}
      <button className="btn btn-primary mt-3" onClick={printIDCard}>
        Print ID Card
      </button>
    </>
  );
};

export default IdentityCard;
