import React, { Component } from 'react';
import { connect } from 'react-redux';

import './playRoom.css';
import requireAuth from '../requireAuth';
import { scrollChatBoxToBottom } from '../../utils/chatUtils';
import { addMessage } from '../../actions/chatActions';
import { updateBoard } from '../../actions/boardActions';
import { updateStatus } from '../../actions/statusActions';

class PlayRoom extends Component {
  state = { message: '' };

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

  handleCellClick(cellNum) {
    const board = [...this.props.board.simple];
    board[cellNum] = this.props.user.username;

    this.props.updateStatus({ turn: false });
    this.props.updateBoard(this.props.gameMode, board);

    this.props.socket.emit(
      'turnPlayed',
      { room: this.props.joinedRoom, board },
      ({ winner, line, gameFinished }) => {
        this.props.updateStatus({ winner, line, gameFinished });
      }
    );
  }

  resetGame = () => {
    this.props.socket.emit('resetGame', this.props.joinedRoom);
  };

  handleMessageChange = event => {
    this.setState({ message: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    const message = {
      sender: this.props.user.username,
      payload: this.state.message
    };

    this.props.socket.emit('message', {
      room: this.props.joinedRoom,
      message
    });

    this.setState({ message: '' });
    this.props.addMessage(message);

    scrollChatBoxToBottom();
  };

  renderMessages = () => {
    return this.props.messages.map(({ sender, payload }, i) => {
      let style = { alignSelf: 'flex-end', backgroundColor: '#0e7995' };

      if (sender !== this.props.user.username)
        style = { alignSelf: 'flex-start', backgroundColor: '#8f2424' };

      return (
        <li className="message" style={style} key={i}>
          <p className="message-text text-light font-weight-bold">{payload}</p>
        </li>
      );
    });
  };

  renderRow(rowNum) {
    const row = [];
    let j = 0;
    if (rowNum === 1) j = 3;
    if (rowNum === 2) j = 6;

    for (let i = 0; i < 3; i++) {
      const cell = i + j;
      const sign =
        this.props.board.simple[cell] === this.props.user.username ? '╳' : '◯';
      let gameCellClassNames = 'game-cell-disabled';
      let onClick = null;
      let backgroundColor;

      if (this.props.status.turn || this.props.status.gameFinished)
        gameCellClassNames = '';

      if (
        this.props.status.turn &&
        !this.props.status.gameFinished &&
        !this.props.board.simple[cell]
      ) {
        gameCellClassNames = 'hoverable';

        onClick = () => this.handleCellClick(cell);
      }

      if (
        this.props.status.gameFinished &&
        this.props.status.line.includes(cell)
      ) {
        if (this.props.status.winner === this.props.user.username)
          backgroundColor = '#70db70';
        else backgroundColor = '#ff8a80';
      }

      row.push(
        <div
          className={`game-cell ${gameCellClassNames}`}
          onClick={onClick}
          style={{ backgroundColor }}
          key={cell}
        >
          <span className="game-cell-label center-align">
            {this.props.board.simple[cell] && sign}
          </span>
        </div>
      );
    }

    return row;
  }

  renderBoard() {
    const rows = [];
    let status = this.props.status.turn ? 'Your Turn' : 'Opponent Turn';

    if (this.props.status.gameFinished)
      switch (this.props.status.winner) {
        case 'DRAW':
          status = 'DRAW';
          break;
        case this.props.user.username:
          status = 'You won!';
          break;
        default:
          status = 'You lose!';
      }

    for (let i = 0; i < 3; i++) {
      rows.push(
        <div className="game-row" key={`row${i}`}>
          {this.renderRow(i)}
        </div>
      );
    }

    return (
      <>
        <div className="game-grid center-align tall-container-grow">
          <span className="turn text-light">{status}</span>
          {rows}
          {this.props.status.gameFinished ? (
            <button className="btn btn-danger" onClick={this.resetGame}>
              Play again
            </button>
          ) : null}
        </div>
      </>
    );
  }

  renderChatBox() {
    return (
      <div className="card border-secondary chat-box">
        <div className="card-header bg-transparent border-secondary text-light font-weight-bold text-center">
          Talk to your opponent
        </div>
        <div id="chat-history" className="card-body text-secondary">
          <ul className="messages">{this.renderMessages()}</ul>
        </div>
        <div className="card-footer bg-transparent border-secondary">
          <form onSubmit={this.sendMessage}>
            <div className="row">
              <div className="message-input col-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Message"
                  value={this.state.message}
                  onChange={this.handleMessageChange}
                />
              </div>
              <div className="message-btn col">
                <button type="submit" className="btn btn-success">
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
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
        {this.renderBoard()}
        {this.renderChatBox()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  joinedRoom: state.rooms.joined.name,
  gameMode: state.rooms.mode,
  messages: state.messages,
  board: state.board,
  status: state.status
});

export default connect(
  mapStateToProps,
  { addMessage, updateBoard, updateStatus }
)(requireAuth(PlayRoom));
