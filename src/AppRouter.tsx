import React, { ReactElement } from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
// import { createBrowserHistory } from 'history';
import Home from './containers/Home';
import Identity from './containers/Identity';
import Attendance from './containers/AttendanceScreen';
import Staff from './containers/StaffScreen';
import Edit from './containers/EditScreen';
import Department from './containers/DepartmentScreen';
import UserTemplate from './HOC/UserTemplate';

// const history = createBrowserHistory();

function AppRouter(): ReactElement {
  return (
    <Router>
      <Switch>
        <UserTemplate exact path="/attendance" component={Attendance} />
        <UserTemplate
          exact
          path={`/attendance/id=:id&attendance=:attendance&from=:from`}
          component={Attendance}
        />
        <UserTemplate exact path="/add_attendance" component={Attendance} />
        <UserTemplate exact path="/staff" component={Staff} />
        <UserTemplate exact path="/staff/edit" component={Edit} />
        <UserTemplate exact path="/department" component={Department} />
        <Route path="/identity" component={Identity} />
        <Route path="/home" component={Home} />
        <Redirect to="/identity/login" />
        {/* <Redirect to="/staff" /> */}
      </Switch>
    </Router>
  );
}

export default AppRouter;
