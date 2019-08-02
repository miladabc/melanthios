import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './authReducer';
import notificationReducer from './notificationReducer';
import socketReducer from './socketReducer';
import roomsReducer from './roomsReducer';
import messagesReducer from './messagesReducer';
import boardReducer from './boardReducer';
import statusReducer from './statusReducer';

export default combineReducers({
  auth: authReducer,
  form: formReducer,
  notification: notificationReducer,
  socket: socketReducer,
  rooms: roomsReducer,
  messages: messagesReducer,
  board: boardReducer,
  status: statusReducer
});
