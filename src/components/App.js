import React, { Component } from 'react';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.notificationDOMRef = React.createRef();
  }

  render() {
    return (
      <div>
        <ReactNotification ref={this.notificationDOMRef} />
        <Header />
        {this.props.children}
      </div>
    );
  }
}

export default App;
