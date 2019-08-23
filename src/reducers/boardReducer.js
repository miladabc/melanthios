import { UPDATE_BOARD } from '../actions/types';

const simple = {
  smallBoard: Array(9).fill(null),
  marksNum: 0
};

const ultimate = {
  largeBoard: Array.from({ length: 9 }, () => ({
    smallBoard: Array(9).fill(null),
    marksNum: 0
  })),
  boardsWinner: Array(9).fill(null)
};

export default function(
  state = {
    simple,
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
