import axios from 'axios';
import jwtDecode from 'jwt-decode';

const signup = formProps => {
  axios.post('/auth/signup', formProps);
};

const resendEmail = formProps => {
  axios.post('/auth/resend', formProps);
};

const verifyEmail = (formProps, redirect) => {
  axios.post('/auth/confirmation', formProps).then(() => redirect());
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

const forgotPassword = formProps => {
  axios.post('/auth/forgotpass', formProps);
};

const resetPassword = (formProps, redirect) => {
  axios.post('/auth/resetpass', formProps).then(() => redirect());
};

export {
  signup,
  resendEmail,
  verifyEmail,
  decodeAuthToken,
  forgotPassword,
  resetPassword
};
