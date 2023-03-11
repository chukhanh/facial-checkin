import axios from '../axios';

interface IResponse {
  code: number;
  message: string;
}

export const getProfile = async (userID: string): Promise<InforProfile> => {
  const url = {
    userID: '',
  };

  if (userID) url.userID = `=${userID}`;
  const res = await axios.get(`/user/profile?UserID${url.userID}`);
  return res.data;
};

export const changePassword = async (dataOfUser: IChangePassword): Promise<IResponse> => {
  const res = await axios.post(`/user/updatepassword`, dataOfUser);
  return res.data;
};

export const sendEmailForgotPassword = async (emailData: string): Promise<IResponse> => {
  const res = await axios.post(`/user/forgotpassword`, {
    email: emailData,
  });
  return res.data;
};

export const confirmForgotPassword = async (
  data: INewPasswordForForgotPassword
): Promise<IResponse> => {
  const res = await axios.post(`/user/confirmforgot`, data);
  return res.data;
};
