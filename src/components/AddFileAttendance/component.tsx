/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useCallback, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { CustomModal } from 'styles/styledComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataServices, AttendanceServices } from 'services/api';
import style from './style.module.scss';

type PropType = {
  width: number;
  title: string;
  footer: ReactElement[];
  visible: boolean;
  closable: boolean;
  handleCancel: () => void;
};

const { Dragger } = Upload;
const MySwal = withReactContent(Swal);

export default function AddMultipleStaffModal(props: PropType): ReactElement {
  const { width, title, footer, visible, closable, handleCancel } = props;
  const [fileList, setFileList] = useState<any>(null);
  const dummyRequest = ({ file, onSuccess }) => {
    onSuccess('ok');
  };
  const prop = {
    multiple: true,
    beforeUpload: file => {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        message.error(`${file.name} is not a excel file`);
      }
      return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    },
    onChange(info) {
      setFileList(info.fileList);
    },
    customRequest: dummyRequest,
  };

  const handleDownload = (): void => {
    (async () => {
      try {
        const data = await DataServices.exportDataFormat('AttendanceFormat');
      } catch (error) {
        console.log(error);
        const downloadUrl = window.URL.createObjectURL(new Blob([error]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'AttendanceFormat.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    })();
  };

  const handleImport = useCallback((): void => {
    (async () => {
      try {
        const fileData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
          console.log(fileList[i]);
          fileData.append('files', fileList[i].originFileObj);
        }
        console.log(fileData);
        if (fileData) {
          handleCancel();
          MySwal.fire({
            title: 'Thêm điểm danh thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
        const data = await AttendanceServices.importAttendance(fileData);
        console.log(data);
      } catch (error) {
        console.log(error);
        if (error.message === 'success') {
          handleCancel();
          MySwal.fire({
            title: 'Thêm điểm danh thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          handleCancel();
          MySwal.fire({
            title: 'Có lỗi khi thêm điểm danh',
            icon: 'error',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })();
  }, [fileList]);

  return (
    <CustomModal
      width={width}
      centered
      bodyStyle={{ padding: '2rem 5rem' }}
      title={title}
      footer={footer}
      visible={visible}
      closable={closable}
      onCancel={handleCancel}>
      <div className={style.contentWrapper}>
        <div className={style.upload}>
          <h3>Tải tệp lên từ máy tính</h3>
          <Dragger {...prop}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhập hoặc kéo tệp vào khu vực này để tải lên</p>
          </Dragger>
        </div>
        <div className={style.divider} />
        <div className={style.info}>
          <div className={style.infoDetail}>
            <img src="InfoIcon.svg" alt="" style={{ width: '1.5rem', marginRight: '1rem' }} />
            <span>Tải File mẫu về.</span>
            <Button
              size="small"
              style={{ width: '0rem', padding: '0', marginLeft: '0.5rem' }}
              type="link"
              block
              onClick={handleDownload}>
              Tải về
            </Button>
          </div>
          <div className={style.infoDetail}>
            <img src="InfoIcon.svg" alt="" style={{ width: '1.5rem', marginRight: '1rem' }} />
            <span>
              Thông tin chấm công bằng vân tay tải lên sẽ được tổng hợp với chấm công bằng gương
              mặt.
            </span>
          </div>
        </div>
        <div className={style.divider} />
        <div className={style.footer}>
          <Button
            key="cancel"
            size="middle"
            className={style.buttonCancelStyle}
            onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button key="add" size="middle" className={style.buttonStyle} onClick={handleImport}>
            Tải tệp
          </Button>
        </div>
      </div>
    </CustomModal>
  );
}
