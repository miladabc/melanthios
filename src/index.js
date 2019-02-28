import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import 'react-notifications-component/dist/theme.css';
import { decodeAuthToken } from './utils/authUtils';
import reducers from './reducers';
import Notification from './components/Notification';
import App from './components/App';

const store = createStore(
  reducers,
  {
    auth: decodeAuthToken(localStorage.getItem('token'))
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <Notification />
    <App />
  </Provider>,
  document.querySelector('#root')
);
