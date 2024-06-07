import * as React from "react";
import logoImage from "./../../../assets/images/logo.png";
import {Link} from "react-router-dom";
const navItems = [
  // {title: "उद्देश्य जानें", url: "/objectives"},
  {title: "Objectives", url: "/objectives"},
  {title: "Login", url: "/login"},
  // {title: "संपर्क करें", url: "/contactUs"},
];

function DrawerAppBar(props) {
  return (
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
                  <Link className="nav-link" aria-current="page" to={item.url}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default DrawerAppBar;
