import { LIST_ROOMS, JOIN_ROOM } from './types';

const roomNamePrefix = 'ttt_';

const listRooms = (rooms, previousJoinedRoom) => {
  const rs = Object.entries(rooms).reduce(
    (result, [roomName, room]) => {
      if (roomName.slice(0, 4) === roomNamePrefix) {
        const name = roomName.slice(4);

        result.all.push(name);

        if (name === previousJoinedRoom.name)
          result.joined = { name, length: room.length, mode: room.mode };
        else if (room.length === 1)
          result.available.push({ name, mode: room.mode });
      }

      return result;
    },
    { all: [], available: [], joined: {} }
  );

  return { type: LIST_ROOMS, payload: rs };
};

const joinRoom = roomToJoin => {
  return { type: JOIN_ROOM, payload: roomToJoin };
};

export { listRooms, joinRoom };
