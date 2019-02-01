import axios from 'axios';

import { AUTH_USER } from './types';
import { API_URI } from '../config';

export const signup = (formProps, showNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/signup`, formProps)
    .then(res =>
      showNot({
        title: 'Success',
        message: res.data.msg,
        type: 'success'
      })
    )
    .catch(err =>
      showNot({
        title: 'Error',
        message: err.response.data.msg,
        type: 'danger'
      })
    );
};

export const signin = (formProps, redirect, showNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/signin`, formProps)
    .then(res => {
      dispatch({ type: AUTH_USER, payload: res.data.token });
      localStorage.setItem('token', res.data.token);
      redirect();
    })
    .catch(err =>
      showNot({
        title: 'Error',
        message: err.response.data.msg,
        type: 'danger'
      })
    );
};

export const googleOAuth = (googleResponse, redirect, showNot) => dispatch => {
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
    .catch(err =>
      showNot({
        title: 'Error',
        message: 'Could not authenticate with google',
        type: 'danger'
      })
    );
};

export const signout = () => {
  localStorage.removeItem('token');

  return {
    type: AUTH_USER,
    payload: ''
  };
};

export const resendEmail = (formProps, showNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/resend`, formProps)
    .then(res =>
      showNot({
        title: 'Success',
        message: res.data.msg,
        type: 'success'
      })
    )
    .catch(err =>
      showNot({
        title: 'Error',
        message: err.response.data.msg,
        type: 'danger'
      })
    );
};

export const verifyEmail = (formProps, redirect, showNot) => dispatch => {
  axios
    .post(`${API_URI}/auth/confirmation`, formProps)
    .then(res => {
      redirect();
    })
    .catch(err =>
      showNot({
        title: 'Error',
        message: err.response.data.msg,
        type: 'danger'
      })
    );
};
