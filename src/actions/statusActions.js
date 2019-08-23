import { UPDATE_STATUS } from './types';

const updateStatus = payload => {
  return { type: UPDATE_STATUS, payload };
};

export default { updateStatus };
