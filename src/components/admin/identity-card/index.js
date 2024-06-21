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

  return (
    <>
      <div ref={elementRef} className="main-box bg-white p-3 border">
        <div className="top-row d-flex justify-content-between ">
          <div className="col-logo text-center">
            <img src={LogoImage} alt="logo" className="m-1 logo" />
            <p className="m-1 small">Regd. no. 202400702011174</p>
          </div>
          <div className="col-detail text-center align-content-around p-1">
            <h6 className="text-success">कार्यालय</h6>
            <p className="small">
              शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा, सहारनपुर - 247001 (उo
              प्रo)
            </p>
            <div className="col-12 small">
              <img
                src={whatsappLogo}
                style={{ height: "22px", width: "22px" }}
                className="me-2"
              ></img>
              +91-9720060562
              <br />
              <img
                src={callUpLogo}
                style={{ height: "20px", width: "20px" }}
                className="me-1"
              ></img>{" "}
              +91-9720060246
            </div>
          </div>
          <div className="col-user-photo text-end p-1">
            <img
              src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
              alt="user photo"
              className="m-1 border user-photo"
            />
          </div>
        </div>
        <div className="row text-center mb-3">
          <h2 className="mt-3 mb-2 fw-semibold text-success">
            भारतीय ठेकेदार मिस्त्री मजदूर यूनियन
          </h2>
          <h4 className="p-1 text-bg-danger mt-2">Identity Card</h4>
        </div>
        <div className="p-3 pt-2 row-user-detail">
          <p className="row">
            <label className="user-detail-label">क्रम संख्या:</label>
            <label className="user-detail-p">{memberData.unique_code}</label>
          </p>
          <p className="row">
            <label className="user-detail-label">नाम:</label>
            <label className="user-detail-p">{memberData.name}</label>
          </p>
          <p className="row">
            <label className="user-detail-label">पिता का नाम:</label>
            <label className="user-detail-p">{memberData.fathers_name}</label>
          </p>
          <p className="row">
            <label className="user-detail-label">स्थायी पता:</label>
            <label className="user-detail-p">{memberData.address}</label>
          </p>
          <p className="row">
            <div className="col-6">
              <label className="user-detail-label" style={{ width: "39%" }}>
                मोबाइल नंo:
              </label>
              <label className="user-detail-p ps-2" style={{ width: "60%" }}>
                {memberData.contact_no}
              </label>
            </div>
            <div className="col-6 pe-0">
              <label className="user-detail-label" style={{ width: "29%" }}>
                अन्य नंo:
              </label>
              <label className="user-detail-p ps-2" style={{ width: "67%" }}>
                {memberData.alternate_contact_no}
              </label>
            </div>
          </p>
          <p className="row">
            <label className="user-detail-label">पद का नाम:</label>
            <label className="user-detail-p"></label>
          </p>
        </div>
        <div className="bottom-row mt-5 pt-2">
          <p className="text-end">अध्यक्ष/पदाधिकारी</p>
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={htmlToImageConvert}>
        Download ID Card
      </button>
    </>
  );
};

export default IdentityCard;
