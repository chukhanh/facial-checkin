/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '../axios';

// AttendanceFormat, StaffFormat
export const exportDataFormat = async (fileName: string): Promise<any> => {
  const res = await axios.get(`/staff/serveDownload?filename=${fileName}`, {
    responseType: 'arraybuffer',
  });
  return res;
};
