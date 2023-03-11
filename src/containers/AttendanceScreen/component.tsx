/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState, useEffect, ReactElement, ChangeEvent, useReducer } from 'react';
import { Layout, Breadcrumb, Button, Select, Form, TimePicker, message } from 'antd';
import moment from 'moment';

import CommentModal from 'components/CommentModal';
import AttendanceList from 'components/AttendanceList';
import { addZeroForMonth, ChangeDDMMToMMDD } from 'utils/ChangeTimeToString';
import {
  AttendanceServices,
  DepartmentServices,
  UserServices,
  CommentServices,
} from 'services/api';
import AddFileAttendance from 'components/AddFileAttendance';
import { decryptData } from 'utils/EncryptDecryptData';
import CookiesServices from 'services/cookies-services';
import { reducer, initState } from 'store/reducers/Comment';
import style from './style.module.scss';
import {
  StyledSelect,
  StyledSearch,
  StyledDatePicker,
  StyledWrapperNotFound,
} from './AttendanceScreen.style';
import { useHistory, useLocation, useParams } from 'react-router';

const { Content } = Layout;
const { Option } = Select;

const _changeDateToString = (date: number): string => {
  return date < 10 ? `0${date}` : `${date}`;
};

const AttendanceScreen = (props: any): ReactElement => {
  const param = props.match.params;
  const history = useHistory();
  const convertTime = (x: number): string => {
    if (x < 10) return `0${x}`;
    return `${x}`;
  };
  const convertUnixToDate = (unix: any) => {
    const checkinUnixToDate = new Date(unix * 1000);
    const checkin_date = convertTime(checkinUnixToDate.getDate());
    const checkin_month = convertTime(checkinUnixToDate.getMonth() + 1);
    const checkin_year = convertTime(checkinUnixToDate.getFullYear());
    return `${checkin_date}/${checkin_month}/${checkin_year}`;
  };
  const dateFormat = 'DD/MM/YYYY';
  // Get month define January is 0
  const currentMonth: string = addZeroForMonth(moment().get('month') + 1);
  const currentYear: number = moment().get('year');
  const currentDate: string = _changeDateToString(moment().get('date'));
  const previousMonth: string = addZeroForMonth(moment().subtract(1, 'month').get('month') + 1);
  const previousYear: number = moment().subtract(1, 'month').get('year');
  const [name, setName] = useState<string>('');
  const [date, setDate] = useState<string[]>([
    `26/${previousMonth}/${previousYear}`,
    `${+currentDate < 25 ? currentDate : '25'}/${currentMonth}/${currentYear}`,
  ]);
  const [current, setCurrent] = useState<number>(1);
  const [department, setDepartment] = useState<string>('');
  const [filterDate, setFilterDate] = useState<DataFilterDate>('all');
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [listComment, setListComment] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [isModalAddFile, setIsModalAddFile] = useState<boolean>(false);
  const [timeLate, setTimeLate] = useState<string>('10:00');
  const [isComment, setComment] = useState<boolean>(false);
  const role = decryptData(CookiesServices.getCookies('role'));
  const [commentState, commentDispatch] = useReducer(reducer, initState);
  const [attendanceTime, setAttendanceTime] = useState<any>('');
  const [staffID, setStaffID] = useState<any>(null);
  const [isClickNoti, setClickNoti] = useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(param).length === 0) {
      setClickNoti(false);
      setComment(false);
    }
    if (Object.keys(param).length !== 0) {
      setComment(true);
      setStaffID(Number(param.id));
      setAttendanceTime(convertUnixToString(param.attendance));
      setClickNoti(true);
      (async () => {
        try {
          const attendance = convertUnixToString(param.attendance);
          const data = await CommentServices.getComment({
            StaffID: param.id,
            Attendance: attendance,
          });
          setListComment(data);
          commentDispatch({ type: 'GET_COMMENT', payload: data });
        } catch (error) {
          console.log(error);
          setListComment(error);
          commentDispatch({ type: 'GET_COMMENT', payload: error });
        }
      })();
    }
  }, [param]);

  const dataFilter: DataFilter[] = [
    { key: 'all', value: 'Tất cả' },
    { key: 'late', value: 'Đi Trễ' },
    { key: 'weekend', value: 'Cuối tuần' },
    { key: 'dayoff', value: 'Không đi làm' },
  ];

  const _changeUnixTimestampToDate = (time: number): string => moment(time).format(dateFormat);

  const _removeDoubleWhitespace = (str: string): string => str.replace(/\s{2,}/g, ' ');

  const configPagination = {
    pageSize: 20,
    current: current,
    style: { marginTop: '2rem' },
    onChange: (page: number) => {
      (async () => {
        setClickNoti(false);
        try {
          setPageNum(page);
          const startDate = date[0];
          const endDate = date[1];
          let data = undefined;
          if (role === '1') {
            data = await AttendanceServices.getAttendance(
              name,
              startDate,
              endDate,
              department,
              page,
              filterDate,
              timeLate
            );
          } else {
            const userID = decryptData(CookiesServices.getCookies('userID'));
            const res = await UserServices.getProfile(userID);
            const Name = _removeDoubleWhitespace(res.data.LastName + ' ' + res.data.FirstName);
            data = await AttendanceServices.getAttendance(
              Name,
              startDate,
              endDate,
              department,
              page,
              filterDate,
              timeLate
            );
            setName(Name);
          }
          setAttendance(data.listcheckin);
          setTotal(data.total_data);
          setCurrent(page);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    total: total,
    showSizeChanger: false,
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await DepartmentServices.getDepartmentAll();
        setDepartmentList(data.departmentinfo);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const startDate = date[0];
        const endDate = date[1];
        let data = undefined;
        if (role === '1') {
          data = await AttendanceServices.getAttendance(
            Object.keys(param).length === 0 ? '' : param.from,
            Object.keys(param).length === 0 ? startDate : convertUnixToDate(param.attendance),
            Object.keys(param).length === 0 ? endDate : convertUnixToDate(param.attendance),
            department,
            1,
            filterDate,
            timeLate
          );
        } else {
          const userID = decryptData(CookiesServices.getCookies('userID'));
          const res = await UserServices.getProfile(userID);
          const Name = _removeDoubleWhitespace(res.data.LastName + ' ' + res.data.FirstName);
          data = await AttendanceServices.getAttendance(
            Name.trim(),
            Object.keys(param).length === 0 ? startDate : convertUnixToDate(param.attendance),
            Object.keys(param).length === 0 ? endDate : convertUnixToDate(param.attendance),
            department,
            1,
            filterDate,
            timeLate
          );
          setName(Name);
        }
        setAttendance(data.listcheckin);
        setTotal(data.total_data);
      } catch (error) {
        if (error.code === 1008) setAttendance([]);
      }
    })();
  }, [param]);

  const handleShowModalAddFile = useCallback((): void => {
    setIsModalAddFile(true);
  }, [isModalAddFile]);

  const handleCancelModalAddFile = useCallback((): void => {
    setIsModalAddFile(false);
  }, [isModalAddFile]);

  const convertUnixToString = (unix: any) => {
    const checkinUnixToDate = new Date(unix * 1000);
    const checkin_date = checkinUnixToDate.getDate();
    const checkin_month = checkinUnixToDate.getMonth() + 1;
    const checkin_year = checkinUnixToDate.getFullYear();
    const checkin_hour = convertHour(checkinUnixToDate.getHours()) - 7;
    const checkin_minutes = convertTime(checkinUnixToDate.getMinutes());
    const checkin_seconds = convertTime(checkinUnixToDate.getSeconds());
    const AM_PM = convertAMPM(checkin_hour);
    return `${checkin_month}/${checkin_date}/${checkin_year} ${formatHour(
      checkin_hour
    )}:${checkin_minutes}:${checkin_seconds} ${AM_PM}`;
  };

  const handleClick = useCallback((): void => {
    setComment(false);
    setClickNoti(false);
    (async () => {
      try {
        setPageNum(1);
        const startDate = date[0];
        const endDate = date[1];
        let data: InforAttendance = null;
        if (role === '1') {
          data = await AttendanceServices.getAttendance(
            name,
            startDate,
            endDate,
            department,
            1,
            filterDate,
            timeLate
          );
        } else {
          const userID = decryptData(CookiesServices.getCookies('userID'));
          const res = await UserServices.getProfile(userID);
          const Name = _removeDoubleWhitespace(res.data.LastName + ' ' + res.data.FirstName);
          data = await AttendanceServices.getAttendance(
            Name,
            startDate,
            endDate,
            department,
            1,
            filterDate,
            timeLate
          );
        }
        for (let i = 0; i < data.listcheckin.length; i += 1) {
          try {
            const formData = {
              staffID: data.listcheckin[i].StaffID,
              attendance: convertUnixToString(data.listcheckin[i].Timeunix),
            };
            const NotiData = await CommentServices.getNotification(formData);
            data.listcheckin[i].StaffNoti = NotiData.StaffNoti;
            data.listcheckin[i].HRNoti = NotiData.HRnoti;
          } catch (error) {
            data.listcheckin[i].StaffNoti = error.StaffNoti;
            data.listcheckin[i].HRNoti = error.HRnoti;
            console.log(error);
          }
        }
        setAttendance(data.listcheckin);
        setTotal(data.total_data);
        setCurrent(1);
      } catch (error) {
        if (error.code === 1008) setAttendance([]);
      }
    })();
  }, [name, date, department, filterDate, timeLate]);

  const handleReset = useCallback(async () => {
    setClickNoti(false);
    try {
      const name = '',
        department = '',
        date = [
          `26/${previousMonth}/${previousYear}`,
          `${+currentDate < 25 ? currentDate : '25'}/${currentMonth}/${currentYear}`,
        ],
        page_num = 1;
      setName(name);
      setDepartment(department);
      setDate(date);
      setPageNum(page_num);
      setFilterDate('all');
      setTimeLate('10:00');
      setComment(false);
      const startDate = date[0];
      const endDate = date[1];

      const data: InforAttendance = await AttendanceServices.getAttendance(
        '',
        startDate,
        endDate,
        '',
        1,
        'all',
        '10:00'
      );
      console.log(data);
      setAttendance(data.listcheckin);
      setTotal(data.total_data);
      setCurrent(1);
    } catch (err) {
      console.log(err);
      history.push('/attendance');
      setAttendance([]);
    }
  }, [name, department, date, pageNum, filterDate, timeLate]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>): void => {
      setName(e.target.value);
    },
    [name]
  );

  const handleDateChange = useCallback(
    (value): void => {
      if (value === null) setDate(['', '']);
      else if (value[0] && value[1] === null) {
        const startDate = _changeUnixTimestampToDate(value[0]['_d']);
        setDate([startDate, '']);
      } else if (value[0] === null && value[1]) {
        const endDate = _changeUnixTimestampToDate(value[1]['_d']);
        setDate(['', endDate]);
      } else {
        const startDate = _changeUnixTimestampToDate(value[0]['_d']);
        const endDate = _changeUnixTimestampToDate(value[1]['_d']);
        setDate([startDate, endDate]);
      }
    },
    [date]
  );

  const handleSelectDepartmentChange = useCallback(
    (value: string): void => {
      setDepartment(`${value}`);
    },
    [department]
  );

  const handleSelectFilterDateChange = useCallback(
    (value: DataFilterDate): void => {
      setFilterDate(value);
    },
    [filterDate]
  );

  const handleExport = async (): Promise<void> => {
    try {
      const start_date = ChangeDDMMToMMDD(date[0]),
        end_date = ChangeDDMMToMMDD(date[1]);
      const data = await AttendanceServices.exportAttendance(start_date, end_date, timeLate);
    } catch (error) {
      const downloadUrl = window.URL.createObjectURL(new Blob([error]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Attendance-${date[0]}-${date[1]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleChangeTimeLate = useCallback(
    (_, value: string): void => {
      (async () => {
        try {
          setTimeLate(value);
          setPageNum(1);
          setFilterDate('late');
          const startDate = date[0];
          const endDate = date[1];
          const data: InforAttendance = await AttendanceServices.getAttendance(
            name,
            startDate,
            endDate,
            department,
            1,
            'late',
            value
          );
          setAttendance(data.listcheckin);
          setTotal(data.total_data);
          setCurrent(1);
        } catch (error) {
          if (error.code === 1008) setAttendance([]);
        }
      })();
    },
    [timeLate]
  );

  const departmentOptions = (
    <>
      {departmentList.map((department: Department) => {
        return (
          department.Name !== 'Ha noi Brand' && (
            <Option key={department.ID} value={department.Name}>
              {department.Name}
            </Option>
          )
        );
      })}
    </>
  );

  const dataFilterOptions = (
    <>
      {dataFilter.map((data: DataFilter) => (
        <Option key={data.key} value={data.key}>
          {data.value}
        </Option>
      ))}
    </>
  );

  const onClickDone = () => {
    if (role !== '1') message.error('Bạn không có quyền đóng bình luận');
  };

  const convertHour = (hour: number): number => {
    if (hour === 0) return 24;
    else if (hour >= 7 && hour <= 23) return hour;
    return 24 + hour;
  };

  const convertAMPM = (hour: number): string => {
    if (hour >= 12) return 'PM';
    return 'AM';
  };

  const formatHour = (hour: number): number => {
    if (hour > 12) return hour - 12;
    return hour;
  };

  const onClickComment = (record: any) => {
    setComment(true);
    (async () => {
      try {
        const attendance = convertUnixToString(record.Timeunix);
        setAttendanceTime(attendance);
        setStaffID(record.StaffID);
        const data = await CommentServices.getComment({
          StaffID: record.StaffID,
          Attendance: attendance,
        });
        console.log(data);
        setListComment(data);
        commentDispatch({ type: 'GET_COMMENT', payload: data });
      } catch (error) {
        console.log(error);
        setListComment(error);
        commentDispatch({ type: 'GET_COMMENT', payload: error });
      }
    })();
  };

  return (
    <>
      <div className={style.breadcrumb}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>Điểm danh</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý điểm danh</Breadcrumb.Item>
        </Breadcrumb>
        {role === '1' && (
          <div>
            <Button className={style.buttonStyle} size="middle" onClick={handleShowModalAddFile}>
              Thêm file điểm danh
            </Button>
            <AddFileAttendance
              width={950}
              title="Thông tin chấm công vân tay"
              footer={null}
              closable={false}
              visible={isModalAddFile}
              handleCancel={handleCancelModalAddFile}
            />
          </div>
        )}
      </div>
      <Content>
        <Form>
          <div className={style.searchWrapper}>
            <div
              className={style.search}
              style={{ justifyContent: role === '1' ? 'space-between' : 'space-around' }}>
              {role === '1' && (
                <StyledSearch
                  placeholder="Tìm kiếm theo tên nhân viên"
                  // defaultValue={Object.keys(param).length === 0 ? name : param.from}
                  value={name}
                  onChange={handleChange}
                />
              )}
              <StyledDatePicker
                onCalendarChange={handleDateChange}
                placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                defaultValue={[moment(date[0], dateFormat), moment(date[1], dateFormat)]}
                format={dateFormat}
              />
              {role === '1' && (
                <StyledSelect
                  placeholder="Tìm kiếm theo bộ phận"
                  value={department !== '' ? department : null}
                  onChange={handleSelectDepartmentChange}
                  listHeight={170}>
                  {departmentList ? departmentOptions : null}
                </StyledSelect>
              )}
              <StyledSelect
                placeholder="Filter"
                value={filterDate}
                onChange={(value: DataFilterDate) => handleSelectFilterDateChange(value)}
                listHeight={170}>
                {dataFilter ? dataFilterOptions : null}
              </StyledSelect>
            </div>
            <div className={style.searchButton}>
              <Button
                className={`${style.deleteButton} ${style.buttonCancelStyle}`}
                size="middle"
                onClick={handleReset}>
                Khôi phục
              </Button>
              <Button
                className={`${style.deleteButton} ${style.buttonStyle}`}
                size="middle"
                onClick={handleClick}
                htmlType="submit">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </Form>
        <div className={style.contentWrapper}>
          <div className={style.tableWrapper} style={{ width: isComment ? '75%' : '100%' }}>
            {attendance.length > 0 ? (
              <>
                <div
                  className={style.delete}
                  style={
                    attendance.length === 0
                      ? { justifyContent: 'flex-end' }
                      : { justifyContent: 'space-between' }
                  }>
                  <span>Có &quot;{total}&quot; kết quả tìm kiếm</span>
                  <span>
                    Giờ đi trễ:{' '}
                    <TimePicker
                      defaultValue={moment(timeLate, 'HH:mm')}
                      format="HH:mm"
                      bordered={false}
                      onChange={handleChangeTimeLate}
                    />
                  </span>
                </div>
                <div className={style.listWrapper}>
                  <AttendanceList
                    data={attendance}
                    pagination={configPagination}
                    total={total}
                    isClickComment={isComment}
                    clickComment={e => onClickComment(e)}
                    role={role}
                    isClickNoti={isClickNoti}
                  />
                </div>
                <div className={style.export}>
                  <Button className={style.buttonStyle} size="middle" onClick={handleExport}>
                    Xuất ra file Excel
                  </Button>
                </div>
              </>
            ) : (
              <StyledWrapperNotFound>
                <img
                  className={style.imageNotFound}
                  src="Illustration.svg"
                  alt="Search not found"
                />
              </StyledWrapperNotFound>
            )}
          </div>
          {isComment ? (
            <div className={style.commentWrapper} style={{ width: isComment ? '25%' : '0%' }}>
              <div className={style.comment}>
                <CommentModal
                  clickClose={() => {
                    setComment(false);
                  }}
                  clickDone={onClickDone}
                  listComment={commentState.comment}
                  attendance={attendanceTime}
                  staffID={staffID}
                  commentDispatch={commentDispatch}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Content>
    </>
  );
};

export default AttendanceScreen;
