import React, { Component } from 'react';

import './ultimateBoard.css';

class UltimateBoard extends Component {
  renderCell(cellId) {
    return (
      <div className="u-game-cell" key={cellId}>
        <span className="u-game-cell-label center-align">╳</span>
      </div>
    );
  }

  renderCellsRow(cellsRowId) {
    const cells = [];
    let j;
    if (cellsRowId === 0) j = 0;
    if (cellsRowId === 1) j = 3;
    if (cellsRowId === 2) j = 6;

    for (let i = 0; i < 3; i++) cells.push(this.renderCell(i + j));

    return (
      <div className="game-row" key={cellsRowId}>
        {cells}
      </div>
    );
  }

  renderSmallBoard(boardId) {
    const cellRows = [];

    for (let i = 0; i < 3; i++) cellRows.push(this.renderCellsRow(i));

    return (
      <div className="u-game-grid center-align" key={boardId}>
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

export default UltimateBoard;
