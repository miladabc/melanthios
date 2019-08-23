import { UPDATE_BOARD } from '../actions/types';

const ultimate = [];

for (let i = 0; i < 9; i++) {
  ultimate.push(Array(9).fill(null));
}

export default function(
  state = {
    simple: Array(9).fill(null),
    ultimate
  },
  action
) {
  switch (action.type) {
    case UPDATE_BOARD:
      return { ...state, [action.gameMode]: action.payload };
    default:
      return state;
  }
}
