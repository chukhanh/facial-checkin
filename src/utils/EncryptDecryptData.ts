import CryptoJS from 'crypto-js';

export const encryptData = (data: string): string => {
  const encryptCode = CryptoJS.DES.encrypt(data, process.env.REACT_APP_SECRET_KEY).toString();
  return encryptCode;
};

export const decryptData = (ciphertext: string): string => {
  const decryptCode = CryptoJS.DES.decrypt(ciphertext, process.env.REACT_APP_SECRET_KEY).toString(
    CryptoJS.enc.Utf8
  );
  return decryptCode;
};
