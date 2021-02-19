import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from './container/login';
import Search from './container/search';

export const history = createBrowserHistory();

export default function Routes() {
    return (
        <Router history={history}>
            <Switch>
                <Route exact path="/">
                    <Login />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/search">
                    <Search />
                </Route>
            </Switch>
        </Router>
    )
}
