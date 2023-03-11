/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ReactElement, useState, useCallback, ChangeEvent, useEffect } from 'react';
import { Form, message, Button, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { register } from 'services/identity';
import {
  LoadingOutlined,
  PlusOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';

import {
  CustomModal,
  CustomInput,
  CustomUpload,
  CustomCheckbox,
  CustomInputPassword,
  CustomInputEmail,
  CustomSelect,
  CustomDatePicker,
  StyledUploadImage,
  StyledImageAvatar,
} from 'styles/styledComponent';
import moment from 'moment';
import { ChangeDateToString } from 'utils/ChangeTimeToString';
import { ChangeStringToDate } from 'utils/ChangeStringToDate';
import { handleClickDatePicker } from 'utils/HandleClickDatePicker';
import { StaffServices, DepartmentServices } from 'services/api';
import style from './style.module.scss';
import { RegisterModel } from 'services/identity/types';

type PropType = {
  width: number;
  title: string;
  footer: ReactElement[];
  visible: boolean;
  closable: boolean;
  handleCancel: () => void;
};

interface InputType {
  FirstName: string;
  LastName: string;
  Shortname: string;
  StaffID: string;
  Birthday: string;
  DepartmentName: string;
}

interface InputAccount {
  Email: string;
  Password: string;
}

const { Option } = Select;
const MySwal = withReactContent(Swal);

const getBase64 = (img: any, callback: (value: any) => void): void => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

export default function AddOneStaffModal(props: PropType): ReactElement {
  const { width, title, footer, visible, closable, handleCancel } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [department, setDepartment] = useState<Department[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(null);
  const [inputValues, setInputValues] = useState<InputType>({
    FirstName: '',
    LastName: '',
    Shortname: '',
    StaffID: '',
    Birthday: '',
    DepartmentName: '',
  });
  const [inputAccount, setInputAccount] = useState<InputAccount>({
    Email: '',
    Password: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await DepartmentServices.getDepartmentAll();
        setDepartment(data.departmentinfo);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const beforeUpload = (file: { type: string; size: number }): boolean => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUploadChange = useCallback(
    (info: any): void => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      } else {
        setLoading(true);
        setTimeout(() => {
          getBase64(info.file.originFileObj, (imageUrl: string): void => {
            setLoading(false);
            setImageUrl(imageUrl);
          });
        }, 1000);
      }
    },
    [loading, imageUrl]
  );

  const afterCloseModal = useCallback(() => {
    setImageUrl(null);
    setCheckBox(false);
    setInputValues({
      FirstName: '',
      LastName: '',
      Shortname: '',
      StaffID: '',
      Birthday: '',
      DepartmentName: '',
    });
  }, [imageUrl, checkBox, inputValues]);

  const handleCheckboxChange = useCallback(
    (e: CheckboxChangeEvent): void => {
      setCheckBox(e.target.checked);
    },
    [checkBox]
  );

  const handleInputChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setInputValues({ ...inputValues, [name]: e.target.value });
    },
    [inputValues]
  );

  const handleSelectChange = useCallback(
    (value: string): void => {
      console.log(value);
      setInputValues({ ...inputValues, DepartmentName: value });
    },
    [inputValues]
  );

  const handleInputAccountChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setInputAccount({ ...inputAccount, [name]: e.target.value });
    },
    [inputAccount]
  );

  const handleDate = useCallback(
    (date, dateString) => {
      setInputValues({ ...inputValues, Birthday: dateString });
    },
    [inputValues]
  );

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <StyledUploadImage>Thêm ảnh đại diện</StyledUploadImage>
    </div>
  );

  const onFinish = useCallback((): void => {
    (async () => {
      try {
        let request: Staff = null;

        if (checkBox) {
          request = {
            FirstName: inputValues.FirstName,
            LastName: inputValues.LastName,
            Shortname: inputValues.Shortname,
            Birthday: inputValues.Birthday,
            DepartmentName: inputValues.DepartmentName,
            StaffID: parseInt(inputValues.StaffID, 10),
            Email: inputAccount.Email,
            Avatar: '',
          };
          const requestAccount: RegisterModel = {
            Email: inputAccount.Email,
            Password: inputAccount.Password,
            FirstName: inputValues.FirstName,
            LastName: inputValues.LastName,
            Flag: 0,
            Role: 1,
          };

          const [resRegister, resStaff] = await Promise.allSettled([
            register(requestAccount),
            StaffServices.addStaff(request),
          ]);

          if (resRegister && resStaff) {
            handleCancel();
            MySwal.fire({
              title: 'Thêm thành công',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } else {
          request = {
            FirstName: inputValues.FirstName,
            LastName: inputValues.LastName,
            Birthday: inputValues.Birthday,
            DepartmentName: inputValues.DepartmentName,
            StaffID: parseInt(inputValues.StaffID, 10),
            Avatar: '',
          };
          const data = await StaffServices.addStaff(request);
        }
      } catch (error) {
        console.log(error);
        if (error.status === 'success') {
          handleCancel();
          MySwal.fire({
            title: 'Thêm thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          handleCancel();
          MySwal.fire({
            title: 'Nhân viên đã tồn tại',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })();
  }, [inputValues, inputAccount]);

  const loginCreate = (
    <div className={style.info}>
      <h3 style={{ width: '13rem' }}>Tạo tài khoản</h3>
      <div className={style.inputWrapper}>
        <CustomInputEmail
          placeholder="Email"
          bordered={false}
          value={inputAccount.Email}
          onChange={handleInputAccountChange('Email')}
        />
        <CustomInputPassword
          placeholder="Password"
          bordered={false}
          value={inputAccount.Password}
          onChange={handleInputAccountChange('Password')}
          iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
        />
      </div>
    </div>
  );

  const departmentOption = (
    <>
      {department.map(x => (
        <Option key={x.ID} value={x.Name}>
          {x.Name}
        </Option>
      ))}
    </>
  );

  return (
    <CustomModal
      width={width}
      centered
      bodyStyle={{ padding: '2rem 5rem', height: checkBox ? '74rem' : '54rem' }}
      title={title}
      footer={footer}
      visible={visible}
      closable={closable}
      onCancel={handleCancel}
      afterClose={afterCloseModal}>
      <Form onFinish={onFinish}>
        <div className={style.contentWrapper}>
          <div className={style.avatar}>
            <CustomUpload
              name="avatar"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
              onChange={handleUploadChange}>
              {imageUrl ? <StyledImageAvatar src={imageUrl} alt="avatar" /> : uploadButton}
            </CustomUpload>
          </div>
          <div className={style.info}>
            <h3>Thông tin cơ bản của nhân viên</h3>
            <div className={style.inputWrapper}>
              <CustomInput
                placeholder="Mã nhân viên"
                value={inputValues.StaffID}
                onChange={handleInputChange('StaffID')}
                bordered={false}
              />
              <CustomSelect
                placeholder="Bộ phận làm việc"
                bordered={false}
                listHeight={170}
                onChange={handleSelectChange}>
                {department ? departmentOption : null}
              </CustomSelect>
              <CustomInput
                placeholder="Họ nhân viên"
                value={inputValues.LastName}
                bordered={false}
                onChange={handleInputChange('LastName')}
              />
              <CustomInput
                placeholder="Tên nhân viên"
                value={inputValues.FirstName}
                bordered={false}
                onChange={handleInputChange('FirstName')}
              />
              <CustomInput
                noMargin={true}
                placeholder="Shortname"
                value={inputValues.Shortname}
                bordered={false}
                onChange={handleInputChange('ShortName')}
              />
              {inputValues.Birthday !== '' ? (
                <CustomDatePicker
                  placeholder="Ngày sinh"
                  bordered={false}
                  suffixIcon={false}
                  allowClear={false}
                  onChange={handleDate}
                  format="DD/MM"
                  onClick={handleClickDatePicker}
                  value={moment(inputValues.Birthday, 'DD/MM')}
                />
              ) : (
                <CustomDatePicker
                  placeholder="Ngày sinh"
                  bordered={false}
                  suffixIcon={false}
                  allowClear={false}
                  onChange={handleDate}
                  format="DD/MM"
                  onClick={handleClickDatePicker}
                />
              )}
            </div>
          </div>
          <CustomCheckbox checked={checkBox} onChange={handleCheckboxChange}>
            Tạo tài khoản đăng nhập
          </CustomCheckbox>
          {checkBox ? loginCreate : null}
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
    </CustomModal>
  );
}
