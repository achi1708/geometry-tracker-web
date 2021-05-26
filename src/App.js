import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import Main from './components/Main';
import './app.scss';

class App extends Component {
  render () {
      return (
          <BrowserRouter>
              <Route component={Main} />
          </BrowserRouter>
      );
  }
}

export default App;
