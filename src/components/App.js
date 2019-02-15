import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Notification from './Notification';
import 'react-notifications-component/dist/theme.css';

import Header from './Header';
import Home from './Home';
import Signup from './auth/Signup';
import Signin from './auth/Signin';
import Signout from './auth/Signout';
import ResendEmail from './auth/ResendEmail';
import EmailConfirmation from './auth/EmailConfirmation';
import Feature from './Feature';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Notification />
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <Route exact path="/signout" component={Signout} />
            <Route exact path="/resendemail" component={ResendEmail} />
            <Route exact path="/confirmemail" component={EmailConfirmation} />
            <Route exact path="/feature" component={Feature} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
