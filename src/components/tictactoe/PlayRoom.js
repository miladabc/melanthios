import React, { Component } from 'react';
import { connect } from 'react-redux';

import './playRoom.css';
import requireAuth from '../requireAuth';
import boardActions from '../../actions/boardActions';
import statusActions from '../../actions/statusActions';
import SimpleBoard from './SimpleBoard';
import UltimateBoard from './UltimateBoard';
import ChatBox from '../ChatBox';

class PlayRoom extends Component {
  componentDidMount() {
    const {
      socket,
      room,
      updateStatus,
      updateBoard,
      user,
      status
    } = this.props;

    if (socket) {
      socket.emit('whosTurn', room.name, ({ turn, opponent }) => {
        updateStatus({ turn, opponent });
      });

      socket.on(
        'turnPlayed',
        ({
          status: { board, winner, line, gameFinished },
          lastMovePosition
        }) => {
          updateStatus({
            turn: true,
            winner,
            line,
            gameFinished,
            lastMovePosition
          });
          updateBoard(room.mode, board);
        }
      );

      socket.on('resetGame', ({ playerTurn }) => {
        let turn = status.winner === user.username;
        if (status.winner === 'DRAW') turn = socket.id === playerTurn;

        updateStatus({
          turn,
          winner: '',
          line: [],
          gameFinished: false
        });
        updateBoard(room.mode, Array(9).fill(null));
      });
    }
  }

  render() {
    const { room, status } = this.props;

    return (
      <div className="play-room">
        <div className="card details">
          <div className="card-body">
            <h4 className="text-white">Room:</h4>
            <p className="details-room_name card-text h4">{room.name}</p>
            <h5 className="text-white">Mode:</h5>
            <p className="details-room_name card-text h4">{room.mode}</p>
            <h5 className="text-white">Opponent:</h5>
            <p className="card-text h4">{status.opponent}</p>
          </div>
        </div>
        {room.mode === 'simple' ? <SimpleBoard /> : <UltimateBoard />}
        <ChatBox />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  room: state.rooms.joined,
  status: state.status
});

const mapDispatchToProps = {
  updateBoard: boardActions.updateBoard,
  updateStatus: statusActions.updateStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(requireAuth(PlayRoom));
