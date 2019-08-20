import React, { Component } from 'react';
import { connect } from 'react-redux';

import './simpleBoard.css';
import { updateBoard } from '../../actions/boardActions';
import { updateStatus } from '../../actions/statusActions';

class SimpleBoard extends Component {
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
          className={`s-game-cell ${gameCellClassNames}`}
          onClick={onClick}
          style={{ backgroundColor }}
          key={cell}
        >
          <span className="s-game-cell-label center-align">
            {this.props.board.simple[cell] && sign}
          </span>
        </div>
      );
    }

    return row;
  }

  render() {
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
      <div className="s-game-grid center-align tall-container-grow">
        <span className="turn text-light">{status}</span>
        {rows}
        {this.props.status.gameFinished ? (
          <button className="btn btn-danger" onClick={this.resetGame}>
            Play again
          </button>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  user: state.auth.user,
  joinedRoom: state.rooms.joined.name,
  gameMode: state.rooms.joined.mode,
  board: state.board,
  status: state.status
});

export default connect(
  mapStateToProps,
  { updateBoard, updateStatus }
)(SimpleBoard);
