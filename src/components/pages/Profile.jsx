import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import Helmet from 'react-helmet';
import validator from 'validator';
import { toast } from 'react-toastify';

const Profile = ({ userDetails, setUserDetails }) => {
  const history = useHistory();
  const [user, setUser] = useState({ name: '', password: '', email: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (userDetails) {
      const { name, email } = userDetails;
      setUser({ ...user, name, email });
    }
  }, []);

  const onSave = () => {
    const { name, password, email } = user;
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
    const existingUserIndex = existingUsers.findIndex(
      (existingUserFromArr) => existingUserFromArr.email === email,
    );
    if (existingUserIndex !== -1) {
      existingUsers[existingUserIndex] = user;
      localStorage.setItem('users', JSON.stringify(existingUsers));
      setUserDetails({ name: user.name, email: user.email });
      toast.success('Saved successfully');
    } else {
      toast.error(`No user found with email ${email}`);
    }
  };

  const onDelete = () => {
    const { email } = user;
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUserIndex = existingUsers.findIndex(
      (existingUserFromArr) => existingUserFromArr.email === email,
    );
    if (existingUserIndex !== -1) {
      existingUsers.splice(existingUserIndex, 1);
      localStorage.setItem('users', existingUsers);
      setUserDetails({ name: '', email: '' });
      history.replace('/');
      toast.success('Deleted successfully');
    } else {
      toast.error(`No user found with email ${email}`);
    }
  };

  const onChange = (event, key) => {
    setErrorMessage('');
    setUser({ ...user, [key]: event.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <form className="w-25">
        <div className="alert alert-primary" role="alert">
          <h1>Edit Profile</h1>
          <Link className="btn btn-primary" to="/news">
            Go Back
          </Link>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="emailInput" className="w-100">
            Email
            <input
              disabled
              value={user.email}
              type="email"
              className="form-control"
              id="emailInput"
              aria-describedby="emailHelp"
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
            onClick={onSave}
            type="button"
            className="btn btn-primary mb-3 w-100"
          >
            Save
          </button>
          <button
            onClick={onDelete}
            type="button"
            className="btn btn-primary mb-3 w-100"
          >
            Delete Account
          </button>
        </div>
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </form>
    </>
  );
};

export default Profile;

Profile.propTypes = {
  userDetails: PropTypes.shape(PropTypes.object).isRequired,
  setUserDetails: PropTypes.func.isRequired,
};
