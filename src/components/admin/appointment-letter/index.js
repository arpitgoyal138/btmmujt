import React from "react";
import "./styles.css";
import LogoImage from "../../../assets/images/logo.png";
import whatsappLogo from "../../../assets/images/whatsapp-logo.webp";
import adhyakshPhoto from "../../../assets/images/adyaksh-photo.png";
import qrCodeImg from "../../../assets/images/qr-code.png";

const AppointmentLetter = ({ memberData = null }) => {
  const printAppointmentLetter = () => {
    var divContents = document.getElementById("print-media").innerHTML;
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
        height: 110px;
        width: 100px;
        }
        .logo {
        height: 100px;
        width: 100px;
        }
        .main-box-al {
        width: 770px;
        border: solid 3px lightcoral;
        }

        .detail-row {
        margin-top: 6px;
        }
        .detail-span {
        border-bottom: 1px dotted gray;
        color: firebrick;
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
      <div id="print-media">
        <div className="d-flex bg-white">
          <div className="main-box-al me-2 p-1">
            <div className="top-row d-flex justify-content-between p-1">
              <div className="col-logo text-center">
                <img src={LogoImage} alt="logo" className=" m-0 logo" />
                <p className="mt-1 mb-1 small text-start">
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
                  शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा,<br></br> सहारनपुर -
                  247001 (उo प्रo)
                </p>
                <div className="col-12 small text-center mt-1 mb-1">
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
                    src={`data:image/jpeg;base64,${memberData.latest_photo.base64}`}
                    alt="user photo"
                    className="m-0 border user-photo-al"
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-3 mb-3">
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
            </div>
            <div className="p-2 pt-0 row-user-detail">
              <div className="row detail-row">
                <p className="" style={{ marginBottom: "5px" }}>
                  <span className="me-2">क्रम संख्या:</span>
                  <span className="border-bottom">
                    {memberData.unique_code}
                  </span>
                </p>
              </div>
              <div className="row detail-row">
                <p>
                  {process.env.REACT_APP_NAME} आपको{" "}
                  <span className="detail-span">{memberData.name}</span> पिता{" "}
                  <span className="detail-span">{memberData.fathers_name}</span>{" "}
                  निवासी{" "}
                  <span className="detail-span">{memberData.address}</span> जिला{" "}
                  <span className="detail-span">{memberData.district}</span> को{" "}
                  {process.env.REACT_APP_NAME} के{" "}
                  <span className="detail-span">{memberData.post_name}</span> पद
                  पर नियुक्त किया जाता है। आपसे आशा ही नहीं बल्कि पूर्ण विश्वास
                  है की आप अपने पद की मान-मर्यादा को ध्यान में रखते हुए सभी
                  धर्मों, समुदायों, जातियों का आदर करते हुए निःस्वार्थ व बिना
                  भेदभाव के यूनियन के सभी सदस्यों की सहायता करेंगे।
                </p>
              </div>
            </div>
            <div className="bottom-row mt-5 p-2">
              <p className="text-end mb-0">अध्यक्ष/पदाधिकारी</p>
            </div>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary mt-2 mb-2"
        style={{ marginLeft: "45%" }}
        onClick={printAppointmentLetter}
      >
        Print
      </button>
    </>
  );
};

export default AppointmentLetter;
