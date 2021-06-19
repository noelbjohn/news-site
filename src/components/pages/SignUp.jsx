import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import validator from 'validator';
import { toast } from 'react-toastify';

const SignUp = ({ setUserDetails }) => {
  const history = useHistory();
  const [user, setUser] = useState({ name: '', password: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const onSignup = () => {
    const { name, password, email } = user;
    if (!email || !validator.isEmail(email)) {
      return setErrorMessage('Please provide a valid email');
    }
    if (!name || !validator.isAlphanumeric(name.replace(/ /g))) {
      return setErrorMessage('Please provide a valid name');
    }
    if (
      !password ||
      password.length > 20 ||
      !validator.isStrongPassword(password, { minSymbols: 0 })
    ) {
      return setErrorMessage('Please provide a valid password');
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const emailAlreadyExist = existingUsers.find(
      (existingUser) => existingUser.email === email,
    );
    if (emailAlreadyExist) {
      return toast.error('Email already exists');
    }
    existingUsers.push(user);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    setUserDetails({ name: user.name, email: user.email });
    history.replace('/news');
  };

  const onChange = (event, key) => {
    setErrorMessage('');
    setUser({ ...user, [key]: event.target.value });
  };

  return (
    <>
      <Helmet>
        <title>SignUp</title>
      </Helmet>
      <form className="w-25">
        <div className="alert alert-primary" role="alert">
          <h1>Sign Up</h1>
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
              placeholder="Email"
            />
          </label>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="emailInput" className="w-100">
            Name
            <input
              value={user.name}
              onChange={(event) => {
                onChange(event, 'name');
              }}
              type="email"
              className="form-control"
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="Name"
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
            onClick={onSignup}
            type="button"
            className="btn btn-primary mb-3 w-100"
          >
            Sign Up
          </button>
        </div>
        <Link to="/">Already registerd? Sign in</Link>
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
};

export default SignUp;

SignUp.propTypes = {
  setUserDetails: PropTypes.func.isRequired,
};
