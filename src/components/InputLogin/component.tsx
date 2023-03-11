import { ReactElement } from 'react';
import { UserOutlined, KeyOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

import { StyledInputEmail, StyledInputPassword } from './InputLogin.style';

import style from './input_login.module.scss';

type TProps = {
  type: string;
  id: string;
  placeholder: string;
  bordered?: boolean;
};

const InputLogin = (props: TProps): ReactElement => {
  const { type, id, placeholder, bordered } = props;

  return (
    <div className={style.formLogin} id={id}>
      {type === 'text' ? (
        <>
          <UserOutlined className={`${style.outlined} ${style.marginAuto}`} />
          <StyledInputEmail
            className={`${style.input} ${style.formInput} ${style.marginAuto} ${style.heighEmail}`}
            type={type}
            id={id}
            placeholder={placeholder}
            bordered={bordered}
          />
        </>
      ) : (
        <>
          <KeyOutlined className={style.outlined} />
          <StyledInputPassword
            className={`${style.input} ${style.formInput} ${style.paddingPassword} ${style.marginAuto}`}
            id={id}
            type={type}
            placeholder={placeholder}
            iconRender={visible =>
              visible ? (
                <EyeOutlined className={style.eyeOutlined} />
              ) : (
                <EyeInvisibleOutlined className={style.eyeOutlined} />
              )
            }
          />
        </>
      )}
    </div>
  );
};

export default InputLogin;
