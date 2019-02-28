import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import './profile.css';
import requireAuth from '../requireAuth';
import { profileValidate, asyncValidate } from '../../utils/formsValidation';
import { updateProfile } from '../../actions';

const FIELDS = [
  { label: 'First Name', type: 'text', name: 'firstName' },
  { label: 'Last Name', type: 'text', name: 'lastName' },
  { label: 'Username', type: 'text', name: 'username' },
  { label: 'Email', type: 'email', name: 'email' },
  { label: 'Current Password', type: 'password', name: 'currentPassword' },
  { label: 'New Password', type: 'password', name: 'newPassword' },
  {
    label: 'Confirm New Password',
    type: 'password',
    name: 'confirmNewPassword'
  }
];

class ProfileEdit extends Component {
  state = { isHidden: false };

  onSubmit = formProps => {
    this.toggleVisibility();
    this.props.updateProfile(
      formProps,
      () => this.props.history.push('/profile'),
      this.toggleVisibility
    );
  };

  toggleVisibility = () => {
    this.setState({
      isHidden: !this.state.isHidden
    });
  };

  profileField = ({
    input,
    label,
    type,
    meta: { asyncValidating, touched, error }
  }) => {
    const className = `wrap-input100 ${
      asyncValidating ? 'async-validating' : ''
    }`;

    return (
      <fieldset>
        <div className="p-t-31 p-b-9">
          <label className="txt1">{label}</label>
        </div>
        <div className={className}>
          <input
            className="input100"
            {...input}
            type={type}
            placeholder={this.props.user[input.name]}
          />
          <span className="focus-input100" />
        </div>
        {touched && error && <span className="text-danger">{error}</span>}
      </fieldset>
    );
  };

  renderFields() {
    return FIELDS.map(({ label, type, name }) => {
      return (
        <Field
          key={name}
          label={label}
          type={type}
          name={name}
          component={this.profileField}
        />
      );
    });
  }

  onImageChange = event => {
    console.log(event.target.files[0]);
  };

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="container emp-profile">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img">
                <img className="rounded-circle" src="/images/user.png" alt="" />
                <div id="imgfile" className="file btn btn-lg btn-primary">
                  Change Photo
                  <input
                    type="file"
                    name="proPhoto"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={this.onImageChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <h3>Update your profile</h3>
              {this.renderFields()}
            </div>
          </div>

          <div className="col-md-4" style={{ margin: 'auto' }}>
            {!this.state.isHidden ? (
              <button
                className="login100-form-btn"
                style={{ marginTop: '30px' }}
                disabled={submitting}
              >
                Save
              </button>
            ) : (
              <img src="/images/loading.svg" height="120" width="120" alt="" />
            )}
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  connect(
    mapStateToProps,
    { updateProfile }
  ),
  reduxForm({
    form: 'profile',
    validate: profileValidate,
    asyncValidate,
    asyncBlurFields: ['username', 'email']
  })
)(requireAuth(ProfileEdit));
