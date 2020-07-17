import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignUp from './components/Login/SignUp'
import Home from './components/Home/Home'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>  
    <Route path="/signup"  exact component={SignUp} />
    <Route path="/"  exact component={Home} />
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
