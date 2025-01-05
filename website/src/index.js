import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import store from "./methods/global_state";
import './index.css';
import Router from './components/router';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </React.StrictMode>
);