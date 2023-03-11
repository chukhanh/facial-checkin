/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, useCallback, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { CustomModal } from 'styles/styledComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { StaffServices, DataServices } from 'services/api';
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
        const data = await DataServices.exportDataFormat('StaffFormat');
      } catch (error) {
        console.log(error);
        const downloadUrl = window.URL.createObjectURL(new Blob([error]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'StaffFormat.xlsx');
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
        const data = await StaffServices.importStaff(fileData);
        console.log(data);
      } catch (error) {
        console.log(error);
        if (error.message === 'success') {
          handleCancel();
          MySwal.fire({
            title: 'Thêm thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          handleCancel();
          MySwal.fire({
            title: 'Nhân viên đã tồn tại',
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
            <span>Tải tệp mẫu ở đây.</span>
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
            <span>Một tệp tải lên không được quá 10MB, chỉ cho phép loại tệp .xls, .xlsx</span>
          </div>
          <div className={style.infoDetail}>
            <img src="InfoIcon.svg" alt="" style={{ width: '1.5rem', marginRight: '1rem' }} />
            <span>Các cột không nên thay đổi khi tải tệp lên</span>
          </div>
          <div className={style.infoDetail}>
            <img src="InfoIcon.svg" alt="" style={{ width: '1.5rem', marginRight: '1rem' }} />
            <span>Ngày sinh của nhân viên phải theo định dạng DD/MM/YYYY. VD: 02/07/1998</span>
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
