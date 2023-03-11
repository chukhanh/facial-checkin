//DD/MM/YYYY

export const ChangeStringToDate = (string: string): number => {
  string = string.split('/').join('');
  return parseInt(string, 10);
};
