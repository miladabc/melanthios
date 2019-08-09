import React, { Component } from 'react';
import { connect } from 'react-redux';

import './playRoom.css';
import requireAuth from '../requireAuth';
import { updateBoard } from '../../actions/boardActions';
import { updateStatus } from '../../actions/statusActions';
import SimpleBoard from './SimpleBoard';
import UltimateBoard from './UltimateBoard';
import ChatBox from '../ChatBox';

class PlayRoom extends Component {
  componentDidMount() {
    if (this.props.socket) {
      this.props.socket.emit(
        'whosTurn',
        this.props.room.name,
        ({ turn, opponent }) => {
          this.props.updateStatus({ turn, opponent });
        }
      );

      this.props.socket.on(
        'turnPlayed',
        ({ board, status: { winner, line, gameFinished } }) => {
          this.props.updateStatus({ turn: true, winner, line, gameFinished });
          this.props.updateBoard(this.props.room.mode, board);
        }
      );

      this.props.socket.on('resetGame', ({ playerTurn }) => {
        let turn = this.props.status.winner === this.props.user.username;
        if (this.props.status.winner === 'DRAW')
          turn = this.props.socket.id === playerTurn;

        this.props.updateStatus({
          turn,
          winner: '',
          line: [],
          gameFinished: false
        });
        this.props.updateBoard(this.props.room.mode, Array(9).fill(null));
      });
    }
  }

  render() {
    return (
      <div className="play-room">
        <div className="card details">
          <div className="card-body">
            <h4 className="text-white">Room:</h4>
            <p className="details-room_name card-text h4">
              {this.props.room.name}
            </p>
            <h5 className="text-white">Mode:</h5>
            <p className="details-room_name card-text h4">
              {this.props.room.mode}
            </p>
            <h5 className="text-white">Opponent:</h5>
            <p className="card-text h4">{this.props.status.opponent}</p>
          </div>
        </div>
        {this.props.room.mode === 'simple' ? (
          <SimpleBoard />
        ) : (
          <UltimateBoard />
        )}
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

export default connect(
  mapStateToProps,
  { updateBoard, updateStatus }
)(requireAuth(PlayRoom));
