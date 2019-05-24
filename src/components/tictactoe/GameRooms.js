import React, { Component } from 'react';
import { connect } from 'react-redux';

import './gameRooms.css';
import requireAuth from '../requireAuth';
import { addNotification } from '../../actions';

const roomNamePrefix = 'ttt_';

class GameRooms extends Component {
  state = {
    formInput: '',
    errMsg: '',
    allOnlineRooms: [],
    availableRooms: [],
    joinedRoom: {}
  };

  componentDidMount() {
    if (this.props.socket) {
      this.props.socket.on('roomsList', rooms => {
        const {
          allOnlineRooms,
          availableRooms,
          joinedRoom
        } = this.listGameRooms(rooms);

        this.setState({ allOnlineRooms, availableRooms, joinedRoom });
      });

      this.props.socket.emit('getRooms');

      this.props.socket.on('roomReady', () => {
        this.props.addNotification({
          success: true,
          msg: 'Game room is ready, let\'s play...'
        });
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
        roomToJoin: this.state.formInput,
        joinedRoom: this.state.joinedRoom.name,
        creating: true
      },
      () => {
        this.props.addNotification({
          success: true,
          msg: 'Your room has been created, waiting for opponent...'
        });

        this.setState({
          formInput: '',
          joinedRoom: { name: this.state.formInput }
        });
      }
    );
  };

  joinRoom(roomToJoin) {
    this.props.socket.emit(
      'joinRoom',
      {
        roomToJoin,
        joinedRoom: this.state.joinedRoom.name
      },
      () => {
        this.setState({ joinedRoom: { name: roomToJoin } });
      }
    );
  }

  letsPlay(roomToPlay) {
    this.props.history.push(`/tictactoe/play?room=${roomToPlay}`);
  }

  listGameRooms(rooms) {
    return Object.entries(rooms).reduce(
      (result, [roomName, room]) => {
        if (roomName.slice(0, 4) === roomNamePrefix) {
          const name = roomName.slice(4);

          result.allOnlineRooms.push(name);

          if (name === this.state.joinedRoom.name)
            result.joinedRoom = { name, length: room.length };
          else if (room.length === 1) result.availableRooms.push(name);
        }

        return result;
      },
      { allOnlineRooms: [], availableRooms: [], joinedRoom: '' }
    );
  }

  validateRoomName() {
    if (!this.state.formInput) return 'Provide a name';

    if (this.state.allOnlineRooms.includes(this.state.formInput))
      return 'Room name is taken';

    return '';
  }

  onRoomNameChange = event => {
    this.setState({ formInput: event.target.value, errMsg: '' });
  };

  renderForm() {
    return (
      <form onSubmit={this.createRoom}>
        <div className="form-row align-items-center justify-content-between">
          <div className="col-sm-4 my-1">
            <input
              type="text"
              className="form-control"
              placeholder="Room Name"
              value={this.state.formInput}
              onChange={this.onRoomNameChange}
            />
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

  renderRooms() {
    const availableRooms = this.state.availableRooms.map(room => {
      return (
        <li
          className="list-group-item font-weight-bold d-flex justify-content-between room"
          key={room}
        >
          <span className="room-name">{room}</span>
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
        {this.state.joinedRoom.name && (
          <li
            className="list-group-item font-weight-bold d-flex justify-content-between bg-info room"
            style={{ borderRadius: '10px' }}
          >
            <span className="text-white room-name">
              {this.state.joinedRoom.name}
            </span>
            {this.renderRoomBtn(this.state.joinedRoom)}
          </li>
        )}
        {availableRooms}
      </>
    );
  }

  renderRoomBtn(room) {
    if (room.length === 1) {
      return <span className="btn btn-light">Waiting for opponent</span>;
    } else if (room.length === 2) {
      return (
        <button
          className="btn btn-light"
          onClick={() => this.letsPlay(room.name)}
        >
          Play
        </button>
      );
    }
  }

  render() {
    return (
      <div className="container">
        <div className="card border-secondary mb-3 rooms">
          <div className="card-header bg-transparent border-secondary">
            {this.renderForm()}
          </div>
          <div className="card-body text-secondary">
            {this.state.availableRooms.length === 0 &&
            !this.state.joinedRoom.name ? (
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
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { addNotification }
)(requireAuth(GameRooms));
