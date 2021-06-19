import React, { useState } from 'react';
import Helmet from 'react-helmet';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import validator from 'validator';

const Login = ({ setUserDetails }) => {
  const history = useHistory();
  const [user, setUser] = useState({ email: '', password: '', name: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const onLogin = () => {
    const { password, email } = user;
    if (!email || !validator.isEmail(email)) {
      return setErrorMessage('Please provide a valid email');
    }
    if (
      !password ||
      password.length > 20 ||
      !validator.isStrongPassword(password, { minSymbols: 0 })
    ) {
      return setErrorMessage('Please provide a valid password');
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = existingUsers.find(
      (existingUserFromArr) => existingUserFromArr.email === email,
    );
    if (!existingUser) {
      return toast.error(`No user found with email ${email}`);
    }
    setUserDetails({ name: existingUser.name || '', email: user.email });
    history.replace('/news');
  };

  const onChange = (event, key) => {
    setErrorMessage('');
    setUser({ ...user, [key]: event.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <form className="w-25">
        <div className="alert alert-primary" role="alert">
          <h1>Login</h1>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="emailInput" className="w-100">
            Email
            <input
              value={user.email}
              onChange={(event) => {
                onChange(event, 'email');
              }}
              type="email"
              className="form-control"
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Enter username"
            />
          </label>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="passwordInput" className="w-100">
            Password
            <input
              value={user.password}
              onChange={(event) => {
                onChange(event, 'password');
              }}
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="Password"
            />
          </label>
        </div>
        <div>
          <button
            onClick={onLogin}
            type="button"
            className="btn btn-primary mb-3 w-100"
          >
            Login
          </button>
        </div>
        <Link to="/signup">Sign Up</Link>
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
};

export default Login;

Login.propTypes = {
  setUserDetails: PropTypes.func.isRequired,
};
