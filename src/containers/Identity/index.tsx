import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

import Login from './Login';
import EmailConfirmation from './Confirmation';
import ResetPassword from './Reset';
import ChangePassword from './ChangePassword';

const Identity: React.FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/login`} component={Login} />
      <Route exact path={`${path}/confirmation`} component={EmailConfirmation} />
      <Route exact path={`${path}/resetpassword`} component={ResetPassword} />
      <Route exact path={`${path}/changepassword`} component={ChangePassword} />
    </Switch>
  );
};

export default Identity;
