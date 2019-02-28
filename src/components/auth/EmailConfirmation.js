import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import queryString from 'query-string';
import { Link } from 'react-router-dom';

import { verifyEmail } from '../../utils/authUtils';

class EmailConfirmation extends Component {
  state = { isHidden: false };

  onSubmit = formProps => {
    this.toggleVisibility();
    verifyEmail(
      formProps,
      () => this.props.history.push('/signin'),
      this.toggleVisibility
    );
  };

  toggleVisibility = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  renderField = ({ input, label, type, meta: { touched, error } }) => {
    return (
      <fieldset>
        <div className="p-t-31 p-b-9">
          <label className="txt1">{label}</label>
        </div>
        <div className="wrap-input100">
          <input
            className="input100"
            {...input}
            type={type}
            value={queryString.parse(this.props.location.search).token}
          />
          <span className="focus-input100" />
        </div>
        {touched && error && <span className="text-danger">{error}</span>}
      </fieldset>
    );
  };

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
              <span className="login100-form-title p-b-53">
                Email verification
              </span>

              <Field
                name="token"
                type="text"
                component={this.renderField}
                label="Your token"
              />

              <div className="container-login100-form-btn m-t-17">
                {!this.state.isHidden ? (
                  <button className="login100-form-btn" disabled={submitting}>
                    Verify Your Email
                  </button>
                ) : (
                  <img
                    src="/images/loading.svg"
                    height="120"
                    width="120"
                    style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    alt=""
                  />
                )}
              </div>

              <div className="w-full text-center p-t-55">
                <span className="txt2">Resend verification email? </span>

                <Link className="txt2 bo1" to="/resendemail">
                  Resend
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const validate = ({ token }) => {
  const errors = {};

  if (!token) {
    errors.token = `Required`;
  }

  return errors;
};

export default reduxForm({ form: 'confirmEmail', validate })(EmailConfirmation);
