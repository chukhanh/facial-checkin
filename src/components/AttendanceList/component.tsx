/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, useEffect, useState } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { CommentOutlined } from '@ant-design/icons';
import { ChangeTimeStrToString } from 'utils/ChangeTimeToString';
import { CommentServices } from 'services/api';
import CookiesServices from 'services/cookies-services';
import { decryptData } from 'utils/EncryptDecryptData';
import style from './style.module.scss';

const { Column } = Table;

type DataType = Attendance;
interface IProps {
  data: Attendance[] | [];
  total: number;
  pagination: any;
  clickComment: (e) => void;
  isClickComment: boolean;
  isClickNoti: boolean;
  role: string;
}

type Key = 'DateCheckin' | 'TimeCheckin' | 'Department';

const AttendanceList = ({
  data,
  pagination,
  clickComment,
  isClickComment,
  isClickNoti,
  role,
}: IProps): ReactElement => {
  const [id, setID] = useState<any>(null);
  const [notification, setNotification] = useState<any>([]);
  const userID = decryptData(CookiesServices.getCookies('userID'));

  useEffect(() => {
    setID(null);
  }, [data]);

  useEffect(() => {
    (async () => {
      try {
        const noti = await CommentServices.getNotificationByUserID(userID);
        setNotification(noti);
      } catch (error) {
        console.log(error);
        setNotification(error);
      }
    })();
  }, []);

  const convertNotiDataToArrayString = (data: any): string[] => {
    const res = [];
    for (let i = 0; i < data.length; i++) {
      res.push(data[i].StaffID.toString().concat(data[i].Attendance.toString()));
    }
    return res;
  };

  const _changeTimeToUnixTimeStamp = (s: string): number => {
    return moment(s, 'DD/MM/YYYY').valueOf();
  };

  const _onSort = (a: string, b: string, key: Key): number => {
    if (key === 'DateCheckin') {
      const new_a = _changeTimeToUnixTimeStamp(a),
        new_b = _changeTimeToUnixTimeStamp(b);
      return new_a - new_b;
    } else if (key === 'TimeCheckin') {
      const new_a: number = +a.split(':').join(''),
        new_b: number = +b.split(':').join('');
      return new_a - new_b;
    } else {
      return a.localeCompare(b);
    }
  };

  const convertColor = (notiData: any, staffID: any, time: any): any => {
    const check = staffID.toString().concat(time.toString());
    if (notiData.includes(check)) return { color: '#ff4d4f', fontSize: 20 };
    return { color: '#000', fontSize: 20 };
  };

  return (
    <Table
      rowClassName={(record, i) => (id === i || isClickNoti ? style.isClickComment : null)}
      dataSource={data}
      pagination={pagination}
      scroll={{ y: 440 }}>
      <Column
        title="Họ và Tên"
        align="center"
        dataIndex={['Firstname', 'LastName']}
        key="FirstName"
        render={(_, record: DataType) => {
          return (
            <span>
              {record.LastName} {record.FirstName}
            </span>
          );
        }}
      />
      <Column
        title="Ngày"
        align="center"
        dataIndex="DateCheckin"
        key="DateCheckin"
        render={(text: string) => {
          return <span>{text}</span>;
        }}
        sorter={(a: Attendance, b: Attendance) =>
          _onSort(a.DateCheckin, b.DateCheckin, 'DateCheckin')
        }
        defaultSortOrder="descend"
      />
      <Column
        title="Thời gian check-in"
        align="center"
        dataIndex="TimeCheckin"
        key="TimeCheckin"
        render={(text: string) => {
          const time = ChangeTimeStrToString(text);
          return <span>{time === ':undefined' ? null : time}</span>;
        }}
        sorter={(a: Attendance, b: Attendance) =>
          _onSort(
            ChangeTimeStrToString(a.TimeCheckin),
            ChangeTimeStrToString(b.TimeCheckin),
            'TimeCheckin'
          )
        }
        defaultSortOrder="descend"
      />
      <Column
        title="Bộ Phận"
        align="center"
        dataIndex="Department"
        render={text => `${text}`}
        sorter={(a: DataType, b: DataType) => _onSort(a.Department, b.Department, 'Department')}
        defaultSortOrder="ascend"
      />
      <Column
        align="center"
        render={(text, record: any, i) => {
          return (
            <CommentOutlined
              style={convertColor(
                convertNotiDataToArrayString(notification),
                record.StaffID,
                record.Timeunix
              )}
              onClick={() => {
                clickComment(record);
                setID(i);
              }}
            />
          );
        }}
      />
    </Table>
  );
};

export default AttendanceList;
