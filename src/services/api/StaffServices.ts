/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../axios';

type TypeParams = {
  id: string;
  name: string;
  birthday: string;
  department: string;
  page_num: number;
};

type DeleteType = {
  StaffID: number[];
};

type TResponseUpdate = {
  messages: string;
};

export const getStaff = async (data: TypeParams): Promise<InforListStaff> => {
  const url = {
    id: '',
    name: '',
    department: '',
    birthday: '',
    page_num: '',
  };

  if (data.id) url.id = `=${data.id}`;
  if (data.name) url.name = `=${data.name}`;
  if (data.birthday) url.birthday = `=${data.birthday}`;
  if (data.department) url.department = `=${data.department}`;
  if (data.page_num) url.page_num = `=${data.page_num}`;

  const res = await axios.get(
    `/staff/staffinformation?id${url.id}&name${url.name}&birthday${url.birthday}&department${url.department}&page_num${url.page_num}`
  );
  return res.data;
};

export const getStaffDetail = async (staffID: string): Promise<Staff> => {
  const res = await axios.get(`/staff/staffInformationDetail?id=${staffID}`);
  return res.data.staffinfo;
};

export const addStaff = async (data: Staff): Promise<any> => {
  const res = await axios.post('/staff/addonestaff', data);
  return res;
};

export const updateStaff = async (data: Staff): Promise<TResponseUpdate> => {
  const res = await axios.put('/staff/updateStaffInformation', data);
  return res.data;
};

export const deleteStaff = async (data: DeleteType): Promise<any> => {
  const res = await axios.delete('/staff/deleteStaff', { data });
  return res.data;
};

export const exportStaff = async (data: TypeParams): Promise<any> => {
  const url = {
    id: '',
    name: '',
    department: '',
    birthday: '',
  };
  if (!data.id && !data.name && !data.birthday && !data.department) {
    const res = await axios.get('/staff/exportStaffIntoFile', {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.ms-excel',
      },
    });
    return res;
  } else {
    if (data.id) url.id = `=${data.id}`;
    if (data.name) url.name = `=${data.name}`;
    if (data.birthday) url.birthday = `=${data.birthday}`;
    if (data.department) url.department = `=${data.department}`;

    const res = await axios.get(
      `/staff/exportStaffIntoFile?id${url.id}&name${url.name}&birthday${url.birthday}&department${url.department}`,
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/vnd.ms-excel',
        },
      }
    );
    return res;
  }
};

export const exportStaffFormat = async (): Promise<any> => {
  const res = await axios.get('/staff/serveDownload?filename=StaffFormat', {
    responseType: 'arraybuffer',
  });
  return res;
};

export const importStaff = async (data: any): Promise<any> => {
  console.log(data);
  const res = await axios.post('/data/Addmanystaff', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};

export const uploadAvt = async (data: any, staffid: number): Promise<any> => {
  const res = await axios.put(`/staff/updateAvatar?staffid=${staffid}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res;
};
