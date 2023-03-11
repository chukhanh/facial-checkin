/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { auth } from './auth';

const createRootReducer = (history: History<any>) =>
  combineReducers({ router: connectRouter(history), auth });

export default createRootReducer;
