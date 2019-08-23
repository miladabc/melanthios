import React, { Component } from 'react';
import { connect } from 'react-redux';

import './board.css';
import './ultimateBoard.css';
import boardActions from '../../actions/boardActions';
import statusActions from '../../actions/statusActions';

class UltimateBoard extends Component {
  handleCellClick(boardId, cellId) {
    const {
      ultimateBoard,
      user,
      joinedRoom,
      updateStatus,
      updateBoard,
      socket
    } = this.props;

    const board = [...ultimateBoard];
    board[boardId][cellId] = user.username;

    updateStatus({ turn: false });
    updateBoard(joinedRoom.mode, board);

    socket.emit(
      'turnPlayed',
      { room: joinedRoom, board, lastMovePosition: cellId },
      ({ winner, line, gameFinished }) => {
        updateStatus({ winner, line, gameFinished });
      }
    );
  }

  renderCell(boardId, cellId) {
    const { ultimateBoard, user, status } = this.props;

    const cellMarkedBy = ultimateBoard[boardId][cellId];
    const mark = cellMarkedBy === user.username ? '╳' : '◯';
    let isCellClickable = '';
    let onClick = null;

    if (
      !status.gameFinished &&
      status.turn &&
      !cellMarkedBy &&
      (status.lastMovePosition === -1 || boardId === status.lastMovePosition)
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
    const { status } = this.props;

    let isBoardDisabled = '';
    const cellRows = [];

    if (
      !status.gameFinished &&
      (!status.turn ||
        (status.lastMovePosition !== -1 && status.lastMovePosition !== boardId))
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
  ultimateBoard: state.board.ultimate,
  status: state.status
});

const mapDispatchToProps = {
  updateBoard: boardActions.updateBoard,
  updateStatus: statusActions.updateStatus
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UltimateBoard);
