import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import { useAccount } from '/imports/startup/client/hooks';

import MainLayout from './layouts/MainLayout';

import LoadingView from './components/loading/LoadingView';

import AddProducts from './pages/store/products/AddProducts';
import Categories from './pages/categories/Categories';
import ChangePassword from './pages/actions/changePassword/ChangePassword';
import Dashboard from './pages/dashboard/Dashboard';
import DeleteProducts from './pages/store/products/DeleteProducts';
import EditInventory from './pages/store/inventories/edit/EditInventory';
import Employees from './pages/employees/Employees';
import EmployeesPasswords from './pages/employees/passwords/EmployeesPasswords';
import EmployeesUpdate from './pages/employees/update/EmployeesUpdate';
import Inventories from './pages/store/inventories/Inventories';
import ListRecognition from './pages/recognition/list/ListRecognition';
import ListRequirements from './pages/requirements/list/ListRequirements';
import Movements from './pages/movements/Movements';
import NewCategory from './pages/categories/new/NewCategory';
import NewQuality from './pages/recognition/qualities/new/NewQuality';
import NewRecognition from './pages/recognition/new/NewRecognition';
import NewRequirement from './pages/requirements/new/NewRequirement';
import NotFound from './pages/notFound/NotFound';
import OrderDetail from './pages/cart/detail/OrderDetail';
import Profile from './pages/profile/Profile';
import Qualities from './pages/recognition/qualities/Qualities';
import Recognition from './pages/recognition/Recognition';
import Reports from './pages/reports/Reports';
import Requirements from './pages/requirements/Requirements';
import SettingsRequirements from './pages/requirements/settings/SettingsRequirements';
import SettingsRecognitions from './pages/movements/settings/SettingsRecognitions';
import SignIn from './pages/signIn/SignIn';
import Store from './pages/store/Store';
import Unauthorized from './pages/unauthorized/Unauthorized';
import UsePoints from './pages/points/use/UsePoints';
import ValidateRecognition from './pages/recognition/view/ValidateRecognition';
import ViewCart from './pages/cart/view/ViewCart';
import ViewPoints from './pages/points/view/ViewPoints';
import ViewRecognition from './pages/recognition/view/ViewRecognition';

const ProtectedRoute = ({ component: Component, permissionNeeded = [], ...rest }) => {
  const { isLoggedIn, isLoggingIn, loading, role, user, userId, } = useAccount();

  const toRenderComponent =  (
    <Route
      {...rest}
      render={props => (
        <MainLayout roles={role} user={user} userId={userId}>
          <Component roles={role} userId={userId} {...props} />
        </MainLayout>
      )}
    />
  );

  const renderUnauthorized = (
    <Route
      {...rest}
      render={props => (
        <MainLayout roles={role} user={user} userId={userId}>
          <Unauthorized />
        </MainLayout>
      )}
    />
  );

  const renderLoading = (
    <Route
    {...rest}
    render={props => (
      <MainLayout roles={role} user={user} userId={userId}>
        <LoadingView />
      </MainLayout>
    )}
  />
  )

  if (loading) {
    return renderLoading;
  }

  if (!isLoggingIn && !isLoggedIn) {
    return <Redirect to="/signin" />;
  }

  if (!isLoggedIn || (permissionNeeded == 'PERMISSION.ADMIN' && role == 'user')) {
    return renderUnauthorized;
  }

  return toRenderComponent;
};

const ProtectedLogging = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useAccount();
  return (
    <Route
      {...rest}
      render={props => !isLoggedIn
        ? <Component {...props} />
        : <Redirect to='/' />
      }
    />
  );
};

export const App = () => (
  <div>
    <Router>
      <Switch>
        <ProtectedLogging exact path="/signin" component={SignIn} />
        <ProtectedLogging exact path="/changePassword/:id" component={ChangePassword} />

        <ProtectedRoute exact path="/" component={Dashboard} />
        <ProtectedRoute exact path="/categories" permissionNeeded={'PERMISSION.ADMIN'} component={Categories} />
        <ProtectedRoute exact path="/newCategory" permissionNeeded={'PERMISSION.ADMIN'} component={props => <NewCategory {...props} mode={'NEW'} />} />
        <ProtectedRoute exact path="/editCategory/:id" permissionNeeded={'PERMISSION.ADMIN'} component={props => <NewCategory {...props} mode={'EDIT'} />} />
        <ProtectedRoute exact path="/movements" component={Movements} />
        <ProtectedRoute exact path="/requirements" permissionNeeded={'PERMISSION.ADMIN'} component={Requirements} />
        <ProtectedRoute exact path="/newRequirement" permissionNeeded={'PERMISSION.ADMIN'} component={NewRequirement} />
        <ProtectedRoute exact path="/historyRequirements" permissionNeeded={'PERMISSION.ADMIN'} component={ListRequirements} />
        <ProtectedRoute exact path="/settingsRequirements" permissionNeeded={'PERMISSION.ADMIN'} component={SettingsRequirements} />
        <ProtectedRoute exact path="/settingsRecognitions" permissionNeeded={'PERMISSION.ADMIN'} component={SettingsRecognitions} />
        <ProtectedRoute exact path="/reports" permissionNeeded={'PERMISSION.ADMIN'} component={Reports} />
        <ProtectedRoute exact path="/employees" permissionNeeded={'PERMISSION.ADMIN'} component={Employees} />
        <ProtectedRoute exact path="/employeesUpdate" permissionNeeded={'PERMISSION.ADMIN'} component={EmployeesUpdate} />
        <ProtectedRoute exact path="/employeesPasswords" permissionNeeded={'PERMISSION.ADMIN'} component={EmployeesPasswords} />
        <ProtectedRoute exact path="/store" component={Store} />
        <ProtectedRoute exact path="/addProducts" permissionNeeded={'PERMISSION.ADMIN'} component={AddProducts} />
        <ProtectedRoute exact path="/deleteProducts" permissionNeeded={'PERMISSION.ADMIN'} component={DeleteProducts} />
        <ProtectedRoute exact path="/inventories" permissionNeeded={'PERMISSION.ADMIN'} component={Inventories} />
        <ProtectedRoute exact path="/editInventory/:id" permissionNeeded={'PERMISSION.ADMIN'} component={EditInventory} />

        <ProtectedRoute exact path="/profile" component={Profile} />
        <ProtectedRoute exact path="/myPoints" component={ViewPoints} />
        <ProtectedRoute exact path="/usePoints" component={UsePoints} />
        <ProtectedRoute exact path="/cart" component={ViewCart} />
        <ProtectedRoute exact path="/order" component={OrderDetail} />
        <ProtectedRoute exact path="/recognition" component={Recognition} />
        <ProtectedRoute exact path="/recognitions" component={ListRecognition} />
        <ProtectedRoute exact path="/newRecognition" component={NewRecognition} />
        <ProtectedRoute exact path="/qualities" component={Qualities} />
        <ProtectedRoute exact path="/newQuality" component={props => <NewQuality {...props} mode={'NEW'} />} />
        <ProtectedRoute exact path="/editQuality/:id" component={props => <NewQuality {...props} mode={'EDIT'} />} />
        <ProtectedRoute exact path="/recognition/view/:id" component={ViewRecognition} />
        <ProtectedRoute exact path="/recognition/validate/:id" permissionNeeded={'PERMISSION.ADMIN'} component={ValidateRecognition} />

        <ProtectedRoute component={NotFound} />
      </Switch>
    </Router>
  </div>
);
