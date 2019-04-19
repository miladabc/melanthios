import { GET_SOCKET, CLOSE_SOCKET } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case GET_SOCKET:
      return action.payload;
    case CLOSE_SOCKET:
      state.close();
      return null;
    default:
      return state;
  }
};
