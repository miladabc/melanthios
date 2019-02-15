import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signin, addNotification } from '../../actions';
import GoogleOAuth from './GoogleOAuth';

class Signin extends Component {
  onSubmit = formProps => {
    this.props.signin(
      formProps,
      () => {
        this.props.history.push('/feature');
      },
      this.props.addNotification
    );
  };

  renderField({ input, label, type, meta: { touched, error } }) {
    return (
      <fieldset>
        <div className="p-t-31 p-b-9">
          <label className="txt1">{label}</label>
        </div>
        <div className="wrap-input100">
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
        <div className="container-login100">
          <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <form
              className="login100-form validate-form flex-sb flex-w"
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <span className="login100-form-title p-b-53">Sign In With</span>

              <GoogleOAuth />

              <a href="/face" className="btn-face m-b-20">
                <i className="fa fa-facebook-official" />
                Facebook
              </a>

              <Field
                name="emailOrUsername"
                type="text"
                component={this.renderField}
                label="Email or Username"
              />

              <Field
                name="password"
                type="password"
                component={this.renderField}
                label="Password"
              />

              <div className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn" disabled={submitting}>
                  Sign In
                </button>
              </div>

              <div className="w-full text-center p-t-55">
                <a href="/forgetpass" className="txt2 bo1 m-l-5">
                  Forgot password?
                </a>
              </div>

              <div className="w-full text-center p-t-55">
                <span className="txt2">Not a member? </span>

                <Link className="txt2 bo1" to="/signup">
                  Sign up now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const validate = values => {
  const fields = ['emailOrUsername', 'password'];
  const errors = {};

  fields.forEach(field => {
    if (!values[field]) {
      errors[field] = `Required`;
    }
  });

  return errors;
};

export default compose(
  connect(
    null,
    { signin, addNotification }
  ),
  reduxForm({ form: 'signin', validate })
)(Signin);
