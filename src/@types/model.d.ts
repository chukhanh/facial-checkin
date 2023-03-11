type Staff = {
  key?: number;
  UserID?: number;
  StaffID: number;
  FirstName: string;
  LastName: string;
  Email?: string;
  Birthday: string;
  Department?: string;
  DepartmentName: string;
  Shortname?: string;
  Avatar?: string;
  Role?: number;
};

type Department = {
  key?: number;
  ID?: number;
  Name: string;
  Total?: number;
};

type Attendance = {
  StaffID: number;
  FirstName: string;
  LastName: string;
  Department: string;
  DateCheckin: string;
  TimeCheckin: string;
  Timeunix: number;
  StaffNoti: string;
  HRNoti: string;
};

type InforListStaff = {
  code: string;
  staffinfo: Staff[];
  status: string;
  total_page: number;
  total_data: number;
};

type InforListDepartment = {
  code: string;
  departmentinfo: Department[];
  status: string;
  total_page: number;
  total_date: number;
};

type InforAttendance = {
  code: number;
  listcheckin: Attendance[];
  status: string;
  total_data: number;
  total_page: number;
};

type TypeParamsStaff = {
  id: string;
  name: string;
  birthday: string;
  department: string;
  page_num: number;
};

type TypeParamsDepartment = {
  id?: string;
  name: string;
  page_num: number;
};

interface IProfile {
  Email: string;
  FirstName: string;
  LastName: string;
  Roles: number;
  UserID: number;
}

type InforProfile = {
  code: number;
  message: string;
  data: IProfile;
};

interface IChangePassword {
  UserID: number;
  Password: string;
  NewPassword: string;
}

interface INewPasswordForForgotPassword {
  email: string;
  password: string;
  code: string;
}

type DataFilterDate = 'late' | 'weekend' | 'dayoff' | 'all';

interface DataFilter {
  key: string;
  value: string;
}
