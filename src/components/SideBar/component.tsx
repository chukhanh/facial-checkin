/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement } from 'react';
import { Layout, Menu } from 'antd';
import { TeamOutlined, FormOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { decryptData } from 'utils/EncryptDecryptData';
import CookiesServices from 'services/cookies-services';

import style from './sidebar.module.scss';

const { Sider } = Layout;

type PropType = {
  collapsed: boolean;
};

export default function SideBar(props: PropType): ReactElement {
  const location = useLocation();
  console.log(location);
  const role = decryptData(CookiesServices.getCookies('role'));

  return (
    <Sider theme="light" width={180} trigger={null} collapsible collapsed={props.collapsed}>
      {role === '1' ? (
        <Menu
          mode="inline"
          className={style.menu}
          defaultSelectedKeys={['1']}
          selectedKeys={[
            location.pathname.includes('staff')
              ? '1'
              : location.pathname.includes('attendance')
              ? '3'
              : '2',
          ]}>
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to="/staff">Nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<HomeOutlined />}>
            <Link to="/department">Bộ phận làm việc</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FormOutlined />}>
            <Link to="/attendance">Quản lí điểm danh</Link>
          </Menu.Item>
        </Menu>
      ) : (
        <Menu
          mode="inline"
          className={style.menu}
          defaultSelectedKeys={['1']}
          selectedKeys={[location.pathname.includes('staff') ? '1' : '2']}>
          <Menu.Item key="1" icon={<TeamOutlined />}>
            <Link to="/staff">Nhân viên</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FormOutlined />}>
            <Link to="/attendance">Quản lí điểm danh</Link>
          </Menu.Item>
        </Menu>
      )}
    </Sider>
  );
}
