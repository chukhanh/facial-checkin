/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { stripLeadingSlash } from 'history/PathUtils';
import { number, string } from 'yup';
import axios from '../axios';

interface NotiType {
  staffID: number;
  attendance: string;
}

export const getComment = async (data: any): Promise<any> => {
  const res = await axios.post('/comment/getComment', data);
  console.log(res);
  return res;
};

export const addComment = async (data: any): Promise<any> => {
  const res = await axios.post('/comment/postComment', data);
  console.log(res);
  return res;
};

export const getNotification = async (data: NotiType): Promise<any> => {
  const res = await axios.get(
    `/comment/notification?StaffID=${data.staffID}&Attendance=${data.attendance}`
  );
  console.log(res);
  return res;
};

export const getNotificationByUserID = async (UserID: string): Promise<any> => {
  const res = await axios.get(`/comment/getAllNotification?UserID=${UserID}`);
  console.log(res);
  return res;
};
