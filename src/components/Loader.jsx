import React from 'react';
import PropTypes from 'prop-types';
import { DotLoader } from 'react-spinners';

const Loader = ({ loading }) => {
  if (!loading) {
    return null;
  }
  return (
    <div className="loading">
      <DotLoader loading={loading} color="#1c86d2" size={60} />
    </div>
  );
};

export default Loader;

Loader.defaultProps = {
  loading: false,
};

Loader.propTypes = {
  loading: PropTypes.bool,
};
