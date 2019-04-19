import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import notificationReducer from './notificationReducer';
import socketReducer from './socketReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  notification: notificationReducer,
  socket: socketReducer
});
