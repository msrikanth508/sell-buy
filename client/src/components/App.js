import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline, Container } from "@material-ui/core";

import Home from "./Home";
import Sell from "./Sell";
import UserProvider from "../Provider/UserProvider";
import CoreProvider from "../Provider/CoreProvider";
import Menu from './Menu';
import Header from './Header';

export default function App() {
  return (
    <Router>
      <Container fixed>
        <CoreProvider>
          <UserProvider>
            <CssBaseline />
            <Header>
                <Menu />
              </Header>
            <Switch>
              <Route path="/sell">
                <Sell />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </UserProvider>
        </CoreProvider>
      </Container>
    </Router>
  );
}
