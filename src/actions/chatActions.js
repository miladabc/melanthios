import { ADD_MESSAGE } from './types';

const addMessage = message => {
  return { type: ADD_MESSAGE, payload: message };
};

export { addMessage };
