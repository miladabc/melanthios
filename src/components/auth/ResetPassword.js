import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import queryString from 'query-string';

import { resetPassword } from '../../utils/authUtils';

class ResetPassword extends Component {
  onSubmit = formProps => {
    resetPassword(
      {
        ...formProps,
        token: queryString.parse(this.props.location.search).token
      },
      () => this.props.history.push('/signin')
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
    const { handleSubmit } = this.props;

    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
            <form
              className="login100-form validate-form flex-sb flex-w"
              onSubmit={handleSubmit(this.onSubmit)}
            >
              <span className="login100-form-title p-b-53">Reset Password</span>

              <Field
                name="password"
                type="password"
                component={this.renderField}
                label="New Password"
              />

              <Field
                name="confirmPassword"
                type="password"
                component={this.renderField}
                label="Confirm New Password"
              />

              <div id="button" className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const validate = ({ password, confirmPassword }) => {
  const errors = {};

  if (!password) {
    errors.password = `Required`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = `Required`;
  }

  if (password !== confirmPassword)
    errors.confirmPassword = 'Passwords does not match';

  return errors;
};

export default reduxForm({ form: 'resetPassword', validate })(ResetPassword);
