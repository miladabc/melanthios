import axios from 'axios';

const API_URI = process.env.REACT_APP_API_URI;

const signup = (formProps, addNot) => {
  axios
    .post(`${API_URI}/auth/signup`, formProps)
    .then(res => addNot(res.data))
    .catch(err => addNot(err.response.data));
};

const resendEmail = (formProps, addNot) => {
  axios
    .post(`${API_URI}/auth/resend`, formProps)
    .then(res => addNot(res.data))
    .catch(err => addNot(err.response.data));
};

const verifyEmail = (formProps, redirect, addNot) => {
  axios
    .post(`${API_URI}/auth/confirmation`, formProps)
    .then(() => redirect())
    .catch(err => addNot(err.response.data));
};

export { signup, resendEmail, verifyEmail };
