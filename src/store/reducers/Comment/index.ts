/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_COMMENT, ADD_COMMENT } from 'store/actions/comment';

type InitStateType = {
  comment: any;
};

export const initState: InitStateType = { comment: [] };

type ActionType = {
  payload: any;
  type: typeof GET_COMMENT | typeof ADD_COMMENT;
};

export const reducer = (state: InitStateType, action: ActionType): InitStateType => {
  switch (action.type) {
    case GET_COMMENT:
      return {
        comment: action.payload,
      };
    case ADD_COMMENT:
      return {
        comment: state.comment.concat(action.payload),
      };
    default:
      return state;
  }
};
