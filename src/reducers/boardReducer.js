import { UPDATE_SIMPLE_BOARD } from '../actions/types';

export default function(
  state = {
    simple: Array(9).fill(null)
  },
  action
) {
  switch (action.type) {
    case UPDATE_SIMPLE_BOARD:
      return { ...state, simple: action.payload };
    default:
      return state;
  }
}
