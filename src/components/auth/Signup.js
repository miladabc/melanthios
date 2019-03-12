import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';

import GoogleOAuth from './GoogleOAuth';
import { signup } from '../../utils/authUtils';
import { signupValidate, asyncValidate } from '../../utils/formsValidation';

const FIELDS = [
  { label: 'First Name', type: 'text', name: 'firstName' },
  { label: 'Last Name', type: 'text', name: 'lastName' },
  { label: 'Username', type: 'text', name: 'username' },
  { label: 'Email', type: 'email', name: 'email' },
  { label: 'Password', type: 'password', name: 'password' },
  { label: 'Confirm Password', type: 'password', name: 'confirmPassword' }
];

class Signup extends Component {
  onSubmit = formProps => {
    signup(formProps);
  };

  signupField({
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

  renderFields() {
    return FIELDS.map(({ label, type, name }) => {
      return (
        <Field
          key={name}
          label={label}
          type={type}
          name={name}
          component={this.signupField}
        />
      );
    });
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <span className="login100-form-title p-b-53">Sign Up With</span>
            <GoogleOAuth />

            <form
              className="login100-form validate-form flex-sb flex-w"
              onSubmit={handleSubmit(this.onSubmit)}
            >
              {this.renderFields()}

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

export default reduxForm({
  form: 'signup',
  validate: signupValidate,
  asyncValidate,
  asyncBlurFields: ['username', 'email']
})(Signup);
