import { SELECT, SELECT_ALL } from 'store/actions/selectedRow';
export const initStateDepartment = { departmentKey: [] };

type InitStateType = {
  departmentKey: number[];
};

type ActionType = {
  payload: number[] | string | number;
  type: typeof SELECT | typeof SELECT_ALL;
};

const getUniqueAfterMerge = (arr1: number[], arr2: string | number[] | number) => {
  if (Array.isArray(arr2)) {
    const arr = arr1.concat(arr2);
    const uniqueArr = [];

    for (const i of arr) {
      if (uniqueArr.indexOf(i) === -1) {
        uniqueArr.push(i);
      }
    }
    return uniqueArr;
  } else {
    if (arr2 === 'reset') return [];
    return arr1.filter(x => x !== arr2);
  }
};

const deselect = (arr1: number[], arr2: string | number[] | number) => {
  if (Array.isArray(arr2)) return arr1.filter(x => !arr2.includes(x));
};

export const departmentReducer = (state: InitStateType, action: ActionType): InitStateType => {
  switch (action.type) {
    case SELECT:
      return {
        departmentKey: getUniqueAfterMerge(state.departmentKey, action.payload),
      };
    case SELECT_ALL:
      console.log(action.payload);
      return {
        departmentKey: deselect(state.departmentKey, action.payload),
      };
    default:
      return state;
  }
};
