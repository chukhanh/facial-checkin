import { SELECT, SELECT_ALL } from 'store/actions/selectedRow';
export const initState = { rowKey: [] };

type InitStateType = {
  rowKey: number[];
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

export const reducer = (state: InitStateType, action: ActionType): InitStateType => {
  switch (action.type) {
    case SELECT:
      return {
        rowKey: getUniqueAfterMerge(state.rowKey, action.payload),
      };
    case SELECT_ALL:
      console.log(action.payload);
      return {
        rowKey: deselect(state.rowKey, action.payload),
      };
    default:
      return state;
  }
};
