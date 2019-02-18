import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { signout } from '../actions';

class Header extends Component {
  renderLinks() {
    if (this.props.authenticated) {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/feature">
              Feature
            </Link>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle"
              id="navbarDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {this.props.user.username}
            </button>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <Link className="dropdown-item" to="/">
                Profile
              </Link>
              <div className="dropdown-divider" />
              <span
                className="dropdown-item"
                style={{ cursor: 'pointer' }}
                onClick={this.props.signout}
              >
                Sign out
              </span>
            </div>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/signup">
              Sign up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/signin">
              Sign in
            </Link>
          </li>
        </>
      );
    }
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          Brand
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=".navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="navbar-collapse collapse w-100 order-1 order-md-0 navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Left
              </Link>
            </li>
          </ul>
        </div>

        <div
          className="navbar-collapse collapse w-100 order-3 navbarSupportedContent"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ml-auto">{this.renderLinks()}</ul>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { signout }
)(Header);
