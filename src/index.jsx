import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import App from './components/App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
