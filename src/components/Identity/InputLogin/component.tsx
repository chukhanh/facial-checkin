/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactElement, useState, useReducer, useCallback } from 'react';
import { UserOutlined, KeyOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { login } from 'services/identity';
import CookiesServices from 'services/cookies-services';
import { initAuthStateNew, reducer } from 'store/reducers/auth';
import { SIGN_IN_SUCCESS, SIGN_IN_FAILURE } from 'store/actions/auth';
import { encryptData } from 'utils/EncryptDecryptData';

import style from './input_login.module.scss';

const MySwal = withReactContent(Swal);

const InputLogin = (): ReactElement => {
  //Toggle Visible Password
  const [togglePassword, setTogglePassword] = useState(false);
  const [state, dispatch] = useReducer(reducer, initAuthStateNew);

  const togglePasswordReveal = useCallback((): void => {
    setTogglePassword(!togglePassword);
  }, [togglePassword]);

  const history = useHistory();

  const { values, handleSubmit, getFieldProps, touched, errors, isValid, dirty } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit(values) {
      (async () => {
        try {
          const loginData = await login(values);
          if (loginData.code === 1000 && loginData.message === 'Successfully login') {
            CookiesServices.setCookies('userID', encryptData(`${loginData.data.userID}`));
            CookiesServices.setCookies('role', encryptData(`${loginData.data.role}`));
            CookiesServices.setCookies('token', loginData.data.token);
            dispatch({ type: SIGN_IN_SUCCESS, payload: loginData.data.userID });
            MySwal.fire({
              title: 'Đăng nhập thành công',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
            history.push('/staff');
          }
        } catch (error) {
          if (error.code === 1002) {
            dispatch({ type: SIGN_IN_FAILURE, payload: null });
            MySwal.fire({
              title: 'Tài khoản đăng nhập hoặc mật khẩu sai',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
            });
          } else if (error.code === 1015) {
            dispatch({ type: SIGN_IN_FAILURE, payload: null });
            MySwal.fire({
              title: 'Tài khoản đăng nhập không tồn tại',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
      })();
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Email sai định dạng').required('Bắt buộc'),
      password: Yup.string().min(8, 'Bắt buộc trên 8 kí tự').required('Bắt buộc'),
    }),
  });

  return (
    <form className={style.formWrapper} onSubmit={handleSubmit} noValidate>
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
      <div className={`${style.formPassword} ${style.padding}`}>
        <p className={style.subtitle}>Mật Khẩu</p>
        <div
          className={`${style.form} ${style.formBorder} ${
            errors.email && touched.email && style.mismatchedBorder
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
      <div className={`${style.formButton}`}>
        <button className={style.button} type="submit" disabled={!isValid || !dirty}>
          Đăng Nhập
        </button>
      </div>
    </form>
  );
};

export default InputLogin;
