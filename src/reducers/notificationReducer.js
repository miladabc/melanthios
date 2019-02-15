import { ADD_NOTIFICATION } from '../actions/types';

export default function(state = {}, action) {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        title: action.title,
        message: action.message,
        notType: action.notType
      };
    default:
      return state;
  }
}
