/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useState, useCallback, ChangeEvent, useEffect } from 'react';
import { Breadcrumb, Layout, Form, Button, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  CustomInput,
  CustomCheckbox,
  CustomInputPassword,
  CustomInputEmail,
  CustomSelect,
  CustomDatePicker,
} from 'styles/styledComponent';
import { useHistory, useLocation } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { handleClickDatePicker } from 'utils/HandleClickDatePicker';
import { StaffServices, DepartmentServices, UserServices } from 'services/api';
import moment from 'moment';
import style from './style.module.scss';
import { register, RegisterModel } from 'services/identity';
import { decryptData } from 'utils/EncryptDecryptData';
import CookiesServices from 'services/cookies-services';

const { Content } = Layout;
const { Option } = Select;
const MySwal = withReactContent(Swal);

interface InputType {
  FirstName: string;
  LastName: string;
  StaffID: string;
  Birthday: string;
  DepartmentName: string;
  Shortname: string;
}

interface InputAccount {
  Email: string;
  Password: string;
}

type TRoleFilder = '' | '0' | '1';

const EditScreen = (): ReactElement => {
  const name = new URLSearchParams(useLocation().search).get('staffID');
  const history = useHistory();
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [inputValues, setInputValues] = useState<InputType>({
    FirstName: '',
    LastName: '',
    StaffID: '',
    Birthday: '',
    DepartmentName: '',
    Shortname: '',
  });
  const [staff, setStaff] = useState<Staff>(null);
  const [department, setDepartment] = useState<Department[]>([]);
  const [inputAccount, setInputAccount] = useState<InputAccount>({
    Email: '',
    Password: '',
  });
  const [roleUser, setRoleUser] = useState<TRoleFilder>('');
  const [isCurrentUser, SetIsCurrentUser] = useState<boolean>(false);
  const role = decryptData(CookiesServices.getCookies('role'));
  const currentUserID = decryptData(CookiesServices.getCookies('userID'));

  const roleFilter: DataFilter[] = [
    { key: '0', value: 'Nhân viên' },
    { key: '1', value: 'Nhân sự' },
  ];

  useEffect(() => {
    (async () => {
      const res = await StaffServices.getStaffDetail(name);
      const userProfile = await UserServices.getProfile(`${res.UserID}`);
      if (userProfile.data.Email) setRoleUser(`${userProfile.data.Roles}` as TRoleFilder);
      if (res.UserID === +currentUserID) SetIsCurrentUser(true);

      setStaff(res);
      setInputValues({
        ...inputValues,
        FirstName: res.FirstName,
        LastName: res.LastName,
        Birthday: res.Birthday,
        DepartmentName: res.DepartmentName,
        StaffID: res.StaffID.toString(),
        Shortname: res.Shortname,
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await DepartmentServices.getDepartmentAll();
        setDepartment(data.departmentinfo);
      } catch (error) {
        console.log(error);
      }
    })();
    if (staff) setInputAccount({ ...inputAccount, Email: staff.Email });
  }, [staff]);

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
    (_, dateString) => {
      setInputValues({ ...inputValues, Birthday: dateString });
    },
    [inputValues]
  );

  const onFinish = useCallback((): void => {
    (async () => {
      try {
        let request: Staff = null;
        if (checkBox) {
          request = {
            UserID: staff.UserID,
            FirstName: inputValues.FirstName ? inputValues.FirstName : staff.FirstName,
            LastName: inputValues.LastName ? inputValues.LastName : staff.LastName,
            Birthday: inputValues.Birthday ? inputValues.Birthday : staff.Birthday,
            DepartmentName: inputValues.DepartmentName
              ? inputValues.DepartmentName
              : staff.Department,
            StaffID: parseInt(inputValues.StaffID, 10)
              ? parseInt(inputValues.StaffID, 10)
              : staff.StaffID,
            Email: inputAccount.Email,
            Shortname: inputValues.Shortname ? inputValues.Shortname : staff.Shortname,
            Role: +roleUser,
          };

          const requestAccount: RegisterModel = {
            UserID: staff.UserID,
            Email: inputAccount.Email,
            Password: inputAccount.Password,
            FirstName: inputValues.FirstName,
            LastName: inputValues.LastName,
            Flag: 1,
            Role: +roleUser,
          };

          const [resRegister, resStaff] = await Promise.allSettled([
            register(requestAccount),
            StaffServices.updateStaff(request),
          ]);

          if (resRegister && resStaff) {
            MySwal.fire({
              title: 'Thêm thành công',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        } else {
          request = {
            UserID: staff.UserID,
            FirstName: inputValues.FirstName ? inputValues.FirstName : staff.FirstName,
            LastName: inputValues.LastName ? inputValues.LastName : staff.LastName,
            Birthday: inputValues.Birthday ? inputValues.Birthday : staff.Birthday,
            DepartmentName: inputValues.DepartmentName
              ? inputValues.DepartmentName
              : staff.Department,
            StaffID: parseInt(inputValues.StaffID, 10)
              ? parseInt(inputValues.StaffID, 10)
              : staff.StaffID,
            Shortname: inputValues.Shortname ? inputValues.Shortname : staff.Shortname,
            Role: +roleUser,
          };
          const data = await StaffServices.updateStaff(request);
        }
      } catch (error) {
        console.log(error);
        if (error) {
          MySwal.fire({
            title: 'Cập nhật thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })();
  }, [inputValues, inputAccount, roleUser]);

  const handleSelectFilterRoleChange = useCallback(
    (value: TRoleFilder): void => {
      setRoleUser(value);
    },
    [roleUser]
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

  const roleFilterOptions = (
    <>
      {roleFilter.map((data: DataFilter) => (
        <Option key={data.key} value={data.key}>
          {data.value}
        </Option>
      ))}
    </>
  );

  const loginCreate = (
    <div className={style.info}>
      <h3 style={{ width: '11rem' }}>Tài khoản</h3>
      <div className={style.inputWrapper}>
        <CustomInputEmail
          placeholder="Email"
          bordered={false}
          style={{ width: '100%' }}
          value={inputAccount.Email}
          onChange={handleInputAccountChange('Email')}
        />
        <CustomInputPassword
          placeholder="Password"
          bordered={false}
          iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
          style={{ width: '100%' }}
          value={inputAccount.Password}
          onChange={handleInputAccountChange('Password')}
        />
      </div>
    </div>
  );

  const handleUploadAvt = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.onchange = function (e: any) {
      console.log(e.target.files[0]);
      (async () => {
        try {
          const fileData = new FormData();
          fileData.append('files', e.target.files[0]);
          const data = await StaffServices.uploadAvt(fileData, staff.StaffID);
          console.log(data);
          if (data) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      })();
    };
    fileSelector.click();
  };

  return (
    <>
      <div className={style.breadcrumb}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>Nhân viên</Breadcrumb.Item>
          <Breadcrumb.Item>Chỉnh sửa nhân viên</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {staff ? (
        <Content>
          <Form colon={false} onFinish={onFinish}>
            <div className={style.container}>
              <div className={style.contentWrapper}>
                <div className={style.leftContent}>
                  <div className={style.avatar} aria-hidden="true" onClick={handleUploadAvt}>
                    <img src={`/avatar/${staff.StaffID}.jpeg`} alt="" width={300} height={300} />
                  </div>
                  {role === '1' && (
                    <>
                      <div className={style.checkbox}>
                        <CustomCheckbox checked={checkBox} onChange={handleCheckboxChange}>
                          Tài khoản đăng nhập
                        </CustomCheckbox>
                      </div>
                      {checkBox ? loginCreate : null}
                    </>
                  )}
                </div>
                <div className={style.rightContent}>
                  <div className={style.info}>
                    <h3>Thông tin cơ bản của nhân viên</h3>
                    <div className={style.inputWrapper}>
                      <div>
                        <Form.Item
                          style={{ display: 'inline-block', width: '50%', paddingTop: '.2rem' }}
                          label={<span className={style.label}>Mã nhân viên</span>}>
                          <CustomInput
                            disabled
                            prefix="VU"
                            defaultValue={`${staff.StaffID}`}
                            bordered={false}
                            style={{ width: '100%' }}
                            onChange={handleInputChange('StaffID')}
                          />
                        </Form.Item>
                        <Form.Item
                          style={{ display: 'inline-block', marginLeft: '2.4rem', width: '46%' }}
                          label={<span className={style.label}>Vai trò</span>}>
                          <CustomSelect
                            disabled={role !== '1'}
                            placeholder="Vai trò"
                            value={roleUser !== '' ? roleUser : 'Chưa có vai trò'}
                            bordered={false}
                            style={{ width: '100%' }}
                            listHeight={170}
                            onChange={(value: TRoleFilder) => handleSelectFilterRoleChange(value)}>
                            {roleFilter ? roleFilterOptions : null}
                          </CustomSelect>
                        </Form.Item>
                      </div>
                      <Form.Item
                        style={{ display: 'block' }}
                        label={<span className={style.label}>Bộ phận làm việc</span>}>
                        <CustomSelect
                          disabled={role !== '1' && !isCurrentUser}
                          defaultValue={staff.Department}
                          bordered={false}
                          style={{ padding: '0 0', width: '100%' }}
                          listHeight={170}
                          onChange={handleSelectChange}>
                          {department ? departmentOption : null}
                        </CustomSelect>
                      </Form.Item>
                      <Form.Item
                        style={{ display: 'block' }}
                        label={<span className={style.label}>Họ nhân viên</span>}>
                        <CustomInput
                          disabled={role !== '1' && !isCurrentUser}
                          defaultValue={staff.LastName}
                          bordered={false}
                          style={{
                            padding: '0 11px',
                            width: '100%',
                            textTransform: 'capitalize',
                          }}
                          onChange={handleInputChange('LastName')}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ display: 'block' }}
                        label={<span className={style.label}>Tên nhân viên</span>}>
                        <CustomInput
                          disabled={role !== '1' && !isCurrentUser}
                          defaultValue={staff.FirstName}
                          bordered={false}
                          style={{
                            padding: '0rem 11px',
                            width: '100%',
                            textTransform: 'capitalize',
                          }}
                          onChange={handleInputChange('FirstName')}
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ display: 'block', marginBottom: '0rem' }}
                        label={<span className={style.label}>Ngày sinh nhân viên</span>}>
                        {staff.Birthday !== '' ? (
                          <CustomDatePicker
                            disabled={role !== '1' && !isCurrentUser}
                            defaultValue={moment(staff.Birthday, 'DD/MM')}
                            value={moment(inputValues.Birthday, 'DD/MM')}
                            format="DD/MM"
                            style={{ padding: '0rem 0rem', width: '100%' }}
                            bordered={false}
                            suffixIcon={false}
                            allowClear={false}
                            onChange={handleDate}
                            onClick={handleClickDatePicker}
                          />
                        ) : (
                          <CustomDatePicker
                            disabled={role !== '1' && !isCurrentUser}
                            format="DD/MM"
                            style={{ padding: '0rem 0rem', width: '100%' }}
                            bordered={false}
                            suffixIcon={false}
                            allowClear={false}
                            onChange={handleDate}
                            onClick={handleClickDatePicker}
                          />
                        )}
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
              <div className={style.footer}>
                <Button
                  key="cancel"
                  size="middle"
                  className={style.buttonCancelStyle}
                  onClick={() => history.push('/staff')}>
                  Quay lại
                </Button>
                <Button key="add" size="middle" className={style.buttonStyle} htmlType="submit">
                  Lưu
                </Button>
              </div>
            </div>
          </Form>
        </Content>
      ) : null}
    </>
  );
};

export default EditScreen;
