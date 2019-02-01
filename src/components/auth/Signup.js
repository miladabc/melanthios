import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactNotification from 'react-notifications-component';

import { signup } from '../../actions';
import GoogleOAuth from './GoogleOAuth';
import { validate, asyncValidate } from '../../services/signupValidation';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  onSubmit = formProps => {
    this.props.signup(formProps, this.showNotification);
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

  renderField({
    input,
    label,
    type,
    meta: { asyncValidating, touched, error }
  }) {
    const className = `wrap-input100 ${
      asyncValidating ? 'async-validating' : ''
    }`;

    return (
      <fieldset>
        <div className="p-t-31 p-b-9">
          <label className="txt1">{label}</label>
        </div>
        <div className={className}>
          <input className="input100" {...input} type={type} />
          <span className="focus-input100" />
        </div>
        {touched && error && <span className="text-danger">{error}</span>}
      </fieldset>
    );
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="limiter">
        <ReactNotification ref={this.notificationDOMRef} />
        <div className="container-login100">
          <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <form
              className="login100-form validate-form flex-sb flex-w"
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <span className="login100-form-title p-b-53">Sign Up With</span>

              <GoogleOAuth />

              <a href="/face" className="btn-face m-b-20">
                <i className="fa fa-facebook-official" />
                Facebook
              </a>

              <Field
                name="firstName"
                type="text"
                component={this.renderField}
                label="First Name"
              />

              <Field
                name="lastName"
                type="text"
                component={this.renderField}
                label="Last Name"
              />

              <Field
                name="username"
                type="text"
                component={this.renderField}
                label="Username"
              />

              <Field
                name="email"
                type="email"
                component={this.renderField}
                label="Email"
              />

              <Field
                name="password"
                type="password"
                component={this.renderField}
                label="Password"
              />

              <Field
                name="confirmPassword"
                type="password"
                component={this.renderField}
                label="Confirm Password"
              />

              <div className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn" disabled={submitting}>
                  Sign Up
                </button>
              </div>

              <div className="w-full text-center p-t-55">
                <span className="txt2">Need an account? </span>

                <Link className="txt2 bo1" to="/signin">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  connect(
    null,
    { signup }
  ),
  reduxForm({
    form: 'signup',
    validate,
    asyncValidate,
    asyncBlurFields: ['username', 'email']
  })
)(Signup);
