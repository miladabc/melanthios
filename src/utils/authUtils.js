import axios from 'axios';

const API_URI = process.env.REACT_APP_API_URI;

const signup = (formProps, addNot, toggleVisibility) => {
  axios
    .post(`${API_URI}/auth/signup`, formProps)
    .then(res => addNot(res.data))
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const resendEmail = (formProps, addNot, toggleVisibility, toggleDisablity) => {
  axios
    .post(`${API_URI}/auth/resend`, formProps)
    .then(res => {
      addNot(res.data);
      toggleDisablity();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

const verifyEmail = (formProps, redirect, addNot, toggleVisibility) => {
  axios
    .post(`${API_URI}/auth/confirmation`, formProps)
    .then(res => {
      addNot(res.data);
      redirect();
    })
    .catch(err => addNot(err.response.data))
    .finally(() => toggleVisibility());
};

export { signup, resendEmail, verifyEmail };
