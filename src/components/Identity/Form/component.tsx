import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import style from './form.module.scss';

type TProps = {
  type: string;
  title?: string;
  subtitle?: string;
  linkTo?: string;
  placeholderLink?: string;
  onClick?(): void;
};

const Form = (props: TProps): ReactElement => {
  const { title, subtitle, type, linkTo, placeholderLink } = props;

  return (
    <div>
      {type === 'formTitle' ? (
        <>
          <div className={`${style.formLogo}`}>
            <img src="https://sandboxv3.payoo.vn/theme/img/payoo.svg" alt="" />
          </div>
          <p className={`${style.formTitle}`}>{title}</p>
          <p className={`${style.formNote}`}>{subtitle}</p>
        </>
      ) : (
        <div className={`${style.formButton}`}>
          <Link to={linkTo} className={`${style.button}`} type="submit">
            {placeholderLink}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Form;
