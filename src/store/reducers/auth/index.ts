import {
  SIGN_IN_FAILURE,
  SIGN_IN_SUCCESS,
  SIGN_OUT_FAILURE,
  SIGN_OUT_SUCCESS,
} from '../../actions/auth';
interface IAuthInitStateNew {
  isAuthenticated: boolean;
  userID: number;
}

type ActionType = {
  payload: number;
  type: typeof SIGN_IN_FAILURE | typeof SIGN_IN_SUCCESS;
};

export const initAuthStateNew: IAuthInitStateNew = {
  isAuthenticated: false,
  userID: 0,
};

export const reducer = (state: IAuthInitStateNew, action: ActionType): IAuthInitStateNew => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        userID: action.payload,
      };
    case SIGN_IN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthActionTypes } from '../../actions/auth/types';

interface IAuthInitState {
  isAuthenticated: boolean;
}

const initAuthState: IAuthInitState = {
  isAuthenticated: false,
};

export const auth = (state = initAuthState, action: AuthActionTypes) => {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      return { ...state, isAuthenticated: true };
    case SIGN_IN_FAILURE:
      return { ...state, isAuthenticated: false };
    case SIGN_OUT_SUCCESS:
      return { ...state, isAuthenticated: false };
    case SIGN_OUT_FAILURE:
      return { ...state };
    default:
      return state;
  }
};
