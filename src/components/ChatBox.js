import React, { Component } from 'react';
import { connect } from 'react-redux';

import { scrollChatBoxToBottom } from '../utils/chatUtils';
import { addMessage } from '../actions/chatActions';

class ChatBox extends Component {
  state = { message: '' };

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

  render() {
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
}

const mapStateToProps = state => ({
  socket: state.socket,
  user: state.auth.user,
  joinedRoom: state.rooms.joined.name,
  messages: state.messages
});

export default connect(
  mapStateToProps,
  { addMessage }
)(ChatBox);
