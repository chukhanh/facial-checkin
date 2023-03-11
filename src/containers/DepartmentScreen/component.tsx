/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useState, useEffect, ReactElement, useCallback, ChangeEvent, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Breadcrumb, Button, Select } from 'antd';
import DepartmentList from 'components/DepartmentList';
import AddDepartmentModal from 'components/AddDepartmentModal';
import DeleteModal from 'components/DeleteModal';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DepartmentServices } from 'services/api';
import { StyledSearch } from 'styles/styledComponent';
import { departmentReducer, initStateDepartment } from 'store/reducers/DepartmentRow';
import { reducer, initState } from 'store/reducers/Department';
import style from './style.module.scss';

import { useSpring, animated } from 'react-spring';

const { Content } = Layout;
const MySwal = withReactContent(Swal);

const DepartmentScreen = (): ReactElement => {
  const [department, setDepartment] = useState<Department[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [param, setParam] = useState<TypeParamsDepartment>({
    id: '',
    name: '',
    page_num: 1,
  });
  const [current, setCurrent] = useState<number>(1);
  const [visibleAddDepartment, setVisibleAddDepartment] = useState<boolean>(false);
  const [visibleDelete, setVisibleDelete] = useState<boolean>(false);
  const [state, dispatch] = useReducer(departmentReducer, initStateDepartment);
  const [departmentState, deparmentDispatch] = useReducer(reducer, initState);

  const configPagination = {
    pageSize: 20,
    current: current,
    style: { marginTop: '2rem' },
    onChange: (page: number) => {
      (async () => {
        try {
          param.page_num = page;
          setParam(param);
          const data = await DepartmentServices.getDepartment(param);
          setDepartment(data.departmentinfo);
          deparmentDispatch({ type: 'GET_DEPARTMENT', payload: data.departmentinfo });
          setTotal(data.total_date);
          setCurrent(param.page_num);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    total: total,
    showSizeChanger: false,
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await DepartmentServices.getDepartment(param);
        setDepartment(data.departmentinfo);
        setTotal(data.total_date);
        deparmentDispatch({ type: 'GET_DEPARTMENT', payload: data.departmentinfo });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const onSelectChange = useCallback(
    (selectedRowKeys: number[], _): void => {
      dispatch({ type: 'SELECT', payload: selectedRowKeys });
    },
    [state.departmentKey]
  );

  const onSelect = useCallback(
    (record, selected, _): void => {
      if (!selected) {
        dispatch({ type: 'SELECT', payload: record.key });
      } else dispatch({ type: 'SELECT', payload: 0 });
    },
    [state.departmentKey]
  );

  const onSelectAll = useCallback(
    (selected: boolean, _, changeRows): void => {
      const record = [];
      changeRows.filter(x => x !== undefined).map(x => record.push(x.key));
      if (!selected) {
        dispatch({ type: 'SELECT_ALL', payload: record });
      }
    },
    [state.departmentKey]
  );

  const rowSelection = {
    selectedRowKeys: state.departmentKey,
    onChange: onSelectChange,
    onSelect: onSelect,
    onSelectAll: onSelectAll,
    columnWidth: 80,
  };

  const showModalAddDepartment = useCallback((): void => {
    setVisibleAddDepartment(true);
  }, [visibleAddDepartment]);

  const handleCancelDepartment = useCallback((): void => {
    setVisibleAddDepartment(false);
  }, [visibleAddDepartment]);

  const handleChange = useCallback(
    (name: string) => (e: ChangeEvent<HTMLInputElement>): void => {
      setParam({ ...param, [name]: e.target.value });
      (async () => {
        try {
          param.page_num = 1;
          param.name = e.target.value;
          setParam(param);
          const data = await DepartmentServices.getDepartment(param);
          setDepartment(data.departmentinfo);
          deparmentDispatch({ type: 'GET_DEPARTMENT', payload: data.departmentinfo });
          setTotal(data.total_date);
          setCurrent(1);
          dispatch({ type: 'SELECT', payload: 'reset' });
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [param]
  );

  const showDelete = useCallback((): void => {
    setVisibleDelete(true);
  }, [visibleDelete]);

  const hiddenDelete = useCallback((): void => {
    setVisibleDelete(false);
  }, [visibleDelete]);

  const handleDelete = (): void => {
    (async () => {
      try {
        const param = { DepartmentID: state.departmentKey };
        const data = await DepartmentServices.deleteDepartment(param);
        if (data.status === 'success') {
          hiddenDelete();
          dispatch({ type: 'SELECT', payload: 'reset' });
          deparmentDispatch({ type: 'DELETE_DEAPARTMENT', payload: state.departmentKey });
          MySwal.fire({
            title: 'Xoá thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (error) {
        console.log(error);
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
          dispatch({ type: 'SELECT', payload: 'reset' });
          deparmentDispatch({ type: 'DELETE_DEAPARTMENT', payload: state.departmentKey });
          MySwal.fire({
            title: 'Xoá thành công',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    })();
  };

  const handleCancelDelete = useCallback((): void => {
    setVisibleDelete(false);
  }, [visibleDelete]);

  const handleReset = useCallback((): void => {
    (async () => {
      try {
        param.id = '';
        param.name = '';
        param.page_num = 1;
        setParam(param);
        const data = await DepartmentServices.getDepartment(param);
        setDepartment(data.departmentinfo);
        deparmentDispatch({ type: 'GET_DEPARTMENT', payload: data.departmentinfo });
        setTotal(data.total_date);
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
        const data = await DepartmentServices.getDepartment(param);
        setDepartment(data.departmentinfo);
        deparmentDispatch({ type: 'GET_DEPARTMENT', payload: data.departmentinfo });
        setTotal(data.total_date);
        setCurrent(1);
        dispatch({ type: 'SELECT', payload: 'reset' });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [param]);

  const props = useSpring({
    width: visibleAddDepartment ? '50rem' : '100%',
    delay: 1,
    config: { duration: 250, mass: 1, tension: 420, friction: 50 },
  });

  const addProp = useSpring({
    width: visibleAddDepartment ? '50rem' : '0%',
    delay: 1,
    config: { duration: 250, mass: 1, tension: 420, friction: 50 },
  });

  const propBack = useSpring({
    width: visibleAddDepartment ? '50rem' : '100%',
    delay: 1,
    config: { duration: 250, mass: 1, tension: 420, friction: 50 },
  });

  return (
    <>
      <div className={style.breadcrumb}>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>Bộ phận làm việc</Breadcrumb.Item>
          <Breadcrumb.Item>Quản lý bộ phận</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Button className={style.buttonStyle} size="middle" onClick={showModalAddDepartment}>
            Thêm một bộ phận
          </Button>
        </div>
      </div>
      <Content>
        <div className={style.header}>
          <animated.div
            className={style.searchWrapper}
            style={visibleAddDepartment ? props : propBack}>
            <div className={style.search}>
              <StyledSearch
                placeholder="Tìm kiếm theo tên bộ phận"
                style={{
                  width: '100%',
                }}
                value={param.name}
                onChange={handleChange('name')}
              />
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
                onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </animated.div>
          {visibleAddDepartment ? (
            <animated.div
              style={visibleAddDepartment ? addProp : propBack}
              className={style.addWrapper}>
              <div className={style.add}>
                <AddDepartmentModal
                  department={departmentState.department}
                  departmentDispatch={deparmentDispatch}
                  handleCancel={handleCancelDepartment}
                />
              </div>
            </animated.div>
          ) : null}
        </div>
        <div className={style.contentWrapper}>
          <div
            className={style.delete}
            style={state.departmentKey.length === 0 ? { justifyContent: 'flex-end' } : null}>
            {state.departmentKey.length > 0 ? (
              <>
                <span>Bạn đã chọn: {state.departmentKey.length}</span>
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
            <DepartmentList
              department={departmentState.department}
              departmentDispatch={deparmentDispatch}
              total={total}
              pagination={configPagination}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </Content>
    </>
  );
};

export default DepartmentScreen;
