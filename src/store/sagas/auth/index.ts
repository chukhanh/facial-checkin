/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { all, call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';

function* signInGoogle() {
  // Call sign in Google
}

function* signInFacebook() {
  // Call sign in Facebook
}

export function* watchSignInGoogle() {
  yield takeLatest('SIGN_IN_GOOOLE', signInGoogle);
}

export function* watchSignInFacebook() {
  yield takeLatest('SIGN_IN_FACEBOOK', signInFacebook);
}

export default function* authSaga() {
  yield all([fork(watchSignInGoogle), fork(watchSignInFacebook)]);
}
