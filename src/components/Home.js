import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './home.css';

class Home extends Component {
  render() {
    return (
      <div className="home container">
        <div className="jumbotron home-content text-center text-light">
          <h1>Multiplayer XO</h1>
          <p className="lead text-light">
            A real-time two player XO game with chat functionality
          </p>
          {!this.props.user ? (
            <div className="home-btns">
              <Link className="btn btn-success" to="/signin">
                Login
              </Link>
              <span className="between-btns">or</span>
              <Link className="btn btn-info" to="/signup">
                Register
              </Link>
            </div>
          ) : (
            <div className="home-btns">
              <Link className="btn btn-warning btn-lg" to="/tictactoe">
                Let's Play
              </Link>
            </div>
          )}
        </div>

        <div className="row text-light">
          <div className="stacks-item col-sm">
            <h3>React</h3>
            <p>Frontend developed using React version 16</p>
            <p>
              <a href="https://reactjs.org">react</a>
            </p>
          </div>
          <div className="stacks-item col-sm">
            <h3>NodeJS</h3>
            <p>
              A NodeJS server using ExpressJS for request handling and MongoDB
              for data storage
            </p>
            <p>
              <a href="https://nodejs.org">node</a> |{' '}
              <a href="https://expressjs.com">express</a> |{' '}
              <a href="https://www.mongodb.com">mongo</a>
            </p>
          </div>
          <div className="stacks-item col-sm">
            <h3>Socket.io</h3>
            <p>
              Web sockets implementation using Socket.io for real-time
              communication
            </p>
            <p>
              <a href="https://socket.io">socket.io</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(Home);
