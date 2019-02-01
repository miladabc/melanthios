import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import reducers from './reducers';
import App from './components/App';
import Home from './components/Home';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import Signout from './components/auth/Signout';
import ResendEmail from './components/auth/ResendEmail';
import EmailConfirmation from './components/auth/EmailConfirmation';
import Feature from './components/Feature';

const store = createStore(
  reducers,
  {
    auth: { authenticated: localStorage.getItem('token') }
  },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signout" component={Signout} />
        <Route exact path="/resendemail" component={ResendEmail} />
        <Route exact path="/confirmemail" component={EmailConfirmation} />
        <Route exact path="/feature" component={Feature} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#root')
);
