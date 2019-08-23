import React, { Component } from 'react';
import { connect } from 'react-redux';

import './board.css';
import './simpleBoard.css';
import boardActions from '../../actions/boardActions';
import statusActions from '../../actions/statusActions';

class SimpleBoard extends Component {
  resetGame = () => {
    const { socket, joinedRoom } = this.props;

    socket.emit('resetGame', joinedRoom.name);
  };

  handleCellClick(cellNum) {
    const {
      simpleBoard,
      user,
      updateStatus,
      updateBoard,
      socket,
      joinedRoom
    } = this.props;

    const board = [...simpleBoard];
    board[cellNum] = user.username;

    updateStatus({ turn: false });
    updateBoard(joinedRoom.mode, board);

    socket.emit(
      'turnPlayed',
      { room: joinedRoom, board },
      ({ winner, line, gameFinished }) => {
        updateStatus({ winner, line, gameFinished });
      }
    );
  }

  renderRow(rowNum) {
    const { simpleBoard, user, status } = this.props;

    const row = [];
    let j = 0;
    if (rowNum === 1) j = 3;
    if (rowNum === 2) j = 6;

    for (let i = 0; i < 3; i++) {
      const cell = i + j;
      const cellMarkedBy = simpleBoard[cell];
      const mark = cellMarkedBy === user.username ? '╳' : '◯';
      let isCellClickable = '';
      let onClick = null;
      let backgroundColor;

      if (status.turn && !status.gameFinished && !cellMarkedBy) {
        isCellClickable = 'game-cell-clickable';

        onClick = () => this.handleCellClick(cell);
      }

      if (status.gameFinished && status.line.includes(cell)) {
        if (status.winner === user.username) backgroundColor = '#70db70';
        else backgroundColor = '#ff8a80';
      }

      row.push(
        <div
          className={`s-game-cell ${isCellClickable}`}
          onClick={onClick}
          style={{ backgroundColor }}
          key={cell}
        >
          <span className="s-game-cell-label center-align">
            {cellMarkedBy && mark}
          </span>
        </div>
      );
    }

    return row;
  }

  render() {
    const { status, user } = this.props;

    let isBoardDisabled = '';
    const rows = [];
    let gameStatus = status.turn ? 'Your Turn' : 'Opponent Turn';

    if (!status.turn && !status.gameFinished)
      isBoardDisabled = 'disabled-board';

    if (status.gameFinished)
      switch (status.winner) {
        case 'DRAW':
          gameStatus = 'DRAW';
          break;
        case user.username:
          gameStatus = 'You won!';
          break;
        default:
          gameStatus = 'You lose!';
      }

    for (let i = 0; i < 3; i++) {
      rows.push(
        <div className="game-row" key={`row${i}`}>
          {this.renderRow(i)}
        </div>
      );
    }

    return (
      <div
        className={`s-game-grid center-align tall-container-grow ${isBoardDisabled}`}
      >
        <span className="turn text-light">{gameStatus}</span>
        {rows}
        {status.gameFinished ? (
          <button
            className="btn btn-danger"
            type="button"
            onClick={this.resetGame}
          >
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
  joinedRoom: state.rooms.joined,
  simpleBoard: state.board.simple,
  status: state.status
});

const mapDispatchToProps = {
  updateBoard: boardActions.updateBoard,
  updateStatus: statusActions.updateStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleBoard);
