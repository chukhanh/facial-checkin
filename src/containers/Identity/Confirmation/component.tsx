import { ReactElement } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import style from './confirm.module.scss';

import Form from 'components/Identity/Form';
import ValidateInput from 'components/Identity/ValidateInput';

export default function EmailConfirmation(): ReactElement {
  return (
    <div className={style.formBackground}>
      <div className={style.formReturn}>
        <Link to="./login" className={style.return}>
          <span className={style.icon}>
            <ArrowLeftOutlined />
          </span>{' '}
          Quay Lại
        </Link>
      </div>
      <div className={style.formBody}>
        <Form
          type="formTitle"
          title="Tạo lại mật khẩu"
          subtitle="Nhập email của bạn và chúng tôi sẽ gửi 1 link qua email để thay đổi mật khẩu"
        />
        <div className={style.formEmail}>
          <ValidateInput type="email" triggerBtn titleBtn="Xác Nhận" isConfirm />
        </div>
      </div>
    </div>
  );
}
