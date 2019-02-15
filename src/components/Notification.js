import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactNotification from 'react-notifications-component';

class Notification extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  componentDidUpdate() {
    const { title, message, notType: type } = this.props.notification;

    this.notificationDOMRef.current.addNotification({
      title,
      message,
      type,
      insert: 'top',
      container: 'top-right',
      animationIn: ['animated', 'bounceIn'],
      animationOut: ['animated', 'bounceOut'],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  }

  render() {
    return <ReactNotification ref={this.notificationDOMRef} />;
  }
}

const mapStateToProps = state => ({ notification: state.notification });

export default connect(mapStateToProps)(Notification);
