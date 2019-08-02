import { LIST_ROOMS, JOIN_ROOM } from '../actions/types';

export default function(
  state = {
    all: [],
    available: [],
    joined: {},
    mode: 'simple'
  },
  action
) {
  switch (action.type) {
    case LIST_ROOMS:
      const { all, available, joined } = action.payload;

      return { ...state, all, available, joined };
    case JOIN_ROOM:
      state.joined.name = action.payload;

      return state;
    default:
      return state;
  }
}
