import React from "react";
import "./styles.css";
import LogoImage from "../../../assets/images/logo.png";
import whatsappLogo from "../../../assets/images/whatsapp-logo.webp";
import adhyakshPhoto from "../../../assets/images/adyaksh-photo.png";
import qrCodeImg from "../../../assets/images/qr-code.png";

const IdentityCard = ({ memberData = null }) => {
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
        width: 85px;
      }
      .logo {
        height: 100px;
        width: 100px;
      }
      .adyaksh-photo {
        height: 120px;
        width: 120px;
      }
      .main-box {
        width: 378px;
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
        width: 100px;
        height: 110px;
      }
      .detail-row {
        margin-top: 6px;
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

  return (
    <>
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
                    शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा, सहारनपुर - 247001
                    (उo प्रo)
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
                <label className="user-detail-p" style={{ color: "firebrick" }}>
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
                  पद का नाम:
                </label>
                <label className="user-detail-p text-success"></label>
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
                <h5 className="card-text card-subheading">
                  <span style={{ fontSize: "0.9em", color: "darkred" }}>
                    (अध्यक्ष)
                  </span>
                </h5>
              </div>

              <div className="col-detail text-center align-content-around p-0">
                <div className="text-center">
                  <h5 className="card-title card-heading">मौ० नदीम ठेकेदार</h5>
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
                    9720060562 , 9720060246
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-2 mt-2">
              <hr style={{ width: "90%", margin: "auto" }} />
              <h5 className="p-1 mt-2" style={{ color: "firebrick" }}>
                Trust bank account details
              </h5>
            </div>
            <div className="p-2 pt-0 row-user-detail">
              <div className="qr-code text-center mb-1 mt-1">
                <img src={qrCodeImg} alt="bank-qr-code" className="m-0 logo" />
                <p className="mb-0 small" style={{ fontSize: "0.75rem" }}>
                  Scan this QR code to donate
                </p>
              </div>
              <div className="p-2 row-user-detail">
                <div className="row detail-row">
                  {/* bank name in hindi */}
                  <label className="user-detail-label">बैंक का नाम:</label>
                  <label className="user-detail-p">Punjab national bank</label>
                </div>
                <div className="row detail-row">
                  {/* branch name in hindi */}
                  <label className="user-detail-label text-success">
                    शाखा:
                  </label>
                  <label className="user-detail-p text-success">
                    XXXXXXXXXX
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
            <div className="bottom-row mt-5 pt-0">
              <p className="text-end mb-0">अध्यक्ष/पदाधिकारी</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary mt-2 mb-2"
        style={{ marginLeft: "45%" }}
        onClick={printIDCard}
      >
        Print
      </button>
    </>
  );
};

export default IdentityCard;
