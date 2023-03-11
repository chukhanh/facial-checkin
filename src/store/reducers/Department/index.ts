/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GET_DEPARTMENT,
  UPDATE_DEPARTMENT,
  DELETE_DEPARTMENT,
  ADD_DEPARTMENT,
} from 'store/actions/department';

type InitStateType = {
  department: Department[];
};

export const initState: InitStateType = { department: [] };

type ActionType = {
  payload: any;
  type:
    | typeof GET_DEPARTMENT
    | typeof ADD_DEPARTMENT
    | typeof UPDATE_DEPARTMENT
    | typeof DELETE_DEPARTMENT;
};

const filterDelete = (array: Department[], action: number[]): Department[] => {
  for (let i = 0; i < array.length; i += 1) {
    if (action.includes(array[i].ID)) {
      array.splice(i, 1);
      i -= 1;
    }
  }
  return array;
};

const filterUpdate = (array: Department[], action: Department): Department[] => {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].ID === action.ID) {
      array[i].Name = action.Name;
    }
  }
  return array;
};

export const reducer = (state: InitStateType, action: ActionType): InitStateType => {
  switch (action.type) {
    case GET_DEPARTMENT:
      return {
        department: action.payload,
      };
    case ADD_DEPARTMENT:
      return {
        department: state.department.concat(action.payload),
      };
    case DELETE_DEPARTMENT: {
      state.department = filterDelete(state.department, action.payload);
      console.log(state.department);
      return {
        department: [...state.department],
      };
    }
    case UPDATE_DEPARTMENT: {
      state.department = filterUpdate(state.department, action.payload);
      return {
        department: [...state.department],
      };
    }
    default:
      return state;
  }
};
