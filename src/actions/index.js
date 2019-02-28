import axios from 'axios';

import { AUTH_USER, ADD_NOTIFICATION } from './types';

const addNotification = ({ success, msg: message }) => dispatch => {
  if (message) {
    const title = success ? 'Success' : 'Error';
    const notType = success ? 'success' : 'danger';

    dispatch({
      type: ADD_NOTIFICATION,
      title,
      message,
      notType
    });
  }
};

const signin = (formProps, redirect, toggleVisibility) => dispatch => {
  axios
    .post('/auth/signin', formProps)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data.token });
      localStorage.setItem('token', res.data.token);
      redirect();
    })
    .catch(() => toggleVisibility());
};

const googleOAuth = (googleResponse, redirect, addNot) => dispatch => {
  axios
    .post('/auth/google', {
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

const updateProfile = (formProps, redirect, toggleVisibility) => dispatch => {
  axios
    .patch('/user/profile', formProps)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data.token });
      localStorage.setItem('token', res.data.token);
      redirect();
    })
    .catch(() => toggleVisibility());
};

export { addNotification, signin, googleOAuth, signout, updateProfile };
