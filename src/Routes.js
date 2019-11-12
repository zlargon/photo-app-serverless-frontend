import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import AppliedRoute from "./components/AppliedRoute";
import Signup from "./containers/Signup";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";
import Settings from "./containers/Settings";
//routes we want to secure
import AuthenticatedRoute from "./components/AuthenticatedRoute";
//unsecure routes
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default function Routes({ appProps }) {
  return (
    <Switch>
      <UnauthenticatedRoute path="/login" exact component={Login} appProps={appProps} />
      <UnauthenticatedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <AuthenticatedRoute path="/settings" exact component={Settings} appProps={appProps} />
      <AuthenticatedRoute path="/notes/new" exact component={NewNote} appProps={appProps} />
      <AuthenticatedRoute path="/notes/:id" exact component={Notes} appProps={appProps} />
            { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
}