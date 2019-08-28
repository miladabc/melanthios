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

    const ultimate = { ...ultimateBoard };
    ultimate.largeBoard[boardId].smallBoard[cellId] = user.username;
    ultimate.largeBoard[boardId].marksNum++;

    updateStatus({ turn: false });
    updateBoard(joinedRoom.mode, ultimate);

    socket.emit(
      'turnPlayed',
      { room: joinedRoom, board: ultimate, lastMovePosition: cellId },
      ({ board, winner, line, gameFinished }) => {
        updateStatus({ winner, line, gameFinished });
        updateBoard(joinedRoom.mode, board);
      }
    );
  }

  renderCell(boardId, cellId) {
    const { ultimateBoard, user, status } = this.props;

    const cellMarkedBy = ultimateBoard.largeBoard[boardId].smallBoard[cellId];
    const mark = cellMarkedBy === user.username ? '╳' : '◯';
    let isCellClickable = '';
    let onClick = null;
    let fontColor = '';

    if (
      !status.gameFinished &&
      status.turn &&
      !cellMarkedBy &&
      !ultimateBoard.wonBoards[boardId].user &&
      (status.lastMovePosition === -1 ||
        boardId === status.lastMovePosition ||
        ultimateBoard.wonBoards[status.lastMovePosition].user)
    ) {
      isCellClickable = 'game-cell-clickable';
      onClick = () => this.handleCellClick(boardId, cellId);
    }

    if (
      ultimateBoard.wonBoards[boardId].user &&
      ultimateBoard.wonBoards[boardId].row.includes(cellId)
    ) {
      fontColor =
        ultimateBoard.wonBoards[boardId].user === user.username
          ? 'win-color'
          : 'lose-color';
    }

    return (
      <div
        className={`u-game-cell ${isCellClickable}`}
        onClick={onClick}
        key={cellId}
      >
        <span className={`u-game-cell-label center-align ${fontColor}`}>
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
    const { status, user, ultimateBoard } = this.props;

    const boardClassNames = [];
    const cellRows = [];

    if (
      !status.gameFinished &&
      (!status.turn ||
        ultimateBoard.wonBoards[boardId].user ||
        (status.lastMovePosition !== -1 &&
          status.lastMovePosition !== boardId &&
          !ultimateBoard.wonBoards[status.lastMovePosition].user))
    )
      boardClassNames.push('disabled-board');

    if (ultimateBoard.wonBoards[boardId].user) {
      boardClassNames.push(
        ultimateBoard.wonBoards[boardId].user === user.username
          ? 'win-background-color'
          : 'lose-background-color'
      );
    }

    for (let i = 0; i < 3; i++) cellRows.push(this.renderCellsRow(boardId, i));

    return (
      <div
        className={`u-game-grid center-align ${boardClassNames.join(' ')}`}
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
  ultimateBoard: state.boards.ultimate,
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
