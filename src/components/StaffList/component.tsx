/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useState, useEffect, useCallback, useReducer } from 'react';
import { Table } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ChangeDateToString } from 'utils/ChangeTimeToString';

const { Column } = Table;

type DataType = Staff;

type PropType = {
  staff: Staff[] | [];
  total: number;
  pagination: any;
  rowSelection: any;
};

const StaffList = (props: PropType): ReactElement => {
  const { staff, pagination, rowSelection } = props;

  for (let i = 0; i < staff.length; i++) {
    staff[i].key = staff[i].StaffID;
  }

  const onSort = (a: DataType, b: DataType, keyColumn: string): number => {
    if (keyColumn === 'userid') return a.StaffID - b.StaffID;
    else if (keyColumn === 'fullname') return a.FirstName.localeCompare(b.FirstName);
    else if (keyColumn === 'department') return a.Department.localeCompare(b.Department);
    else if (keyColumn === 'dob') return a.Birthday.localeCompare(b.Birthday);
  };

  return (
    <>
      {staff ? (
        <Table
          style={{ textTransform: 'capitalize' }}
          dataSource={staff}
          bordered={true}
          locale={{
            triggerDesc: 'Nhấn để sắp xếp giảm dần',
            triggerAsc: 'Nhấn để sắp xếp tăng dần',
            cancelSort: 'Nhấn để sắp xếp mặc định',
          }}
          rowSelection={rowSelection}
          pagination={pagination}
          scroll={staff.length > 6 ? { y: 420 } : null}>
          <Column
            title="Mã nhân viên"
            align="center"
            dataIndex="StaffID"
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'userid')}
            render={text => `VU${text}`}
          />
          <Column
            title="Họ và Tên"
            align="center"
            dataIndex={['FirstName', 'LastName']}
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'fullname')}
            render={(_, record: DataType) => {
              return (
                <Link to={`/staff/edit?staffID=${record.StaffID}`}>
                  {record.LastName} {record.FirstName}
                </Link>
              );
            }}
          />
          <Column
            title="Bộ Phận"
            align="center"
            dataIndex="Department"
            render={text => `${text}`}
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'department')}
          />
          <Column
            title="Ngày Sinh"
            align="center"
            dataIndex="Birthday"
            render={text => `${text}`}
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'dob')}
          />
        </Table>
      ) : (
        <LoadingOutlined />
      )}
    </>
  );
};

export default StaffList;
