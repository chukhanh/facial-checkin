import axios from '../axios';
import { LoginCredentialsModel, LoginResponseModel, RegisterModel } from './types';

export * from './types';

export type RegisterResponse = {
  status: string;
};

export const login = async (userCredetial: LoginCredentialsModel): Promise<LoginResponseModel> => {
  const response = await axios.post('/user/login', {
    ...userCredetial,
  });
  return response.data as LoginResponseModel;
};

export const register = async (userInfo: RegisterModel): Promise<RegisterResponse> => {
  const response = await axios.post('/user/register', {
    ...userInfo,
  });
  return response.data as RegisterResponse;
};
