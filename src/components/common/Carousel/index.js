import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";
import Slide1 from "../../../assets/images/slides/1.jpg";
import Slide2 from "../../../assets/images/slides/2.jpg";
import Slide3 from "../../../assets/images/slides/3.jpg";
import logo from "./../../../assets/images/logo.png";
const ResponsiveCarousel = () => {
  return (
    <div id="carouselExampleIndicators" className="carousel slide">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <div className="container  text-center">
            <div className="row">
              <div className="col-6 m-auto">
                <img src={logo} style={{maxWidth: "75%"}}></img>
              </div>
              <div className="col-6">
                <p className="lead mt-3">संस्था के विषय में अधिक जानकारी</p>
                <ul className="list-group">
                  <li className="list-group-item list-group-item-success">
                    An item
                  </li>
                  <li className="list-group-item list-group-item-success">
                    A second item
                  </li>
                  <li className="list-group-item list-group-item-success">
                    A third item
                  </li>
                  <li className="list-group-item list-group-item-success">
                    A fourth item
                  </li>
                  <li className="list-group-item list-group-item-success">
                    And a fifth one
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default ResponsiveCarousel;
