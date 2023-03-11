import { GenericResponseBody } from '../types';

export type LoginCredentialsModel = {
  email: string;
  password: string;
};

export type LoginResponData = {
  name: string;
  refreshToken: string;
  role: number;
  token: string;
  userID: number;
  session?: string;
};
export type LoginResponseModel = GenericResponseBody<LoginResponData>;

// Register user
export type RegisterModel = {
  UserID?: number;
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Flag?: 0 | 1; // 0: no UserID, 1: has User ID
  Role: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type RegisterResponseModel = GenericResponseBody<{}>;
