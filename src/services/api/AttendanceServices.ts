/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../axios';

export const getAttendance = async (
  name: string,
  startDate: string,
  endDate: string,
  department: string,
  page_num: number,
  filterDate: DataFilterDate,
  timelate: string
): Promise<InforAttendance> => {
  const url = {
    name: '',
    startDate: '',
    endDate: '',
    department: '',
    page_num: '',
    timelate: '',
  };
  if (name) url.name = `=${name}`;
  if (startDate) url.startDate = `=${startDate}`;
  if (endDate) url.endDate = `=${endDate}`;
  if (department) url.department = `=${department}`;
  if (page_num) url.page_num = `=${page_num}`;
  if (timelate) url.timelate = `=${timelate}`;

  let res = null;

  if (filterDate === 'all') {
    res = await axios.get(
      `/checkin/attendance?name${url.name}&start_date${url.startDate}&end_date${url.endDate}&department${url.department}&page_num${url.page_num}&timelate${url.timelate}`
    );
  }
  // late | weekend | dayoff
  else {
    res = await axios.get(
      `/checkin/attendance?name${url.name}&start_date${url.startDate}&end_date${url.endDate}&department${url.department}&page_num${url.page_num}&${filterDate}&timelate${url.timelate}`
    );
  }

  return res.data;
};

export const exportAttendance = async (
  start_date: string,
  end_date: string,
  timelate: string
): Promise<any> => {
  const url = {
    start_date: '',
    end_date: '',
    timelate: '',
    department: '',
  };

  if (start_date) url.start_date = `=${start_date}`;
  if (end_date) url.end_date = `=${end_date}`;
  if (timelate) url.timelate = `=${timelate}`;
  const res = await axios.get(
    `/data/exportAttendance?start_date${url.start_date}&end_date${url.end_date}&timelate${url.timelate}`,
    {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.ms-excel',
      },
    }
  );
  return res;
};

export const importAttendance = async (data: any): Promise<any> => {
  const res = await axios.post('/data/postAttendanceFingerprint', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log(res);
  return res;
};
