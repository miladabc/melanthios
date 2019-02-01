import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import ReactNotification from 'react-notifications-component';

import { googleOAuth } from '../../actions';
import { googleClientID } from '../../config';

class GoogleOAuth extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  onGoogleResponse = response => {
    this.props.googleOAuth(
      response,
      () => {
        this.props.history.push('/feature');
      },
      this.showNotification
    );
  };

  showNotification = ({ title, message, type }) => {
    this.notificationDOMRef.current.addNotification({
      title,
      message,
      type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'bounceIn'],
      animationOut: ['animated', 'bounceOut'],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  };

  render() {
    return (
      <>
        <ReactNotification ref={this.notificationDOMRef} />
        <GoogleLogin
          clientId={googleClientID}
          render={renderProps => (
            <button onClick={renderProps.onClick} className="btn-google m-b-20">
              <img src="images/icons/icon-google.png" alt="GOOGLE" />
              Google
            </button>
          )}
          onSuccess={this.onGoogleResponse}
        />
      </>
    );
  }
}

export default compose(
  connect(
    null,
    { googleOAuth }
  ),
  withRouter
)(GoogleOAuth);
