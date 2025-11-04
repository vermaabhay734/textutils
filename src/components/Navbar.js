import React from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";

export default function Navbar(props) {
  return (
    <nav
      className={`navbar navbar-expand-lg navbar-${props.mode}`}
      style={{
        backgroundColor: props.mode === 'dark' ? 'var(--surface-dark)' : 'var(--surface-light)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${props.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div className="container-fluid">
        <div className="navbar-brand">
          <Logo mode={props.mode} />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{
            border: 'none',
            padding: '0.5rem',
            borderRadius: '8px',
            backgroundColor: props.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/" style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                marginRight: '0.5rem'
              }}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/compare" style={{
                fontSize: '1.1rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                background: 'var(--primary-light)',
                color: '#fff',
                marginRight: '0.5rem'
              }}>
                Compare Text
              </a>
            </li>
          </ul>
          <div
            className={`form-check form-switch mx-2 text-${
              props.mode === "light" ? "dark" : "light"
            }`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <input
              className="form-check-input"
              onClick={props.toggleMode}
              type="checkbox"
              role="switch"
              id="flexSwitchCheckDefault"
              style={{
                width: '3.5rem',
                height: '1.8rem',
                cursor: 'pointer',
                border: 'none',
                backgroundColor: props.mode === 'dark' ? '#3498db' : '#bdc3c7'
              }}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
              style={{
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              {props.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </label>
          </div>
          {/* <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */}
        </div>
      </div>
    </nav>
  );
}

Navbar.prototype = {
  title: PropTypes.string.isRequired,
  aboutText: PropTypes.string.isRequired,
};

Navbar.defaultProps = {
  title: "Default title",
  aboutText: "About",
};
