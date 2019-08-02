import { UPDATE_SIMPLE_BOARD } from './types';

const updateBoard = (gameMode, board) => {
  if (gameMode === 'simple')
    return { type: UPDATE_SIMPLE_BOARD, payload: board };
};

export { updateBoard };
