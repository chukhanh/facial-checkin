/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { Table, Button, Input } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { DepartmentServices } from 'services/api';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import style from './style.module.scss';

const { Column } = Table;

type DataType = Department;

type PropType = {
  department: Department[] | [];
  departmentDispatch: any;
  total: number;
  pagination: any;
  rowSelection: any;
};

interface InputType {
  ID: number;
  Name: string;
}

const MySwal = withReactContent(Swal);

const DepartmentList = (props: PropType): ReactElement => {
  const { department, departmentDispatch, pagination, rowSelection } = props;
  const [edit, setEdit] = useState<boolean>(false);
  const [ID, setID] = useState<number>(0);
  const [inputValues, setInputValues] = useState<InputType>({
    ID: 0,
    Name: '',
  });

  for (let i = 0; i < department.length; i++) {
    department[i].key = department[i].ID;
  }

  const onSort = (a: DataType, b: DataType, keyColumn: string): number => {
    if (keyColumn === 'total') return a.Total - b.Total;
    else if (keyColumn === 'name') return a.Name.localeCompare(b.Name);
  };

  const handleClickName = useCallback(
    (ID: number): void => {
      setEdit(true);
      setID(ID);
    },
    [edit, ID]
  );

  const handleCancel = useCallback((): void => {
    setEdit(false);
    setID(0);
  }, [edit, ID]);

  const handleInputChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValues({ ...inputValues, [name]: e.target.value });
    },
    [inputValues]
  );

  const onSave = useCallback((): void => {
    const request = {
      ID: ID,
      Name: inputValues.Name,
    };
    (async () => {
      try {
        console.log(request);
        const data = await DepartmentServices.updateDepartment(request);
        console.log(data);
      } catch (error) {
        console.log(error);
        if (error) {
          handleCancel();
          departmentDispatch({ type: 'UPDATE_DEPARTMENT', payload: request });
          MySwal.fire({
            title: 'Cập nhật thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })();
  }, [inputValues]);

  return (
    <>
      {department ? (
        <Table
          style={{ textTransform: 'capitalize' }}
          dataSource={department}
          bordered={true}
          rowKey={record => record.ID}
          locale={{
            selectionAll: 'Chọn tất cả',
            triggerDesc: 'Nhấn để sắp xếp giảm dần',
            triggerAsc: 'Nhấn để sắp xếp tăng dần',
            cancelSort: 'Nhấn để sắp xếp mặc định',
          }}
          rowSelection={rowSelection}
          pagination={pagination}
          scroll={department.length > 6 ? { y: 420 } : null}>
          {/* <Column
            title="Mã bộ phận"
            align="center"
            dataIndex="ID"
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'id')}
          /> */}
          <Column
            title="Tên bộ phận"
            align="center"
            dataIndex="Name"
            width={700}
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'name')}
            render={(_, record: DataType) => {
              if (edit && record.ID === ID) {
                return (
                  <div className={style.nameWrapper}>
                    <Input
                      defaultValue={record.Name}
                      style={{ width: '20rem', marginRight: '4rem' }}
                      onChange={handleInputChange('Name')}
                    />
                    <div className={style.footer}>
                      <Button
                        key="cancel"
                        size="middle"
                        className={style.buttonCancelStyle}
                        onClick={handleCancel}>
                        Hủy
                      </Button>
                      <Button
                        key="save"
                        size="middle"
                        className={style.buttonStyle}
                        onClick={onSave}>
                        Lưu
                      </Button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <Button type="link" onClick={() => handleClickName(record.ID)}>
                    {record.Name}
                  </Button>
                );
              }
            }}
          />
          <Column
            title="Số lượng nhân viên"
            align="center"
            dataIndex="Total"
            width={700}
            sorter={(a: DataType, b: DataType) => onSort(a, b, 'total')}
            render={(_, record: DataType) => {
              const name = record.Name;
              return <Link to={`/staff?department=${name}`}>{record.Total}</Link>;
            }}
          />
        </Table>
      ) : (
        <LoadingOutlined />
      )}
    </>
  );
};

export default DepartmentList;
