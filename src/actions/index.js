import axios from 'axios';

import { AUTH_USER, ADD_NOTIFICATION } from './types';

const API_URI = process.env.REACT_APP_API_URI;

const addNotification = ({ success, msg: message }) => {
  const title = success ? 'Success' : 'Error';
  const notType = success ? 'success' : 'danger';

  return {
    type: ADD_NOTIFICATION,
    title,
    message,
    notType
  };
};

const signin = (formProps, redirect, addNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/signin`, formProps)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data.token });
      localStorage.setItem('token', res.data.token);
      redirect();
    })
    .catch(err => {
      addNot(err.response.data);
    });
};

const googleOAuth = (googleResponse, redirect, addNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/google`, {
      access_token: googleResponse.accessToken
    })
    .then(res => {
      if (res.data.token) {
        dispatch({ type: AUTH_USER, payload: res.data.token });
        localStorage.setItem('token', res.data.token);
        redirect();
      }
    })
    .catch(() =>
      addNot({ success: false, msg: 'Could not authenticate with google' })
    );
};

const signout = () => {
  localStorage.removeItem('token');

  return {
    type: AUTH_USER,
    payload: ''
  };
};

export { addNotification, signin, googleOAuth, signout };
