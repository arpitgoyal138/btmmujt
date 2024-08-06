import { ArrowBack } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import { useNavigate, useParams } from "react-router-dom";
import MembersAPI from "../../../api/firebase/MembersAPI";
import NewMemberForm from "../../../components/app/forms/new-member";
import LogoImage from "../../../assets/images/logo.png";
import whatsappLogo from "../../../assets/images/whatsapp-logo.webp";
import adhyakshPhoto from "../../../assets/images/adyaksh-photo-cropped.png";
import qrCodeImg from "../../../assets/images/qr-code.png";
const MemberDetail = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const membersAPI = new MembersAPI();

  //console.log("memberId:", memberId);
  const printIDCard = () => {
    var divContents = document.getElementById("print-id-card").innerHTML;
    var a = window.open("", "");
    a.document.write("<html>");
    a.document.write("<body>");
    a.document.write(divContents);
    a.document.write("</body></html>");
    var link = a.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "./../../../bs.css");
    var sheet = a.document.createElement("style");
    sheet.innerHTML = `
      .name {
  color: red;
}
.user-photo {
  height: 90px;
  width: 80px;
}
.logo {
  height: 100px;
  width: 100px;
}
.main-box {
  width: 380px;
  border: solid 3px lightcoral;
}
.user-detail-p {
  border-bottom: 1px dotted;
  width: 70%;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 0.9rem;
}

.user-detail-label {
  width: 28%;
  font-weight: 500;
  padding-left: 8px;
  padding-right: 5px;
  font-size: 0.9rem;
}
.adhyaksh-photo {
  width: 135px;
  height: 160px;
}
.detail-row {
  margin-top: 6px;
}
.id-card-back-label-name {
  font-size: 0.85rem;
  display: block;
  color: darkred;
  margin-top: -2px;
}
      @media print {
        @page {
          margin-left: 0.1in;
          margin-right: 0.1in;
          margin-top: 0.1in;
          margin-bottom: 0;
        }
      }`;
    a.document.body.appendChild(sheet);
    a.document.head.appendChild(link);
    a.document.close();
    setTimeout(() => {
      a.print();
    }, 500);
  };
  const printAppointmentLetter = () => {
    var divContents = document.getElementById(
      "print-appointment-letter"
    ).innerHTML;
    var a = window.open("", "");
    a.document.write("<html>");
    a.document.write("<body>");
    a.document.write(divContents);
    a.document.write("</body></html>");
    var link = a.document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "./../../../bs.css");
    var sheet = a.document.createElement("style");
    sheet.innerHTML = `
      .user-photo-al {
  height: 170px;
  width: 170px;
}
.logo-al {
  height: 140px;
  width: 140px;
}
.main-box-al {
  width: 776px;
  border: solid 3px lightcoral;
}

.detail-row {
  margin-top: 6px;
}
.detail-span {
  border-bottom: 1px dotted gray;
  color: darkgreen;
  font-weight: 600;
}
.qr-photo {
  height: 150px;
  width: 150px;
}
.adhyaksh-sign-box-al {
  padding-top: 7rem;
  width: 40%;
  float: inline-start;
  float: right;
  margin-top: -10rem;
  margin-right: 5px;
}

      @media print {
        @page {
          margin-left: 0.1in;
          margin-right: 0.1in;
          margin-top: 0.1in;
          margin-bottom: 0;
        }
      }`;
    a.document.body.appendChild(sheet);
    a.document.head.appendChild(link);
    a.document.close();
    setTimeout(() => {
      a.print();
    }, 500);
  };
  useEffect(() => {
    if (memberData === null) {
      membersAPI
        .getMemberById(memberId)
        .then((res) => {
          // console.log("member data: ", res.data);
          setMemberData(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
          setMemberData(null);
        });
    }
  }, [memberId]);
  const style = {
    position: "absolute",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 10,
    p: 1,
  };
  return (
    <>
      {memberData && (
        <div id="print-id-card">
          <div className="d-flex bg-white" id="print-media">
            <div className="main-box front me-2 p-1">
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
                        color: "firebrick",
                        fontWeight: "500",
                      }}
                    >
                      शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा, सहारनपुर -
                      247001 (उo प्रo)
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

              <div className="text-center">
                <h4 className="mb-0 fw-semibold text-success">
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
                  style={{
                    display: "block",
                    fontSize: "0.85em",
                    fontWeight: "bold",
                  }}
                >
                  (B.T.M.M / जनकल्याण ट्रस्ट)
                </span>

                <h5 className="mt-2 mb-2" style={{ color: "firebrick" }}>
                  Identity Card
                </h5>
              </div>
              <div className="p-2 pt-0 row-user-detail">
                <div className="row detail-row">
                  <label className="user-detail-label">क्रम संख्या:</label>
                  <label className="user-detail-p">
                    {memberData.unique_code}
                  </label>
                </div>
                <div className="row detail-row">
                  <label className="user-detail-label text-success">नाम:</label>
                  <label className="user-detail-p text-success">
                    {memberData.name}
                  </label>
                </div>
                <div className="row detail-row">
                  <label className="user-detail-label">पिता का नाम:</label>
                  <label className="user-detail-p">
                    {memberData.fathers_name}
                  </label>
                </div>
                <div className="row detail-row">
                  <label
                    className="user-detail-label"
                    style={{ color: "firebrick" }}
                  >
                    स्थायी पता:
                  </label>
                  <label
                    className="user-detail-p"
                    style={{ color: "firebrick" }}
                  >
                    {memberData.address}, {memberData.district},{" "}
                    {memberData.state}
                  </label>
                </div>
                <div className="row detail-row">
                  <label className="user-detail-label">मोबाइल नंo:</label>
                  <label className="user-detail-p">
                    {memberData.contact_no}, {memberData.alternate_contact_no}
                  </label>
                </div>
                <div className="row detail-row">
                  <label className="user-detail-label text-success">
                    कार्यक्षेत्र:
                  </label>
                  <label className="user-detail-p text-success">
                    {memberData.work_group === "Others"
                      ? memberData.work_detail
                      : memberData.work_group}
                  </label>
                </div>
                <div className="row detail-row">
                  <label className="user-detail-label">पद का नाम:</label>
                  <label className="user-detail-p">
                    {memberData.post_name ? memberData.post_name : ""}
                  </label>
                </div>
              </div>
              <div className="bottom-row mt-5 pt-0">
                <p className="text-end mb-0">अध्यक्ष/पदाधिकारी</p>
              </div>
            </div>
            <div className="main-box back ms-2 p-1">
              <div className="top-row d-flex justify-content-between p-1">
                <div className="col-logo text-center">
                  <img
                    src={adhyakshPhoto}
                    alt="logo"
                    className="m-0 adhyaksh-photo"
                  />
                  <h5 className="card-text card-subheading mt-1">
                    <span style={{ fontSize: "0.9em", color: "darkred" }}>
                      (संस्थापक)
                    </span>
                  </h5>
                </div>

                <div className="col-detail text-center align-content-around p-0">
                  <div className="text-center">
                    <h5 className="card-title card-heading text-success">
                      मौ० नदीम ठेकेदार
                    </h5>
                    <label className="id-card-back-label-name">(अध्यक्ष)</label>
                    <h6 className="mt-2 mb-0 fw-semibold text-success">
                      {process.env.REACT_APP_NAME}
                    </h6>

                    <span
                      style={{
                        display: "block",
                        fontSize: "0.75em",
                        marginTop: "0.15rem",
                        marginBottom: "0.15rem",
                      }}
                    >
                      अन्तर्गत
                    </span>
                    <span
                      className="text-success fw-semibold"
                      style={{
                        display: "block",
                        fontSize: "0.85em",
                      }}
                    >
                      (B.T.M.M / जनकल्याण ट्रस्ट)
                    </span>

                    <div
                      className="col-12 small text-center mt-2 mb-2"
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
                      9756365905 , 9149180927
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-2 mt-2">
                <div
                  className="border border-bottom-0 m-0 p-0 w-100"
                  style={{ height: "1px" }}
                ></div>
                <h5 className="p-1 mt-2" style={{ color: "firebrick" }}>
                  ट्रस्ट में सहयोग देने के लिए
                </h5>
              </div>
              <div className="p-2 pt-0 row-user-detail">
                <div className="qr-code text-center mb-1 mt-1">
                  <img
                    src={qrCodeImg}
                    alt="bank-qr-code"
                    className="m-0 logo"
                  />
                  <p className="mb-0 small" style={{ fontSize: "0.75rem" }}>
                    Scan this QR code to donate
                  </p>
                </div>
                <div className="p-2 row-user-detail">
                  <div className="row detail-row">
                    {/* bank name in hindi */}
                    <label className="user-detail-label">बैंक का नाम:</label>
                    <label className="user-detail-p">
                      Punjab national bank
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* branch name in hindi */}
                    <label className="user-detail-label text-success">
                      शाखा:
                    </label>
                    <label className="user-detail-p text-success">
                      शेखपुरा कदीम, सहारनपुर
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* account number in hindi */}
                    <label className="user-detail-label">धारक का नाम:</label>
                    <label className="user-detail-p">
                      भारतीय ठेकेदार मिस्त्री मजदूर जनकल्याण ट्रस्ट
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* account number in hindi */}
                    <label className="user-detail-label">खाता नंबर:</label>
                    <label className="user-detail-p">XXXXXXXXXXX</label>
                  </div>
                  <div className="row detail-row">
                    {/* IFSC Code in hindi */}
                    <label
                      className="user-detail-label"
                      style={{ color: "firebrick" }}
                    >
                      IFSC कोड:
                    </label>
                    <label
                      className="user-detail-p"
                      style={{ color: "firebrick" }}
                    >
                      XXXXXXXXXX
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {memberData && memberData.post_name && memberData.post_name !== "" && (
        <div id="print-appointment-letter">
          <div className="d-flex bg-white">
            <div className="main-box-al me-2 p-1">
              <div className="top-row d-flex justify-content-between p-1">
                <div className="col-logo text-center">
                  <img src={LogoImage} alt="logo" className=" m-0 logo-al" />
                  <p className="mt-1 mb-1  text-start">
                    Regd. no. 202400702011174
                  </p>
                </div>
                <div className="col-address text-center mt-3">
                  <h6
                    className="text-decoration-underline text-success fs-4"
                    style={{ marginBottom: "5px" }}
                  >
                    कार्यालय
                  </h6>
                  <p
                    className="mb-0 fs-5"
                    style={{
                      color: "firebrick",
                      fontWeight: "500",
                    }}
                  >
                    शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा,<br></br> सहारनपुर
                    - 247001 (उo प्रo)
                  </p>
                  <div className="col-12 text-center mt-2 mb-1">
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
                <div className="col-detail text-center">
                  <div className="col-user-photo text-end">
                    <img
                      src={qrCodeImg}
                      alt="qr-code"
                      className="m-0 border qr-photo"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mt-4 mb-3">
                <h3 className="mb-0 fw-semibold text-success fs-1">
                  {process.env.REACT_APP_NAME}
                </h3>

                <span
                  className="fs-5"
                  style={{
                    display: "block",
                  }}
                >
                  अन्तर्गत
                </span>
                <span
                  className="text-success fs-3"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                  }}
                >
                  (B.T.M.M / जनकल्याण ट्रस्ट)
                </span>

                <h5 className="mt-3 mb-3 fs-4" style={{ color: "firebrick" }}>
                  <span
                    className="border-bottom p-1"
                    style={{ borderColor: "firebrick !important" }}
                  >
                    नियुक्ति-पत्र
                  </span>
                </h5>
                <div
                  className="col-user-photo text-end"
                  style={{ marginTop: "-7rem", paddingRight: "5px" }}
                >
                  <img
                    src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
                    alt="user photo"
                    className="m-0 border user-photo-al"
                  />
                </div>
              </div>
              <div
                className="p-2 pb-0 pt-0 row-user-detail"
                style={{ marginTop: "-3rem" }}
              >
                <div className="row detail-row">
                  <p className="fs-5" style={{ marginBottom: "5px" }}>
                    <span className="me-2 ">क्रम संख्या:</span>
                    <span className="border-bottom text-success">
                      {memberData.unique_code}
                    </span>
                  </p>
                </div>
                <div className="row detail-row">
                  <p className="m-0 fs-4" style={{ textAlign: "justify" }}>
                    {process.env.REACT_APP_NAME} आपको{" "}
                    <span className="detail-span">{memberData.name}</span> पिता{" "}
                    <span className="detail-span">
                      {memberData.fathers_name}
                    </span>{" "}
                    निवासी{" "}
                    <span className="detail-span">{memberData.address}</span>{" "}
                    जिला{" "}
                    <span className="detail-span">{memberData.district}</span>{" "}
                    को {process.env.REACT_APP_NAME} (जनकल्याण ट्रस्ट) के{" "}
                    <span className="detail-span">{memberData.post_name}</span>{" "}
                    पद पर नियुक्त किया जाता है।
                  </p>
                </div>
              </div>
              <div className="" style={{ width: "56%" }}>
                <p
                  className="fs-4 mb-0 p-2 pt-0"
                  style={{ textAlign: "justify" }}
                >
                  आपसे आशा ही नहीं बल्कि पूर्ण विश्वास है की आप अपने पद की
                  मान-मर्यादा को ध्यान में रखते हुए सभी धर्मों, समुदायों,
                  जातियों का आदर करते हुए निःस्वार्थ व बिना भेदभाव के ट्रस्ट के
                  सभी सदस्यों की सहायता करेंगे।
                </p>
              </div>
              <div className="border adhyaksh-sign-box-al">
                <div className="align-content-end">
                  <p className="fs-5 mb-0 pb-1 pe-2 text-end">
                    अध्यक्ष/पदाधिकारी
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container-fluid">
        <IconButton sx={{ ml: "-2rem" }} onClick={() => navigate(-1)}>
          <ArrowBack sx={{ fontSize: 32 }} />
        </IconButton>
        <Box component="div">
          <Typography
            sx={{
              marginBottom: "1rem",
            }}
            variant="h5"
            component="h5"
          >
            Member Detail
          </Typography>

          <Typography
            sx={{
              marginBottom: "2rem",
            }}
            variant="h6"
            component="h6"
          >
            ID: {memberId}
          </Typography>
        </Box>
        <div className="row justify-content-around">
          <div className="col-12 col-md-12">
            {/*  identity card if memberData is not null*/}
            {memberData &&
              memberData.post_name &&
              memberData.post_name !== "" && (
                <Button
                  variant="outlined"
                  onClick={printAppointmentLetter}
                  className="m-1"
                >
                  नियुक्ति पत्र
                </Button>
              )}
            {memberData && (
              <Button variant="outlined" onClick={printIDCard} className="m-1">
                ID कार्ड
              </Button>
            )}
          </div>
          <div className="col-12 col-md-8">
            <Avatar
              alt={memberData ? memberData.name : ""}
              src={memberData ? memberData.latest_photo.url : ""}
              sx={{ width: 120, height: 120 }}
              className="mx-auto mb-3 mt-3"
            />

            <NewMemberForm memberData={memberData} />
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{ mt: "1rem", mb: "1rem" }}
              fullWidth
            >
              Go back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberDetail;
