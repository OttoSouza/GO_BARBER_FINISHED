import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Route from './Route';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/reset-password" component={ResetPassword} />

        <Route exact path="/dashboard" component={Dashboard} isPrivate />
        <Route exact path="/profile" component={Profile} isPrivate />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
