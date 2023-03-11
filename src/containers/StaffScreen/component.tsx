/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect, ReactElement, useCallback, ChangeEvent, useReducer } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Layout, Breadcrumb, Button, Select, Form, DatePicker } from 'antd';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { SelectValue } from 'antd/es/select';
import StaffList from 'components/StaffList';
import AddOneStaffModal from 'components/AddOneStaffModal';
import AddMultipleStaffModal from 'components/AddMultipleStaffModal';
import DeleteModal from 'components/DeleteModal';
import moment from 'moment';
import { handleClickDatePicker } from 'utils/HandleClickDatePicker';
import { StaffServices, DepartmentServices } from 'services/api';
import { StyledSearch, StyledSelect, CustomDatePicker } from 'styles/styledComponent';
import { reducer, initState } from 'store/reducers/SelectedRow';
import { decryptData } from 'utils/EncryptDecryptData';
import CookiesServices from 'services/cookies-services';
import style from './style.module.scss';

const { Content } = Layout;
const { Option } = Select;
const MySwal = withReactContent(Swal);

const StaffScreen = (): ReactElement => {
  const history = useHistory();
  const name = new URLSearchParams(useLocation().search).get('department');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [param, setParam] = useState<TypeParamsStaff>({
    id: '',
    name: '',
    birthday: '',
    department: name ? name : '',
    page_num: 1,
  });
  const [department, setDepartment] = useState<Department[]>([]);
  const [visibleOneStaff, setVisibleOneStaff] = useState<boolean>(false);
  const [visibleMulStaff, setVisibleMulStaff] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initState);
  const role = decryptData(CookiesServices.getCookies('role'));

  useEffect(() => {
    const token = CookiesServices.getCookies('token');

    if (token) history.push('/staff');
    else history.push('/identify/login');
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await StaffServices.getStaff(param);
        setStaff(data.staffinfo);
        setTotal(data.total_data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [name]);

  useEffect(() => {
    (async () => {
      try {
        const data = await DepartmentServices.getDepartmentAll();
        setDepartment(data.departmentinfo);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onSelectChange = useCallback(
    (selectedRowKeys: number[], _): void => {
      dispatch({ type: 'SELECT', payload: selectedRowKeys });
    },
    [state.rowKey]
  );

  const onSelect = useCallback(
    (record, selected, _): void => {
      if (!selected) {
        dispatch({ type: 'SELECT', payload: record.key });
      } else dispatch({ type: 'SELECT', payload: 0 });
    },
    [state.rowKey]
  );

  const onSelectAll = useCallback(
    (selected: boolean, _, changeRows): void => {
      const record = [];
      changeRows.filter(x => x !== undefined).map(x => record.push(x.key));
      if (!selected) {
        dispatch({ type: 'SELECT_ALL', payload: record });
      }
    },
    [state.rowKey]
  );

  const rowSelection = {
    selectedRowKeys: state.rowKey,
    onChange: onSelectChange,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
    columnWidth: 80,
  };

  const configPagination = {
    pageSize: 20,
    current: current,
    style: { marginTop: '2rem' },
    onChange: (page: number) => {
      (async () => {
        try {
          param.page_num = page;
          setParam(param);
          const data = await StaffServices.getStaff(param);
          setStaff(data.staffinfo);
          setTotal(data.total_data);
          setCurrent(param.page_num);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    total: total,
    showSizeChanger: false,
  };

  const handleCancelOneStaff = useCallback((): void => {
    setVisibleOneStaff(false);
  }, [visibleOneStaff]);

  const handleCancelMulStaff = useCallback((): void => {
    setVisibleMulStaff(false);
  }, [visibleMulStaff]);

  const showModalOneStaff = useCallback((): void => {
    setVisibleOneStaff(true);
  }, [visibleOneStaff]);

  const showModalMulStaff = useCallback((): void => {
    setVisibleMulStaff(true);
  }, [visibleMulStaff]);

  const showDelete = useCallback((): void => {
    setVisibleDelete(true);
  }, [visibleDelete]);

  const hiddenDelete = useCallback((): void => {
    setVisibleDelete(false);
  }, [visibleDelete]);

  const handleDelete = (): void => {
    (async () => {
      try {
        const param = { StaffID: state.rowKey };
        const data = await StaffServices.deleteStaff(param);
        if (data.status === 'success') {
          hiddenDelete();
          MySwal.fire({
            title: 'Xoá thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          history.push('/');
        }
      } catch (error) {
        let pos = 0;
        const result = [];
        for (let i = 1; i < error.length; i++) {
          if (error[i] === '{') pos = i;
          if (error[i] === '}') {
            const obj = JSON.parse(error.slice(pos, i + 1));
            result.push(obj);
          }
        }
        const isOK = result.every(err => err.status === 'success');
        if (isOK) {
          hiddenDelete();
          MySwal.fire({
            title: 'Xoá thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
          history.push('/');
        }
      }
    })();
  };

  const handleCancelDelete = useCallback((): void => {
    setVisibleDelete(false);
  }, [visibleDelete]);

  const handleChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setParam({ ...param, [name]: e.target.value });
    },
    [param]
  );
  const handleSelect = useCallback(
    (name: string, value: SelectValue): void => {
      setParam({ ...param, [name]: value });
    },
    [param]
  );

  const handleReset = useCallback((): void => {
    (async () => {
      try {
        param.id = '';
        param.name = '';
        param.birthday = '';
        param.department = '';
        param.page_num = 1;
        setParam(param);
        const data = await StaffServices.getStaff(param);
        setStaff(data.staffinfo);
        setTotal(data.total_data);
        setCurrent(1);
        dispatch({ type: 'SELECT', payload: 'reset' });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [param]);

  const handleSearch = useCallback((): void => {
    (async () => {
      try {
        param.page_num = 1;
        setParam(param);
        const data = await StaffServices.getStaff(param);
        setStaff(data.staffinfo);
        setTotal(data.total_data);
        setCurrent(1);
        dispatch({ type: 'SELECT', payload: 'reset' });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [param]);

  const handleExport = (): void => {
    (async () => {
      try {
        const data = await StaffServices.exportStaff(param);
      } catch (error) {
        const downloadUrl = window.URL.createObjectURL(new Blob([error]));
        // setDownloadURL(downloadUrl);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'Staff.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    })();
  };

  const handleDate = useCallback(
    (date, dateString) => {
      setParam({ ...param, birthday: dateString });
    },
    [param]
  );

  const departmentOption = (
    <>
      {department.map(x => (
        <Option key={x.ID} value={x.Name}>
          {x.Name}
        </Option>
      ))}
    </>
  );

  return (
    <>
      <div className={style.breadcrumb}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>Nhân viên</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý nhân viên</Breadcrumb.Item>
        </Breadcrumb>
        {role === '1' && (
          <div>
            <Button className={style.buttonStyle} size="middle" onClick={showModalMulStaff}>
              Thêm nhiều nhân viên
            </Button>
            <AddMultipleStaffModal
              width={950}
              title="Thêm nhiều nhân viên"
              footer={null}
              closable={false}
              visible={visibleMulStaff}
              handleCancel={handleCancelMulStaff}
            />
            <Button
              className={`${style.buttonAdd1Staff} ${style.buttonStyle}`}
              size="middle"
              onClick={showModalOneStaff}>
              Thêm một nhân viên
            </Button>
            <AddOneStaffModal
              width={950}
              title="Thêm một nhân viên"
              footer={null}
              closable={false}
              visible={visibleOneStaff}
              handleCancel={handleCancelOneStaff}
            />
          </div>
        )}
      </div>
      <Content>
        <Form>
          <div className={style.searchWrapper}>
            <div className={style.search}>
              <StyledSearch
                placeholder="Tìm kiếm theo tên nhân viên"
                value={param.name}
                onChange={handleChange('name')}
              />
              <StyledSearch
                placeholder="Tìm kiếm theo mã nhân viên"
                value={param.id}
                onChange={handleChange('id')}
              />
              {/* <StyledSearch
                placeholder="Tìm kiếm theo ngày sinh"
                value={param.birthday}
                onChange={handleChange('birthday')}
              /> */}
              <DatePicker
                placeholder="Tìm kiếm theo ngày sinh (dd/mm)"
                style={{ width: '30rem' }}
                allowClear={false}
                onChange={handleDate}
                format="DD/MM"
                onClick={handleClickDatePicker}
                value={param.birthday ? moment(param.birthday, 'DD/MM') : null}
              />
              <StyledSelect
                placeholder="Tìm kiếm theo bộ phận"
                value={param.department !== '' ? param.department : null}
                onChange={(value: SelectValue) => handleSelect('department', value)}
                listHeight={170}>
                {department ? departmentOption : null}
              </StyledSelect>
            </div>
            <div className={style.searchButton}>
              <Button
                className={`${style.deleteButton} ${style.buttonCancelStyle}`}
                size="middle"
                onClick={handleReset}>
                Khôi phục
              </Button>
              <Button
                className={`${style.deleteButton} ${style.buttonStyle}`}
                size="middle"
                onClick={handleSearch}
                htmlType="submit">
                Tìm kiếm
              </Button>
            </div>
          </div>
        </Form>
        <div className={style.contentWrapper}>
          <div
            className={style.delete}
            style={state.rowKey.length === 0 ? { justifyContent: 'flex-end' } : null}>
            {state.rowKey.length > 0 ? (
              <>
                <span>
                  Bạn đã chọn: <span>{state.rowKey.length}</span>
                </span>
                <Button
                  className={`${style.deleteButton} ${style.buttonStyle}`}
                  size="middle"
                  onClick={showDelete}>
                  Xóa
                </Button>
                <DeleteModal
                  width={400}
                  title="Chú ý"
                  footer={null}
                  closable={false}
                  visible={visibleDelete}
                  handleCancel={handleCancelDelete}
                  handleOk={handleDelete}
                />
              </>
            ) : null}
          </div>
          <div className={style.listWrapper}>
            <StaffList
              staff={staff}
              total={total}
              pagination={configPagination}
              rowSelection={rowSelection}
            />
          </div>
          <div className={style.export}>
            <Button className={style.buttonStyle} size="middle" onClick={handleExport}>
              Xuất ra file Excel
            </Button>
          </div>
        </div>
      </Content>
    </>
  );
};

export default StaffScreen;
