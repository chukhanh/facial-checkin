/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { ReactElement } from 'react';
import { Button } from 'antd';
import { CustomModal } from 'styles/styledComponent';
import style from './style.module.scss';

type PropType = {
  width: number;
  title: string;
  footer: ReactElement[];
  visible: boolean;
  closable: boolean;
  handleCancel: () => void;
  handleOk: () => void;
};

export default function AddOneStaffModal(props: PropType): ReactElement {
  const { width, title, footer, visible, closable, handleCancel, handleOk } = props;

  return (
    <CustomModal
      width={width}
      centered
      bodyStyle={{ padding: '2rem 5rem', textAlign: 'center' }}
      title={title}
      footer={footer}
      visible={visible}
      closable={closable}
      onCancel={handleCancel}>
      <h3>Thông tin bị xóa sẽ không thể phục hồi. Vui lòng xác nhận xóa?</h3>
      <div className={style.footer}>
        <Button
          key="cancel"
          size="middle"
          className={style.buttonCancelStyle}
          onClick={handleCancel}>
          Hủy
        </Button>
        <Button key="add" size="middle" className={style.buttonStyle} onClick={handleOk}>
          Xác nhận
        </Button>
      </div>
    </CustomModal>
  );
}
