import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

import { addNotification, googleOAuth } from '../../actions';

const googleClientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

class GoogleOAuth extends Component {
  onGoogleResponse = response => {
    this.props.googleOAuth(
      response,
      () => this.props.history.push('/feature'),
      this.props.addNotification
    );
  };

  render() {
    return (
      <GoogleLogin
        clientId={googleClientID}
        render={renderProps => (
          <button
            onClick={renderProps.onClick}
            className="btn-google m-b-20"
            style={{ display: 'inline-block', marginRight: '20px' }}
          >
            <img src="images/icons/icon-google.png" alt="GOOGLE" />
            Google
          </button>
        )}
        onSuccess={this.onGoogleResponse}
      />
    );
  }
}

export default compose(
  connect(
    null,
    { addNotification, googleOAuth }
  ),
  withRouter
)(GoogleOAuth);
