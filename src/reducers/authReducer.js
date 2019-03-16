import { AUTH_USER } from '../actions/types';
import { decodeAuthToken } from '../utils/authUtils';

export default function(
  state = {
    authenticated: '',
    user: null
  },
  action
) {
  switch (action.type) {
    case AUTH_USER:
      return decodeAuthToken(action.payload);
    default:
      return state;
  }
}
