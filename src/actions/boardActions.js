import { UPDATE_BOARD } from './types';

const updateBoard = (gameMode, board) => {
  return { type: UPDATE_BOARD, payload: board, gameMode };
};

export { updateBoard };
