/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { all } from 'redux-saga/effects';
import authSaga from './auth';

export default function* rootSaga() {
  yield all([authSaga()]);
}
