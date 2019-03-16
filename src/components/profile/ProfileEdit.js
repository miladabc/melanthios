import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import './profile.css';
import requireAuth from '../requireAuth';
import { profileValidate, asyncValidate } from '../../utils/formsValidation';
import { updateProfile, changeAvatar, deleteAvatar } from '../../actions';
import { avatarUrl } from '../../utils/userUtils';

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
  state = { avatar: null };

  onSubmit = formProps => {
    this.props.updateProfile(formProps, () =>
      this.props.history.push('/profile')
    );
  };

  onImageChange = event => {
    this.setState({ avatar: event.target.files[0] });
  };

  onChangeAvatar = () => {
    this.props.changeAvatar(this.state.avatar, () =>
      this.props.history.push('/profile')
    );
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

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div className="container-login100">
        <div className="container emp-profile">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row">
              <div className="col-md-4">
                <div className="profile-img">
                  <img
                    className="rounded-circle"
                    src={avatarUrl(this.props.user.avatar)}
                    alt=""
                  />
                  <div className="file btn btn-lg btn-primary avatar">
                    Select Photo
                    <input
                      className="avatar-input"
                      type="file"
                      name="proPhoto"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={this.onImageChange}
                    />
                  </div>
                  <div className="avatar-btns">
                    <button
                      className="btn btn-info"
                      onClick={this.onChangeAvatar}
                      disabled={!this.state.avatar}
                    >
                      Change
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={this.props.deleteAvatar}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h3 className="profile-edit-header">Update your profile</h3>
                {this.renderFields()}
              </div>
            </div>

            <div className="col-md-4 profile-save-btn">
              <button className="login100-form-btn" disabled={submitting}>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth.user });

export default compose(
  connect(
    mapStateToProps,
    { updateProfile, changeAvatar, deleteAvatar }
  ),
  reduxForm({
    form: 'profile',
    validate: profileValidate,
    asyncValidate,
    asyncBlurFields: ['username', 'email']
  })
)(requireAuth(ProfileEdit));
