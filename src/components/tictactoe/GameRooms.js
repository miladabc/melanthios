import React, { Component } from 'react';
import { connect } from 'react-redux';

import './gameRooms.css';
import requireAuth from '../requireAuth';
import { addNotification } from '../../actions';
import { listRooms, joinRoom } from '../../actions/roomActions';
import { addMessage } from '../../actions/chatActions';
import { scrollChatBoxToBottom } from '../../utils/chatUtils';

class GameRooms extends Component {
  state = {
    roomName: '',
    roomMode: 'simple',
    errMsg: ''
  };

  componentDidMount() {
    if (this.props.socket) {
      this.props.socket.on('roomsList', rooms => {
        this.props.listRooms(rooms, this.props.rooms.joined);
      });

      this.props.socket.emit('getRooms');

      this.props.socket.on('roomReady', () => {
        this.props.addNotification({
          success: true,
          msg: 'Game room is ready, let\'s play...'
        });
      });

      this.props.socket.on('message', message => {
        this.props.addMessage(message);

        scrollChatBoxToBottom();
      });
    }
  }

  createRoom = event => {
    event.preventDefault();
    const errMsg = this.validateRoomName();
    if (errMsg) {
      this.setState({ errMsg });
      return;
    }

    this.props.socket.emit(
      'joinRoom',
      {
        roomToJoin: this.state.roomName,
        roomMode: this.state.roomMode,
        joinedRoom: this.props.rooms.joined.name,
        creating: true
      },
      () => {
        this.props.addNotification({
          success: true,
          msg: 'Your room has been created, waiting for opponent...'
        });

        this.props.joinRoom({
          name: this.state.roomName,
          mode: this.state.roomMode
        });
        this.setState({ roomName: '' });
      }
    );
  };

  joinRoom({ name, mode }) {
    this.props.socket.emit(
      'joinRoom',
      {
        roomToJoin: name,
        joinedRoom: this.props.rooms.joined.name
      },
      () => this.props.joinRoom({ name, mode })
    );
  }

  letsPlay() {
    this.props.history.push(`/tictactoe/play`);
  }

  validateRoomName() {
    if (!this.state.roomName) return 'Provide a name';

    if (this.props.rooms.all.includes(this.state.roomName))
      return 'Room name is taken';

    return '';
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value, errMsg: '' });
  };

  renderForm() {
    return (
      <form onSubmit={this.createRoom}>
        <div className="form-row align-items-center justify-content-between">
          <div className="col-sm-4 my-1">
            <input
              name="roomName"
              type="text"
              className="form-control"
              placeholder="Room Name"
              value={this.state.roomName}
              onChange={this.handleChange}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              name="roomMode"
              value={this.state.roomMode}
              onChange={this.handleChange}
            >
              <option value="simple">Simple</option>
              <option value="ultimate">Ultimate</option>
            </select>
          </div>
          <div className="col-auto my-1">
            <button type="submit" className="btn btn-info">
              Create Room
            </button>
          </div>
        </div>
        <span className="text-danger">{this.state.errMsg}</span>
      </form>
    );
  }

  renderRoomBtn(room) {
    if (room.length === 1) {
      return <span className="btn btn-light">Waiting for opponent</span>;
    } else if (room.length === 2) {
      return (
        <button className="btn btn-light" onClick={() => this.letsPlay()}>
          Play
        </button>
      );
    }
  }

  renderRooms() {
    const availableRooms = this.props.rooms.available.map(room => {
      return (
        <li
          className="list-group-item font-weight-bold d-flex justify-content-between room"
          key={room.name}
        >
          <span className="room-name">{room.name}</span>
          <span className="btn btn-warning">{room.mode}</span>
          <button
            className="btn btn-success"
            onClick={() => this.joinRoom(room)}
          >
            Join
          </button>
        </li>
      );
    });

    return (
      <>
        {this.props.rooms.joined.name && (
          <li className="list-group-item font-weight-bold d-flex justify-content-between bg-info room">
            <span className="text-white room-name">
              {this.props.rooms.joined.name}
            </span>
            <span className="btn btn-warning">
              {this.props.rooms.joined.mode}
            </span>
            {this.renderRoomBtn(this.props.rooms.joined)}
          </li>
        )}
        {availableRooms}
      </>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="card border-secondary mb-3 rooms">
          <div className="card-header bg-transparent border-secondary">
            {this.renderForm()}
          </div>
          <div className="card-body text-secondary">
            {this.props.rooms.available.length === 0 &&
            !this.props.rooms.joined.name ? (
              <h6 className="card-title text-info">
                No rooms available, create one!
              </h6>
            ) : (
              <h6 className="card-title text-info">Online game rooms</h6>
            )}
            <ul className="list-group list-group-flush">
              {this.renderRooms()}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
  user: state.auth.user,
  rooms: state.rooms
});

export default connect(
  mapStateToProps,
  { addNotification, listRooms, joinRoom, addMessage }
)(requireAuth(GameRooms));
