import axios from 'axios';
import io from 'socket.io-client';

import { AUTH_USER, ADD_NOTIFICATION, GET_SOCKET, CLOSE_SOCKET } from './types';

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

const getUser = () => dispatch => {
  axios.get('/user').then(({ data }) => {
    dispatch({ type: AUTH_USER, payload: data.token });
    localStorage.setItem('token', data.token);
  });
};

const signin = (formProps, redirect) => dispatch => {
  axios.post('/auth/signin', formProps).then(res => {
    dispatch({ type: AUTH_USER, payload: res.data.token });
    redirect(res.data.username);
  });
};

const googleOAuth = (googleResponse, redirect, addNot) => dispatch => {
  axios
    .post('/auth/google', {
      access_token: googleResponse.accessToken
    })
    .then(res => {
      if (res.data.token) {
        dispatch({ type: AUTH_USER, payload: res.data.token });
        redirect();
      }
    })
    .catch(() =>
      addNot({ success: false, msg: 'Could not authenticate with google' })
    );
};

const signout = () => dispatch => {
  localStorage.removeItem('token');
  dispatch({ type: AUTH_USER, payload: '' });
  dispatch({ type: CLOSE_SOCKET });
};

const updateProfile = (formProps, redirect) => dispatch => {
  axios.patch('/user/profile', formProps).then(res => {
    dispatch({ type: AUTH_USER, payload: res.data.token });
    redirect();
  });
};

const changeAvatar = (avatar, redirect) => dispatch => {
  axios.get('/auth/uploadurl').then(({ data }) => {
    const imageUpload = new FormData();
    imageUpload.append('file', avatar);
    imageUpload.append('signature', data.signature);
    imageUpload.append('timestamp', data.timestamp);
    imageUpload.append('api_key', data.api_key);
    imageUpload.append('folder', data.folder);

    axios
      .post(data.url, imageUpload, {
        transformRequest: [
          (data, headers) => {
            delete headers.common.Authorization;
            return data;
          }
        ]
      })
      .then(({ data: { public_id, format } }) => {
        axios.patch('/user/profile/avatar', { public_id, format }).then(res => {
          dispatch({ type: AUTH_USER, payload: res.data.token });
          redirect();
        });
      });
  });
};

const deleteAvatar = () => dispatch => {
  axios.delete('/user/profile/avatar').then(res => {
    dispatch({ type: AUTH_USER, payload: res.data.token });
  });
};

const getSocket = username => {
  const socket = io(`${process.env.REACT_APP_API_URI}?username=${username}`);

  return { type: GET_SOCKET, payload: socket };
};

export {
  addNotification,
  getUser,
  signin,
  googleOAuth,
  signout,
  updateProfile,
  changeAvatar,
  deleteAvatar,
  getSocket
};
