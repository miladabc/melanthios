import React, { Component } from 'react';
import { connect } from 'react-redux';

import './playRoom.css';
import requireAuth from '../requireAuth';
import { updateBoard } from '../../actions/boardActions';
import { updateStatus } from '../../actions/statusActions';
import SimpleBoard from './SimpleBoard';
import ChatBox from '../ChatBox';

class PlayRoom extends Component {
  componentDidMount() {
    if (this.props.socket) {
      this.props.socket.emit(
        'whosTurn',
        this.props.joinedRoom,
        ({ turn, opponent }) => {
          this.props.updateStatus({ turn, opponent });
        }
      );

      this.props.socket.on(
        'turnPlayed',
        ({ board, status: { winner, line, gameFinished } }) => {
          this.props.updateStatus({ turn: true, winner, line, gameFinished });
          this.props.updateBoard(this.props.gameMode, board);
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
        this.props.updateBoard(this.props.gameMode, Array(9).fill(null));
      });
    }
  }

  render() {
    return (
      <div className="play-room">
        <div className="card details">
          <div className="card-body">
            <h4 className="text-white">Game Room:</h4>
            <p className="details-room_name card-text h4">
              {this.props.joinedRoom}
            </p>
            <h5 className="text-white">Opponent:</h5>
            <p className="card-text h4">{this.props.status.opponent}</p>
          </div>
        </div>
        <SimpleBoard />
        <ChatBox />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  joinedRoom: state.rooms.joined.name,
  gameMode: state.rooms.mode,
  status: state.status
});

export default connect(
  mapStateToProps,
  { updateBoard, updateStatus }
)(requireAuth(PlayRoom));
