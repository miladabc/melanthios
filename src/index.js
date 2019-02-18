import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import { decodeAuthToken } from './utils/authUtils';
import reducers from './reducers';
import App from './components/App';

const token = localStorage.getItem('token');

axios.defaults.baseURL = process.env.REACT_APP_API_URI;
axios.defaults.headers.common.Authorization = token;

const store = createStore(
  reducers,
  {
    auth: {
      authenticated: token,
      user: decodeAuthToken()
    }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
