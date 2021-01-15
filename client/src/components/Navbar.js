import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <div className="navbar-brand">
          <a
            role="button"
            className={`navbar-burger burger ${isOpen && "is-active"}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={() => setOpen(!isOpen)}
          >
            <span aria-hidden="true">
              {" "}
              Escrow Payment With Ethereum and IPFS
            </span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div className={`navbar-menu ${isOpen && "is-active"}`}>
          <div className="navbar-nav">
            <NavLink
              className="navbar-item nav-link"
              activeClassName="is-active"
              to="/Createpurchase"
            >
              Home
            </NavLink>

            <NavLink
              className="navbar-item nav-link"
              activeClassName="is-active"
              to="/Createpurchase"
            >
              Create Purchase
            </NavLink>

            <NavLink
              className="navbar-item nav-link"
              activeClassName="is-active"
              to="/ViewPurchase"
            >
              View Purchase
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
