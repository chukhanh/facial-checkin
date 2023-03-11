import { ReactElement, useEffect } from 'react';
import CookiesServices from 'services/cookies-services';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import InputLogin from 'components/Identity/InputLogin';
import Form from 'components/Identity/Form';

import style from './login.module.scss';

export default function Login(): ReactElement {
  const history = useHistory();

  useEffect(() => {
    const token = CookiesServices.getCookies('token');
    if (token) history.push('/staff');
    else history.push('/identity/login');
  }, []);
  return (
    <div className={style.formBackground}>
      <div className={style.formBody}>
        <Form type="formTitle" title="Quản Lý Chấm Công" subtitle="Đăng Nhập Bằng Email" />
        <InputLogin />
        <div className={style.formForgotten}>
          <Link to="./confirmation" className={style.forgottenPasswordLink}>
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
