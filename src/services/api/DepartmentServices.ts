/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../axios';

type TypeParams = {
  id?: string;
  name: string;
  page_num: number;
};

type DeleteType = {
  DepartmentID: number[];
};

export const getDepartment = async (data: TypeParams): Promise<InforListDepartment> => {
  const url = {
    id: '',
    name: '',
    page_num: '',
  };

  if (data.id) url.id = `=${data.id}`;
  if (data.name) url.name = `=${data.name}`;
  if (data.page_num) url.page_num = `=${data.page_num}`;

  const res = await axios.get(
    `/staff/departmentinformation?id${url.id}&name${url.name}&page_num${url.page_num}`
  );
  return res.data;
};

export const addDepartment = async (data: Department): Promise<any> => {
  const res = await axios.post('/staff/createNewDepartment', data);
  return res;
};

export const getDepartmentAll = async (): Promise<InforListDepartment> => {
  const res = await axios.get(`/staff/departmentinformation`);
  return res.data;
};

export const deleteDepartment = async (data: DeleteType): Promise<InforListDepartment> => {
  const res = await axios.delete(`/staff/deleteDepartment`, { data });
  return res.data;
};

export const updateDepartment = async (data: Department): Promise<any> => {
  const res = await axios.put('/staff/updateDepartment', data);
  return res.data;
};
