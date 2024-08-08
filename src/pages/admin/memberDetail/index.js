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
import phonePeLogo from "../../../assets/images/phonepe-logo-resized.png";
import userProfileIcon from "../../../assets/images/user-profile-icon.png";
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
  height: 24mm;
  width: 22mm;
}
.logo {
  height: 23mm;
  width: 23mm;
}
.main-box {
  width: 50%;
  height: 100%;
  border: solid 1mm lightcoral;
}
.user-detail-p {
  border-bottom: 1px dotted;
  width: 70%;
  padding-left: 1mm;
  padding-right: 1mm;
  font-size: 11.33pt; /* 4mm */
}

.user-detail-label {
  width: 28%;
  font-weight: 500;
  padding-left: 2mm;
  padding-right: 1mm;
  font-size: 11.33pt; /* 4mm */
}
.adhyaksh-photo {
  width: 30mm;
  height: 35mm;
}
.detail-row {
  margin-top: 1.5mm;
}
.id-card-back-label-name {
  font-size: 12pt;
  display: block;
  color: darkred;
  margin-top: -1mm;
}
.text-firebrick {
  color: firebrick !important;
}
.fw-semibold{
    font-weight: 600 !important;
}
#print-media {
  width: 210mm; /* A4 Paper Width  */
  height: 145mm; /* Half of A4 Paper Height*/
}
  .d-flex {
    display: flex !important;
  }
      @media print {
        @page {
          size: portrait;
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
  height: 30mm;
  width: 30mm;
}
.logo-al {
  height: 30mm;
  width: 30mm;
}
.main-box-al {
  width: 100%;
  border: solid 1mm lightcoral;
  padding: 5mm;
}

.detail-row {
  margin-top: 1.5mm;
}
.detail-span {
  border-bottom: 1px dotted gray;
  color: darkgreen;
  font-weight: 600;
}
.qr-photo {
  height: 30mm;
  width: 30mm;
}
.adhyaksh-sign-box-al {
  padding-top: 20mm;
  width: 60mm;
  float: inline-start;
  float: right;
  margin-top: 0mm;
  margin-right: 1.5mm;
}

#print-al-media {
  width: 258mm; /* A4 Paper Height  */
  height: 190mm; /* Landscape mode A4 Paper Width */
  margin: 10mm 20mm;
}
.text-firebrick {
  color: firebrick !important;
}
  .d-flex {
    display: flex !important;
  }
  .justify-content-between {
    justify-content: space-between !important; 
  }
    .text-center {
      text-align: center !important;
    }
      .fw-semibold {
    font-weight: 600 !important;
}
      @media print {
        @page {
        size: landscape;
          margin-left: 0mm;
          margin-right: 0mm;
          margin-top: 0mm;
          margin-bottom: 0mm;
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
            <div className="main-box front me-1 p-1">
              <div className="top-row d-flex justify-content-between p-1 mb-1">
                <div className="col-logo">
                  <img src={LogoImage} alt="logo" className="m-0 logo" />
                </div>
                <div className="text-center">
                  <h6
                    className="text-decoration-underline text-success"
                    style={{ fontSize: "9pt", marginBottom: "1mm" }}
                  >
                    कार्यालय
                  </h6>
                  <p
                    className="mb-0 text-firebrick"
                    style={{
                      fontSize: "9pt",
                    }}
                  >
                    शेखपुरा कदीम, पत्थरों वाला कुआँ, <br />
                    तेलपुरा, सहारनपुर - 247001 (उo प्रo)
                  </p>
                  <div
                    className="col-12 small text-center mt-1 mb-1 text-firebrick"
                    style={{ fontSize: "9pt" }}
                  >
                    <img
                      src={whatsappLogo}
                      style={{
                        height: "4mm",
                        width: "4mm",
                        marginTop: "-1mm",
                        marginRight: "1mm",
                      }}
                    ></img>
                    9720060562 , 9720060246
                    <p
                      className="mt-1 mb-1 small text-success"
                      style={{ fontSize: "9pt" }}
                    >
                      Reg. no. 202400702011174
                    </p>
                  </div>
                </div>
                <div className="col-detail text-center align-content-around p-0">
                  <div className="text-end">
                    {memberData.latest_photo &&
                      memberData.latest_photo.base64 !== "" && (
                        <img
                          src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
                          alt="user photo"
                          className="m-0 border user-photo"
                        />
                      )}
                    {(!memberData.latest_photo ||
                      memberData.latest_photo.base64 === "") && (
                      <img
                        src={userProfileIcon}
                        alt="user photo"
                        className="m-0 border user-photo"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4
                  className="mb-0 fw-semibold text-success"
                  style={{ fontSize: "19pt" }}
                >
                  {process.env.REACT_APP_NAME}
                </h4>

                <span
                  style={{
                    display: "block",
                    fontSize: "10pt",
                  }}
                >
                  अन्तर्गत
                </span>
                <span
                  className="text-success"
                  style={{
                    display: "block",
                    fontSize: "14pt",
                    fontWeight: "bold",
                  }}
                >
                  (B.T.M.M / जनकल्याण ट्रस्ट)
                </span>

                <h5 className="mt-2 mb-2 text-firebrick">Identity Card</h5>
              </div>
              <div className="p-2 pt-0 mt-1">
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
                  <label className="user-detail-label text-firebrick">
                    स्थायी पता:
                  </label>
                  <label
                    className="user-detail-p text-firebrick"
                    style={{ minHeight: "16mm" }}
                  >
                    {memberData.address}, {memberData.district},{" "}
                    {memberData.state}
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
                  <label className="user-detail-label">मोबाइल नंo:</label>
                  <label className="user-detail-p">
                    {memberData.contact_no}{" "}
                    {memberData.alternate_contact_no !== ""
                      ? `, ${memberData.alternate_contact_no}`
                      : ""}
                  </label>
                </div>

                <div className="row detail-row">
                  <label className="user-detail-label text-success">
                    पद का नाम:
                  </label>
                  <label className="user-detail-p text-success">
                    {memberData.post_name ? memberData.post_name : ""}
                  </label>
                </div>
              </div>
              <div className="bottom-row pt-0" style={{ marginTop: "11mm" }}>
                <p className="text-end mb-0">अध्यक्ष/पदाधिकारी</p>
              </div>
            </div>
            <div className="main-box back ms-1 p-1">
              <div className="top-row d-flex justify-content-between p-1">
                <div className="col-logo text-center">
                  <img
                    src={adhyakshPhoto}
                    alt="logo"
                    className="m-0 adhyaksh-photo"
                  />
                  <h5
                    className="text-success"
                    style={{ marginTop: "1mm", marginBottom: 0 }}
                  >
                    <span style={{ fontSize: "13.5pt" }}>(संस्थापक)</span>
                  </h5>
                </div>

                <div className="col-detail text-center align-content-around p-0">
                  <div className="text-center">
                    <h5
                      className="text-success"
                      style={{ fontSize: "19pt", marginBottom: 0 }}
                    >
                      मौ० नदीम ठेकेदार
                    </h5>
                    <label className="id-card-back-label-name">(अध्यक्ष)</label>
                    <h6
                      className="mt-2 mb-0 fw-semibold text-success"
                      style={{ fontSize: "14pt" }}
                    >
                      {process.env.REACT_APP_NAME}
                    </h6>

                    <span
                      style={{
                        display: "block",
                        fontSize: "10pt",
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
                        fontSize: "10pt",
                      }}
                    >
                      (B.T.M.M / जनकल्याण ट्रस्ट)
                    </span>
                    <div
                      className="col-12 small text-center mt-1 mb-1 text-success"
                      style={{ fontSize: "10pt" }}
                    >
                      <img
                        src={whatsappLogo}
                        style={{
                          height: "4mm",
                          width: "4mm",
                          marginTop: "-1mm",
                          marginRight: "1mm",
                        }}
                      ></img>
                      9756365905 , 9149180927
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-0 mt-2">
                <div
                  className="border border-bottom-0 m-0 p-0 w-100"
                  style={{ height: "1px" }}
                ></div>
                <h5 className="p-1 mt-1 text-firebrick">
                  ट्रस्ट में सहयोग देने के लिए
                </h5>
              </div>
              <div className="p-2 pt-0">
                <div className="row">
                  <div className="col qr-code text-center mb-1 mt-0">
                    <img
                      src={qrCodeImg}
                      alt="bank-qr-code"
                      className="m-0 logo"
                    />
                    <p className="mb-0 small" style={{ fontSize: "9pt" }}>
                      Scan to Donate
                    </p>
                  </div>
                  <div className="col qr-code text-center mb-1 mt-0">
                    <img
                      src={qrCodeImg}
                      alt="bank-qr-code"
                      className="m-0 logo"
                    />
                    <p className="mb-0 small" style={{ fontSize: "9pt" }}>
                      visit our website
                    </p>
                  </div>
                </div>

                <div className="p-2">
                  <div className="row detail-row">
                    {/* bank name in hindi */}
                    <label className="user-detail-label">बैंक का नाम :</label>
                    <label className="user-detail-p">
                      Punjab National Bank
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* branch name in hindi */}
                    <label className="user-detail-label text-success">
                      शाखा :
                    </label>
                    <label className="user-detail-p text-success">
                      शेखपुरा कदीम, सहारनपुर
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* account number in hindi */}
                    <label className="user-detail-label text-firebrick">
                      धारक का नाम :
                    </label>
                    <label
                      className="user-detail-p text-firebrick"
                      style={{ fontSize: "11pt" }}
                    >
                      भारतीय ठेकेदार मिस्त्री मजदूर जनकल्याण ट्रस्ट
                    </label>
                  </div>
                  <div className="row detail-row">
                    {/* account number in hindi */}
                    <label className="user-detail-label">खाता नंबर :</label>
                    <label className="user-detail-p">0375102100000375</label>
                  </div>
                  <div className="row detail-row">
                    {/* IFSC Code in hindi */}
                    <label className="user-detail-label text-success">
                      IFSC कोड :
                    </label>
                    <label className="user-detail-p text-success">
                      PUNB0037510
                    </label>
                  </div>
                  <div className="row detail-row">
                    <label
                      className="user-detail-label"
                      style={{ color: "#5f249f" }}
                    >
                      <img
                        src={phonePeLogo}
                        style={{ marginTop: "-2mm", height: "5.8mm" }}
                      ></img>{" "}
                      :
                    </label>
                    <label
                      className="user-detail-p"
                      style={{ color: "#5f249f" }}
                    >
                      9720060246
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
          <div className="d-flex bg-white" id="print-al-media">
            <div className="main-box-al">
              <div className="d-flex justify-content-between">
                <div className="col-logo text-center">
                  <img src={LogoImage} alt="logo" className="m-0 logo-al" />
                  <p style={{ fontSize: "13pt", margin: "3mm 0" }}>
                    Reg. no. 202400702011174
                  </p>
                </div>
                <div
                  className="col-address text-center"
                  style={{ marginLeft: "-25mm" }}
                >
                  <h6
                    className="text-decoration-underline text-success"
                    style={{ marginBottom: "1mm", fontSize: "26pt" }}
                  >
                    कार्यालय
                  </h6>
                  <p
                    className="mb-0 fs-4 text-firebrick"
                    style={{
                      fontWeight: "500",
                      fontSize: "20pt",
                    }}
                  >
                    शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा,
                    <br /> सहारनपुर - 247001 (उo प्रo)
                  </p>
                  <div
                    className="col-12 text-center mt-2 mb-1"
                    style={{ fontSize: "14pt" }}
                  >
                    <img
                      src={whatsappLogo}
                      style={{
                        height: "7mm",
                        width: "7mm",
                        marginTop: "-1mm",
                        marginRight: "2mm",
                      }}
                    ></img>
                    9720060562 , 9720060246
                  </div>
                </div>
                <div className="col-detail text-center">
                  <div className="text-end">
                    <img
                      src={qrCodeImg}
                      alt="qr-code"
                      className="m-0 border qr-photo"
                    />
                  </div>
                </div>
              </div>

              <div
                className="text-center mt-4 mb-3"
                style={{ margin: "6mm 0mm 2mm 0" }}
              >
                <h3
                  className="fw-semibold text-success"
                  style={{ fontSize: "34pt", margin: "0" }}
                >
                  {process.env.REACT_APP_NAME}
                </h3>

                <span
                  style={{
                    display: "block",
                    fontSize: "16pt",
                  }}
                >
                  अन्तर्गत
                </span>
                <span
                  className="text-success"
                  style={{
                    display: "block",
                    fontWeight: "bold",
                    fontSize: "26pt",
                  }}
                >
                  (B.T.M.M / जनकल्याण ट्रस्ट)
                </span>

                <h5
                  className="text-firebrick"
                  style={{ fontSize: "22pt", margin: "2mm 0 4mm 0" }}
                >
                  <span
                    className="border-bottom"
                    style={{ borderColor: "firebrick !important" }}
                  >
                    नियुक्ति-पत्र
                  </span>
                </h5>
                <div className="text-end" style={{ marginTop: "-30mm" }}>
                  {memberData.latest_photo &&
                    memberData.latest_photo.base64 !== "" && (
                      <img
                        src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
                        alt="member photo"
                        className="user-photo-al"
                      />
                    )}
                  {(!memberData.latest_photo ||
                    memberData.latest_photo.base64 == "") && (
                    <img
                      src={userProfileIcon}
                      alt="member photo"
                      className="user-photo-al"
                    />
                  )}
                </div>
              </div>
              <div style={{ marginTop: "-8mm" }}>
                <div className="row detail-row">
                  <p style={{ marginBottom: "1mm", fontSize: "17pt" }}>
                    <span className="me-2">क्रम संख्या:</span>
                    <span className="border-bottom text-success">
                      {memberData.unique_code}
                    </span>
                  </p>
                </div>
                <div className="row">
                  <p
                    className="m-0"
                    style={{ textAlign: "justify", fontSize: "19pt" }}
                  >
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
              <div className="d-flex">
                <div
                  style={{
                    width: "180mm",
                    fontSize: "18pt",
                    textAlign: "justify",
                    marginRight: "5mm",
                  }}
                >
                  <p>
                    आपसे आशा ही नहीं बल्कि पूर्ण विश्वास है की आप अपने पद की
                    मान-मर्यादा को ध्यान में रखते हुए सभी धर्मों, समुदायों एवं
                    जातियों का आदर करते हुए निःस्वार्थ व बिना भेदभाव के ट्रस्ट
                    के सभी सदस्यों की सहायता करेंगे।
                  </p>
                </div>
                <div className="border adhyaksh-sign-box-al">
                  <div className="align-content-end">
                    <p
                      className="mb-0 pb-1 pe-2 text-end"
                      style={{ fontSize: "14pt" }}
                    >
                      अध्यक्ष/पदाधिकारी
                    </p>
                  </div>
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
              alt={memberData ? memberData.name : "member name"}
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
