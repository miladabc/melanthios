import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signin, addNotification } from '../../actions';
import GoogleOAuth from './GoogleOAuth';

const FIELDS = [
  { label: 'Email or Username', type: 'text', name: 'emailOrUsername' },
  { label: 'Password', type: 'password', name: 'password' }
];

class Signin extends Component {
  state = { isHidden: false };

  onSubmit = formProps => {
    this.toggleVisibility();
    this.props.signin(
      formProps,
      () => {
        this.props.history.push('/feature');
      },
      this.props.addNotification,
      this.toggleVisibility
    );
  };

  toggleVisibility = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  signinField({ input, label, type, meta: { touched, error } }) {
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

  renderFields() {
    return FIELDS.map(({ label, type, name }) => {
      return (
        <Field
          key={name}
          label={label}
          type={type}
          name={name}
          component={this.signinField}
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

              {this.renderFields()}

              <div className="container-login100-form-btn m-t-17">
                {!this.state.isHidden ? (
                  <button className="login100-form-btn" disabled={submitting}>
                    Sign In
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
                <div className="txt2" style={{ marginBottom: '10px' }}>
                  <Link className="txt2 bo1 m-l-5" to="/forgotpass">
                    Forgot password?
                  </Link>
                </div>

                <div className="txt2" style={{ marginBottom: '10px' }}>
                  Resend verification email?{' '}
                  <Link className="txt2 bo1" to="/resendemail">
                    Resend
                  </Link>
                </div>

                <div className="txt2">
                  Not a member?{' '}
                  <Link className="txt2 bo1" to="/signup">
                    Sign up now
                  </Link>
                </div>
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
