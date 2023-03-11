//MM/DD/YYYY
//1102020, 111 101 1111 1/11 01/11
export const ChangeDateToString = (date: number): string => {
  const dateStr = date.toString();
  if (dateStr.length === 1 && dateStr[0] === '0') return '';
  else if (dateStr.length === 3) return `0${dateStr[0]}/${dateStr.slice(1)}`;
  else if (dateStr.length === 4) return `${dateStr.slice(0, 2)}/${dateStr.slice(2)}`;
  else if (dateStr.length === 7) {
    return `${dateStr.slice(1, 3)}/0${dateStr[0]}/${dateStr.slice(3)}`;
  } else {
    return `${dateStr.slice(2, 4)}/${dateStr.slice(0, 2)}/${dateStr.slice(4)}`;
  }
};

export const ChangeTimeStrToString = (time: string): string => {
  const timeArr = time.split(':');
  return `${timeArr[0]}:${timeArr[1]}`;
};

export const ChangeTimeToString = (time: number): string => {
  const timeStr = time.toString();
  //82555
  if (timeStr.length === 5) return `${timeStr[0]}:${timeStr.slice(1, 3)}`;
  else return `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
};

export const ChangeDateToSort = (date: string): number => {
  if (date.length === 7) {
    return +`${date.slice(3)}0${date.slice(0, 3)}`;
  } else {
    return +`${date.slice(4)}${date.slice(0, 4)}`;
  }
};

export const addZeroForMonth = (month: number): string => {
  const monthStr = month.toString();
  return monthStr.length > 1 ? monthStr : `0${monthStr}`;
};

export const ChangeDDMMToMMDD = (date: string): string => {
  const dateArr = date.split('/');
  return `${dateArr[1]}/${dateArr[0]}/${dateArr[dateArr.length - 1]}`;
};
