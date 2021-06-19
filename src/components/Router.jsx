import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import News from './pages/News';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Loader from './Loader';
import Profile from './pages/Profile';

const Router = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  return (
    <main className="container d-flex justify-content-center align-items-center">
      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => <Login setUserDetails={setUser} />}
          />
          {user.email && (
            <>
              <Route
                path="/news"
                exact
                render={() => (
                  <News
                    setLoading={setLoading}
                    userDetails={user}
                    setUser={setUser}
                  />
                )}
              />
              <Route
                path="/profile"
                exact
                render={() => (
                  <Profile userDetails={user} setUserDetails={setUser} />
                )}
              />
            </>
          )}
          <Route
            path="/signup"
            exact
            render={() => <SignUp setUserDetails={setUser} />}
          />
          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
      <Loader loading={loading} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar
      />
    </main>
  );
};

export default Router;
