import React, {useEffect, useState} from "react";
import logo from "./../../../assets/images/logo.png";

import ResponsiveCarousel from "../../../components/common/Carousel";
import "./styles.css";
import NewMemberForm from "../../../components/app/forms/new-member";
import AppFooter from "../../../components/app/footer";
import {Link} from "react-router-dom";
import adhyakshPhoto from "./../../../assets/images/adyaksh-photo.png";
import noImage from "./../../../assets/images/no-image.png";
import whatsappLogo from "./../../../assets/images/whatsapp-logo.webp";
import callUpLogo from "./../../../assets/images/call-up-logo.png";
import officePic1 from "./../../../assets/images/office/1.jpg";
import officePic2 from "./../../../assets/images/office/2.jpg";
import officePic3 from "./../../../assets/images/office/3.jpg";
import officePic4 from "./../../../assets/images/office/4.jpg";
import officePic5 from "./../../../assets/images/office/5.jpg";
import officePic6 from "./../../../assets/images/office/6.jpg";
import MembersAPI from "../../../api/firebase/MembersAPI";
const Homepage = () => {
  const membersApi = new MembersAPI();
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [totalAmountDonated, setTotalAmountDonated] = useState(0);
  useEffect(() => {
    membersApi.getMembers().then((res) => {
      console.log("All members =>", res.data);
      setTotalMembers(res.data.length);
    });
  }, []);

  return (
    <div className="container home-page">
      <div className="row" style={{marginBottom: "1rem"}}>
        <div className="col">
          <h1
            className="display-5 text-center"
            style={{color: "green", marginTop: "1rem"}}
          >
            {process.env.REACT_APP_NAME}
            <br />
            <span style={{fontSize: "0.65em"}}>
              अन्तर्गत (B.T.M.M / जनकल्याण ट्रस्ट)
            </span>
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-sm-6 mb-5 text-center">
          <img src={logo} style={{maxWidth: "75%"}}></img>
          <div style={{marginTop: "1rem", fontSize: "1.35rem"}}>
            रजिस्ट्रेशन स० : 202400702011174
          </div>
        </div>
        <div className="col-sm-6">
          <div className="row">
            <div className="col-12 text-center fs-4">
              <b className="div-heading fs-3 d-block mb-1">
                कार्यालय का पंजीकृत पता{" "}
              </b>
              म० न० 510, ग्राम शेखपुरा कदीम, पत्थरों वाला कुआँ, तेलपुरा,
              सहारनपुर, उत्तर प्रदेश
            </div>
          </div>

          <div className="row mt-3 text-body-secondary text-center">
            <div className="col-12 col-sm-6 fs-4">
              <img
                src={whatsappLogo}
                style={{height: "28px", width: "28px"}}
                className="me-1"
              ></img>
              +91-9720060562
            </div>
            <div className="col-12 col-sm-6 fs-4">
              <img
                src={callUpLogo}
                style={{height: "25px", width: "25px"}}
                className="me-1"
              ></img>{" "}
              +91-9720060246
            </div>
          </div>
          <div className="row mt-5 mb-5 d-flex d-sm-none">
            <div className="col-12 text-center mb-3">
              <h3 className="div-heading">कार्यालय की फोटो </h3>
            </div>
            <a
              href={officePic1}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md- p-1"
            >
              <img
                src={officePic1}
                className="img-fluid rounded shadow h-100"
              />
            </a>
            <a
              href={officePic2}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md-2 p-1"
            >
              <img
                src={officePic2}
                className="img-fluid rounded shadow h-100"
              />
            </a>
            <a
              href={officePic3}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md-2 p-1"
            >
              <img
                src={officePic3}
                className="img-fluid rounded shadow h-100"
              />
            </a>
            <a
              href={officePic4}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md-2 p-1"
            >
              <img
                src={officePic4}
                className="img-fluid rounded shadow h-100"
              />
            </a>
            <a
              href={officePic5}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md-2 p-1"
            >
              <img
                src={officePic5}
                className="img-fluid rounded shadow h-100"
              />
            </a>
            <a
              href={officePic6}
              data-toggle="lightbox"
              data-gallery="photo-gallery"
              className="col-6 col-sm-3 col-md-2 p-1"
            >
              <img
                src={officePic6}
                className="img-fluid rounded shadow h-100"
              />
            </a>
          </div>
          <ul className="list-group mt-3">
            <li className="list-group-item list-group-item-success active">
              मिस्त्री, मजदूर एवं ठेकेदारों के कल्याण हेतु कार्य
            </li>
            <li className="list-group-item list-group-item-success">
              १. मजदूर, मिस्त्री व ठेकेदारों के कल्याण हेतु प्रयास करना एवं उनकी
              समस्याओं का निदान करना
            </li>
            <li className="list-group-item list-group-item-success">
              २. मजदूरों, मिस्त्रियों व ठेकेदारों के बच्चों की शिक्षा स्थान व
              शिक्षा के कल्याण हेतु योजना बनाना
            </li>
            <li className="list-group-item list-group-item-success">
              ३. मजदूरों, मिस्त्रियों व ठेकेदारों के सामाजिक कार्यों में समय समय
              पर योगदान देना व उनके कल्याण हेतु विभिन्न कार्यकर्मों का आयोजन
              करना
            </li>
            <li className="list-group-item list-group-item-success">
              ४. मजदूरों, मिस्त्रियों व ठेकेदारों के आश्रितों के कल्याणार्थ व
              उनकी कन्याओं के विवाह व शिक्षा में आर्थिक सहयोग प्रदान करना तथा
              उनके कल्याण हेतु फण्ड की स्थापना करना
            </li>
            <li className="list-group-item list-group-item-success">
              ५. किसी भी सदस्य की साइट पर दुर्घटना होने पर या काम करने की स्तिथि
              में ना होने पर आर्थिक सहयोग करना
            </li>
            <div className="collapse" id="collapseExample">
              <li className="list-group-item list-group-item-success">
                ६. बुजुर्गों के लिए 55 वर्ष से अधिक होने पर ट्रस्ट के बजट के
                अनुसार उनकी मदद की जायगी
              </li>
              <li className="list-group-item list-group-item-success">
                ७. कन्या दान
                <br />
                <span style={{marginLeft: "1rem"}}>
                  क. कन्या के पिता व भाई दोनों होने पर
                </span>
                <br />
                <span style={{marginLeft: "1rem"}}>
                  ख. कन्या के पिता या भाई किसी एक के होने पर
                </span>
                <br />
                <span style={{marginLeft: "1rem"}}>
                  ग. कन्या के पिता व भाई दोनों में से कोई भी न होने पर
                </span>
                <br />
                उपरोक्त तीनों कथनो में आर्थिक दान की सीमा ट्रस्ट के पदाधिकारी
                ट्रस्ट के बजट के हिसाब से तय करेंगे
              </li>
              <li className="list-group-item list-group-item-success">
                ८. शिक्षा स्थान व शिक्षा के लिए ट्रस्ट के पदाधिकारी ट्रस्ट के
                बजट के हिसाब से अपनी सहमति से मदद करेंगे
              </li>
              <li className="list-group-item list-group-item-success">
                ९. ट्रस्ट अपने सभी पदाधिकारी व सदस्यों की आपस में मदद करेंगे |
                इस योजना का लाभ केवल ट्रस्ट में जुड़ने पर ही सदस्यों व
                पदाधिकारियों को मिलेगा
              </li>
              <li className="list-group-item list-group-item-success">
                १०. ट्रस्ट किसी भी धार्मिक स्थल में दान नहीं करेगा
              </li>
              <li className="list-group-item list-group-item-success">
                ११. अच्छी हैसियत वाले सदस्य ट्रस्ट से लाभ लेने का प्रयास न करें
              </li>
              <li className="list-group-item list-group-item-success">
                १२. ट्रस्ट का कार्यक्षेत्र सम्पूर्ण भारतवर्ष है
              </li>
            </div>
            <li className="list-group-item p-0 mt-2 border-0">
              <button
                type="button"
                className="btn btn-success col-12 mx-auto"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample"
              >
                और पढ़ें
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="row mt-5 mb-5 d-none d-sm-flex">
        <div className="col-12 text-center mb-3">
          <h3 className="div-heading">कार्यालय की फोटो </h3>
        </div>
        <a
          href={officePic1}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic1} className="img-fluid rounded shadow h-100" />
        </a>
        <a
          href={officePic2}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic2} className="img-fluid rounded shadow h-100" />
        </a>
        <a
          href={officePic3}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic3} className="img-fluid rounded shadow h-100" />
        </a>

        <a
          href={officePic4}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic4} className="img-fluid rounded shadow h-100" />
        </a>
        <a
          href={officePic5}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic5} className="img-fluid rounded shadow h-100" />
        </a>
        <a
          href={officePic6}
          data-toggle="lightbox"
          data-gallery="photo-gallery"
          className="col-6 col-sm-3 col-md-2 p-1"
        >
          <img src={officePic6} className="img-fluid rounded shadow h-100" />
        </a>
      </div>
      <div className="row mt-5 mb-5 justify-content-center">
        <div className="col-12 text-center mb-3">
          <h3 className="div-heading">संस्थापक एवं पदाधिकारी </h3>
        </div>
        <div className="col-12 col-sm-4 mt-2">
          <div className="card" style={{width: "75%", margin: "auto"}}>
            <img className="card-img-top" src={adhyakshPhoto} alt="अध्यक्ष" />
            <div className="card-body">
              <h4 className="card-title card-heading">मौ० नदीम ठेकेदार</h4>
              <h5 className="card-text card-subheading">
                संस्थापक एवं{" "}
                <span style={{fontSize: "1.3em", color: "darkred"}}>
                  (अध्यक्ष)
                </span>
              </h5>
              <p className="card-text card-body-text">
                निवासी पत्थरों वाला कुआं, तेलपुरा, शेखपुरा कदीम, सहारनपुर
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4 mt-2">
          <div className="card" style={{width: "75%", margin: "auto"}}>
            <img className="card-img-top" src={noImage} alt="पदाधिकारी" />
            <div className="card-body">
              <h4 className="card-title card-heading">पदाधिकारी का नाम</h4>
              <h5 className="card-text card-subheading">पदाधिकारी</h5>
              <p className="card-text card-body-text">पदाधिकारी का पता</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-5 mb-2">
        <div className="col-12 col-md-8 m-auto mt-5">
          <h3 className="text-center mb-4 div-heading">
            सदस्य बनने के लिए आवश्यक जानकारी
          </h3>
          <ol className="list-group list-group-numbered">
            <li className="list-group-item list-group-item-success">
              प्रत्येक सदस्य को आजीवन सदस्य्ता प्राप्त करने के लिए केवल एक बार
              100 रू देने होंगे
            </li>
            <li className="list-group-item list-group-item-success">
              प्रत्येक सदस्य को इस योजना को पूरा करने हेतु हर माह न्यूनतम 60 रू
              देने होंगे
            </li>
          </ol>
        </div>
        <div className="col-12 col-md-8 m-auto mt-5">
          <h3 className="text-center mb-4 div-heading">
            सदस्यता ग्रहण करने हेतु फॉर्म
          </h3>
          <NewMemberForm />
        </div>
      </div>
      <div className="row mt-5 mb-5 text-center">
        <div className="col-sm-6 col-xl-3 box-1 ">
          <div className="box-content rounded">
            <div className="text-secondary text-start box-icon w-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-people"
                viewBox="0 0 16 16"
              >
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
            </div>
            <div className="align-content-center box-text">
              <h4 className="fs-2">कुल सदस्य</h4>
              <h2 className="fs-2">{totalMembers}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3 box-1">
          <div className="box-content rounded">
            <div className="text-secondary text-start  box-icon w-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-person-check"
                viewBox="0 0 16 16"
              >
                <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
              </svg>
            </div>
            <div className="align-content-center box-text">
              <h4 className="fs-2">लाभार्थी सदस्य</h4>
              <h2 className="fs-2">{totalBeneficiaries}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3 box-1">
          <div className="box-content rounded">
            <div className="text-secondary text-start  box-icon w-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-bag-plus"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5"
                />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
            </div>
            <div className="w-100 align-content-center box-text">
              <h4 className="fs-2">कुल प्राप्त हुई राशि</h4>
              <h2 className="fs-2">₹ {totalAmountReceived}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3 box-1">
          <div className="box-content rounded">
            <div className="text-secondary text-start  box-icon w-25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-bag-dash"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M5.5 10a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"
                />
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
            </div>
            <div className="align-content-center box-text">
              <h4 className="fs-2">दान की गयी राशि</h4>
              <h2 className="fs-2">₹ {totalAmountDonated}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
