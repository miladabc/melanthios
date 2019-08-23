import React, { Component } from 'react';
import { connect } from 'react-redux';

import './board.css';
import './ultimateBoard.css';
import { updateBoard } from '../../actions/boardActions';
import { updateStatus } from '../../actions/statusActions';

class UltimateBoard extends Component {
  handleCellClick(boardId, cellId) {
    const board = [...this.props.board];
    board[boardId][cellId] = this.props.user.username;

    this.props.updateStatus({ turn: false });
    this.props.updateBoard(this.props.joinedRoom.mode, board);

    this.props.socket.emit(
      'turnPlayed',
      { room: this.props.joinedRoom, board, lastMovePosition: cellId },
      ({ winner, line, gameFinished }) => {
        this.props.updateStatus({ winner, line, gameFinished });
      }
    );
  }

  renderCell(boardId, cellId) {
    const cellMarkedBy = this.props.board[boardId][cellId];
    const mark = cellMarkedBy === this.props.user.username ? '╳' : '◯';
    let isCellClickable = '';
    let onClick = null;

    if (
      !this.props.status.gameFinished &&
      this.props.status.turn &&
      !cellMarkedBy &&
      (this.props.status.lastMovePosition === -1 ||
        boardId === this.props.status.lastMovePosition)
    ) {
      isCellClickable = 'game-cell-clickable';
      onClick = () => this.handleCellClick(boardId, cellId);
    }

    return (
      <div
        className={`u-game-cell ${isCellClickable}`}
        onClick={onClick}
        key={cellId}
      >
        <span className="u-game-cell-label center-align">
          {cellMarkedBy && mark}
        </span>
      </div>
    );
  }

  renderCellsRow(boardId, cellsRowId) {
    const cells = [];
    let j;
    if (cellsRowId === 0) j = 0;
    if (cellsRowId === 1) j = 3;
    if (cellsRowId === 2) j = 6;

    for (let i = 0; i < 3; i++) cells.push(this.renderCell(boardId, i + j));

    return (
      <div className="game-row" key={cellsRowId}>
        {cells}
      </div>
    );
  }

  renderSmallBoard(boardId) {
    let isBoardDisabled = '';
    const cellRows = [];

    if (
      !this.props.status.gameFinished &&
      (!this.props.status.turn ||
        (this.props.status.lastMovePosition !== -1 &&
          this.props.status.lastMovePosition !== boardId))
    )
      isBoardDisabled = 'disabled-board';

    for (let i = 0; i < 3; i++) cellRows.push(this.renderCellsRow(boardId, i));

    return (
      <div
        className={`u-game-grid center-align ${isBoardDisabled}`}
        key={boardId}
      >
        {cellRows}
      </div>
    );
  }

  renderSmallBoardsRow(boardsRowId) {
    const smallBoards = [];
    let j;
    if (boardsRowId === 0) j = 0;
    if (boardsRowId === 1) j = 3;
    if (boardsRowId === 2) j = 6;

    for (let i = 0; i < 3; i++) smallBoards.push(this.renderSmallBoard(i + j));

    return (
      <div className="game-row" key={boardsRowId}>
        {smallBoards}
      </div>
    );
  }

  renderLargeBoard() {
    const smallBoardsRow = [];

    for (let i = 0; i < 3; i++)
      smallBoardsRow.push(this.renderSmallBoardsRow(i));

    return smallBoardsRow;
  }

  render() {
    return <div className="ultimate-board">{this.renderLargeBoard()}</div>;
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  user: state.auth.user,
  joinedRoom: state.rooms.joined,
  board: state.board.ultimate,
  status: state.status
});

export default connect(
  mapStateToProps,
  { updateBoard, updateStatus }
)(UltimateBoard);
