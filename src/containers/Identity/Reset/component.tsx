import { ReactElement, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

import Form from 'components/Identity/Form';
import ValidateInput from 'components/Identity/ValidateInput';
import style from './reset.module.scss';

export default function ResetPassword(): ReactElement {
  const history = useHistory();

  useEffect(() => {
    if (!history.location.state) history.push('/identity/login');
  }, []);

  return (
    <div className={style.formBackground}>
      <div className={style.formReturn}>
        <Link to="/identity/confirmation" className={style.return}>
          <span className={style.icon}>
            <ArrowLeftOutlined />
          </span>{' '}
          Quay Lại
        </Link>
      </div>
      <div className={style.formBody}>
        <Form title="Thay Đổi Mật Khẩu" type="formTitle" subtitle="Thay Đổi Mật Khẩu Mới Của Bạn" />
        <div className={`${style.formInput} ${style.marginAuto}`} id="passwordInput">
          <ValidateInput type="password" triggerBtn titleBtn="Cập Nhật" isConfirm={false} />
        </div>
      </div>
    </div>
  );
}
