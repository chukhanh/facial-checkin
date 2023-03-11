import { ReactElement, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { KeyOutlined, EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import { useFormik } from 'formik';
import { UserServices } from 'services/api';
import CookiesServices from 'services/cookies-services';
import { decryptData } from 'utils/EncryptDecryptData';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Form from 'components/Identity/Form';
import style from './style.module.scss';

const MySwal = withReactContent(Swal);

const ChangePassword = ({ history }): ReactElement => {
  const [toggleCurrentPassword, setToggleCurrentPassword] = useState(false);
  const [toggleNewPassword, setToggleNewPassword] = useState(false);

  const togglePasswordReveal = useCallback(
    (typePassword: string) => (): void => {
      if (typePassword === 'current') {
        setToggleCurrentPassword(!toggleCurrentPassword);
      } else setToggleNewPassword(!toggleNewPassword);
    },
    [toggleCurrentPassword, toggleNewPassword]
  );

  const handleBackToPreviousPage = (): void => {
    history.goBack();
  };

  const { handleSubmit, getFieldProps, touched, errors, isValid, dirty } = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    onSubmit(values) {
      (async () => {
        try {
          const UserID = +decryptData(CookiesServices.getCookies('userID'));
          const dataOfUser: IChangePassword = {
            UserID,
            Password: values.currentPassword,
            NewPassword: values.newPassword,
          };
          const res = await UserServices.changePassword(dataOfUser);
          if (res.code === 1000 && res.message === 'Successfully update password') {
            MySwal.fire({
              title: 'Cập nhật thành công',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
            });
            history.push('/staff');
          }
        } catch (error) {
          console.log(error);
          MySwal.fire({
            title: 'Cập nhật không thành công',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })();
    },
    validationSchema: Yup.object().shape({
      currentPassword: Yup.string().min(5, 'Bắt buộc trên 5 kí tự').required('Bắt buộc'),
      newPassword: Yup.string()
        .min(5, 'Bắt buộc trên 5 kí tự')
        .required('Bắt buộc')
        .notOneOf([Yup.ref('currentPassword')], 'Giống password cũ'),
    }),
  });
  return (
    <div className={style.formBackground}>
      <button className={style.formReturn} onClick={handleBackToPreviousPage}>
        <span className={style.icon}>
          <ArrowLeftOutlined />
        </span>{' '}
        Quay Lại
      </button>
      <div className={style.formBody}>
        <Form title="Thay Đổi Mật Khẩu" type="formTitle" subtitle="Thay Đổi Mật Khẩu Mới Của Bạn" />
        <form className={style.formWrapper} noValidate onSubmit={handleSubmit}>
          <div className={`${style.formPassword} ${style.padding}`}>
            <p className={style.subtitle}>Mật Khẩu Cũ</p>
            <div
              className={`${style.form} ${style.formBorder} ${
                errors.currentPassword && touched.currentPassword && style.mismatchedBorder
              }`}>
              <KeyOutlined className={style.outlined} />
              <input
                className={`${style.formInput} ${style.marginAuto} ${style.removeDecoration}`}
                id="password"
                type={toggleCurrentPassword ? 'text' : 'password'}
                placeholder="Nhập Mật Khẩu Cũ"
                {...getFieldProps('currentPassword')}
              />
              <button
                type="button"
                className={`${style.passwordBtn} ${style.removeDecoration}`}
                onClick={togglePasswordReveal('current')}>
                {toggleCurrentPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
              </button>
            </div>
            <p className={`${style.mismatched} ${style.removeSpace}`}>
              {touched['currentPassword'] && errors['currentPassword']}
            </p>
          </div>
          <div className={`${style.formPassword} ${style.padding}`}>
            <p className={style.subtitle}>Mật Khẩu Mới</p>
            <div
              className={`${style.form} ${style.formBorder} ${
                errors.newPassword && touched.newPassword && style.mismatchedBorder
              }`}>
              <KeyOutlined className={style.outlined} />
              <input
                className={`${style.formInput} ${style.marginAuto} ${style.removeDecoration}`}
                id="password"
                type={toggleNewPassword ? 'text' : 'password'}
                placeholder="Nhập Mật Khẩu Mới"
                {...getFieldProps('newPassword')}
              />
              <button
                type="button"
                className={`${style.passwordBtn} ${style.removeDecoration}`}
                onClick={togglePasswordReveal('new')}>
                {toggleNewPassword ? <EyeInvisibleFilled /> : <EyeFilled />}
              </button>
            </div>
            <p className={`${style.mismatched} ${style.removeSpace}`}>
              {touched['newPassword'] && errors['newPassword']}
            </p>
          </div>
          <div className={`${style.formButton}`}>
            <button className={style.button} type="submit" disabled={!isValid || !dirty}>
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withRouter(ChangePassword);
