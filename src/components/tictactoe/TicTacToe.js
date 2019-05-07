import React, { Component } from 'react';
import { connect } from 'react-redux';

import requireAuth from '../requireAuth';

class TicTacToe extends Component {
  render() {
    return <div>board</div>;
  }
}

const mapStateToProps = state => ({ socket: state.socket });

export default connect(mapStateToProps)(requireAuth(TicTacToe));
