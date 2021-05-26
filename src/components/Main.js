import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

const Main = () => (
    <Switch>
        <Route exact path={`${process.env.REACT_APP_ROUTER_PREFIX}/`} component={Home} />
        <Route path={`${process.env.REACT_APP_ROUTER_PREFIX}/login`} component={Login} />
        <PrivateRoute path={`${process.env.REACT_APP_ROUTER_PREFIX}/users`} component='users' />
        <PrivateRoute path={`${process.env.REACT_APP_ROUTER_PREFIX}/empresas`} component='empresas' />
    </Switch>
);

export default Main;