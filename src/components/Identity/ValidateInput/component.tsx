/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useState, useCallback } from 'react';
import { UserOutlined, KeyOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { UserServices } from 'services/api';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import style from './styles.module.scss';

interface TProps {
  type: string;
  triggerBtn?: boolean;
  titleBtn: string;
  isConfirm: boolean;
}

const MySwal = withReactContent(Swal);

const ValidateInput = (props: TProps): ReactElement => {
  const { type, triggerBtn, titleBtn, isConfirm } = props;
  const history = useHistory();

  //Switch Validation Schema Between Email and Password
  const ValidationShape =
    type === 'email'
      ? Yup.object().shape({
          email: Yup.string().email('Email Sai Định Dạng').required('Bắt Buộc'),
        })
      : Yup.object().shape({
          code: Yup.string()
            .required('Bắt Buộc')
            .min(6, 'Chính xác 6 kí tự')
            .max(6, 'Chính xác 6 kí tự'),
          password: Yup.string().min(8, 'Bắt buộc trên 8 kí tự').required('Bắt Buộc'),
        });

  //Toggle Visible Password
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const togglePasswordReveal = useCallback((): void => {
    setTogglePassword(!togglePassword);
  }, [togglePassword]);

  const { values, handleSubmit, getFieldProps, touched, errors, isValid, dirty } = useFormik({
    initialValues:
      type === 'email'
        ? { email: '' }
        : {
            code: '',
            password: '',
          },
    async onSubmit(values) {
      try {
        if (isConfirm) {
          const res = await UserServices.sendEmailForgotPassword(values.email);
          if (res.code === 1000 && res.message === 'Successfully!') {
            history.push('/identity/resetpassword', { email: values.email });
          }
        } else {
          const email = history.location.state.email;
          const dataOfUser: INewPasswordForForgotPassword = {
            email,
            password: values.password,
            code: values.code,
          };

          const res = await UserServices.confirmForgotPassword(dataOfUser);
          if (res.code === 1000 && res.message === 'Successfully!') {
            MySwal.fire({
              title: 'Cập nhật thành công',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
            history.push('/identity/login');
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    validationSchema: ValidationShape,
  });

  return (
    <form className={style.formWrapper} onSubmit={handleSubmit} noValidate>
      {type === 'email' ? (
        <div className={`${style.formEmail} ${style.padding}`}>
          <p className={style.subtitle}>Email</p>
          <div className={`${style.form} ${style.formBorder}`}>
            <UserOutlined className={style.outlined}></UserOutlined>
            <input
              className={`${style.formInput} ${style.marginAuto} ${style.removeDecoration}`}
              type="email"
              id="email"
              placeholder="Nhập Email"
              {...getFieldProps('email')}
            />
          </div>
          <p className={`${style.mismatched} ${style.removeSpace}`}>
            {touched['email'] && errors['email']}
          </p>
        </div>
      ) : (
        <>
          <div className={`${style.formEmail} ${style.margin}`}>
            <p className={style.subtitle}>Mã xác nhận</p>
            <div className={`${style.form} ${style.formBorder}`}>
              <UserOutlined className={style.outlined}></UserOutlined>
              <input
                className={`${style.formInput} ${style.marginAuto} ${style.removeDecoration}`}
                type="text"
                id="code"
                placeholder="Nhập Mã Xác Nhận"
                {...getFieldProps('code')}
              />
            </div>
            <p className={`${style.mismatched} ${style.removeSpace}`}>
              {touched['code'] && errors['code']}
            </p>
          </div>
          <div className={`${style.formPassword}`}>
            <p className={style.subtitle}>Mật Khẩu</p>
            <div
              className={`${style.form} ${style.formBorder} ${
                errors.password && touched.password && style.mismatchedBorder
              }`}>
              <KeyOutlined className={style.outlined} />
              <input
                className={`${style.formInput} ${style.marginAuto} ${style.removeDecoration}`}
                id="password"
                type={togglePassword ? 'text' : 'password'}
                placeholder="Nhập Mật Khẩu"
                {...getFieldProps('password')}
              />
              <button
                type="button"
                className={`${style.passwordBtn} ${style.removeDecoration}`}
                onClick={togglePasswordReveal}>
                {togglePassword ? <EyeInvisibleFilled /> : <EyeFilled />}
              </button>
            </div>
            <p className={`${style.mismatched} ${style.removeSpace}`}>
              {touched['password'] && errors['password']}
            </p>
          </div>
        </>
      )}
      {triggerBtn === true ? (
        <div className={`${style.formButton}`}>
          <button className={style.button} type="submit" disabled={!isValid || !dirty}>
            {titleBtn}
          </button>
        </div>
      ) : null}
    </form>
  );
};

export default ValidateInput;
