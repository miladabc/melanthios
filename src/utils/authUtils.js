import axios from 'axios';
import jwtDecode from 'jwt-decode';

const signup = (formProps, toggleVisibility) => {
  axios.post('/auth/signup', formProps).finally(() => toggleVisibility());
};

const resendEmail = (formProps, toggleVisibility) => {
  axios.post('/auth/resend', formProps).finally(() => toggleVisibility());
};

const verifyEmail = (formProps, redirect, toggleVisibility) => {
  axios
    .post('/auth/confirmation', formProps)
    .then(() => redirect())
    .finally(() => toggleVisibility());
};

const decodeAuthToken = token => {
  const auth = { authenticated: null, user: null };

  try {
    const now = Date.now().valueOf() / 1000;
    const decodedJWT = jwtDecode(token);

    if (decodedJWT.exp > now) {
      auth.authenticated = token;
      auth.user = decodedJWT;
    }
  } finally {
    return auth;
  }
};

const forgotPassword = (formProps, toggleVisibility) => {
  axios.post('/auth/forgotpass', formProps).finally(() => toggleVisibility());
};

const resetPassword = (formProps, redirect, toggleVisibility) => {
  axios
    .post('/auth/resetpass', formProps)
    .then(() => redirect())
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
