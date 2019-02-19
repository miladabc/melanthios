import axios from 'axios';
import jwtDecode from 'jwt-decode';

const signup = (formProps, addNot, toggleVisibility) => {
  axios
    .post('/auth/signup', formProps)
    .then(res => addNot(res.data))
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const resendEmail = (formProps, addNot, toggleVisibility, toggleDisablity) => {
  axios
    .post('/auth/resend', formProps)
    .then(res => {
      addNot(res.data);
      toggleDisablity();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const verifyEmail = (formProps, redirect, addNot, toggleVisibility) => {
  axios
    .post('/auth/confirmation', formProps)
    .then(res => {
      addNot(res.data);
      redirect();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const decodeAuthToken = token => {
  try {
    const jwt = token || localStorage.getItem('token');
    return jwtDecode(jwt);
  } catch (err) {
    return null;
  }
};

const forgotPassword = (
  formProps,
  addNot,
  toggleVisibility,
  toggleDisablity
) => {
  axios
    .post('/auth/forgotpass', formProps)
    .then(res => {
      addNot(res.data);
      toggleDisablity();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const resetPassword = (formProps, redirect, addNot, toggleVisibility) => {
  axios
    .post('/auth/resetpass', formProps)
    .then(res => {
      addNot(res.data);
      redirect();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

export {
  signup,
  resendEmail,
  verifyEmail,
  decodeAuthToken,
  forgotPassword,
  resetPassword
};
