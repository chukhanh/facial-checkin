/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ReactElement, useState, useCallback, ChangeEvent } from 'react';
import { Form, Button, Input } from 'antd';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { StyledSearch } from 'styles/styledComponent';
import { DepartmentServices } from 'services/api';
import style from './style.module.scss';

type PropType = {
  department: Department[];
  departmentDispatch: any;
  handleCancel: () => void;
};

interface InputType {
  Name: string;
}

const MySwal = withReactContent(Swal);

export default function AddOneStaffModal(props: PropType): ReactElement {
  const { department, departmentDispatch, handleCancel } = props;
  const [inputValues, setInputValues] = useState<InputType>({
    Name: '',
  });

  const handleInputChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValues({ ...inputValues, [name]: e.target.value });
    },
    [inputValues]
  );

  const onFinish = useCallback((): void => {
    (async () => {
      try {
        const request = {
          Name: inputValues.Name,
        };
        console.log(request);
        const data = await DepartmentServices.addDepartment(request);
        console.log(data);
        if (data.status === 202) {
          handleCancel();
          MySwal.fire({
            title: 'Thêm thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          const dataPayload = {
            ID: data.data.DepartmentID,
            Name: inputValues.Name,
          };
          departmentDispatch({ type: 'ADD_DEPARTMENT', payload: dataPayload });
        } else {
          handleCancel();
          MySwal.fire({
            title: 'Bộ phận đã tồn tại',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error);
        MySwal.fire({
          title: 'Bộ phận đã tồn tại',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    })();
  }, [inputValues]);

  return (
    <Form onFinish={onFinish}>
      <div className={style.contentWrapper}>
        <div className={style.inputWrapper}>
          <StyledSearch
            style={{ width: '100%' }}
            placeholder="Thêm tên bộ phận"
            value={inputValues.Name}
            onChange={handleInputChange('Name')}
          />
        </div>
        <div className={style.footer}>
          <Button
            key="cancel"
            size="middle"
            className={style.buttonCancelStyle}
            onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button key="add" size="middle" className={style.buttonStyle} htmlType="submit">
            Thêm
          </Button>
        </div>
      </div>
    </Form>
  );
}
