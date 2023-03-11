import React, { ReactElement, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout, Dropdown, Menu, Empty } from 'antd';
import {
  MenuOutlined,
  CaretDownOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import CookiesServices from 'services/cookies-services';
import { UserServices, CommentServices } from 'services/api';
import { decryptData } from 'utils/EncryptDecryptData';
import style from './style.module.scss';
import { CustomBadge } from 'styles/styledComponent';
import { StyledButton, StyledDivider, StyledItem, StyledMenu, StyledLink } from './Banner.style';
import moment from 'moment';
import { Link } from 'react-router-dom';

const { Header } = Layout;

type OnclickFunction = {
  toggleMenu: () => void;
};

export default function Banner(props: OnclickFunction): ReactElement {
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [notification, setNotification] = useState<any>([]);
  const userID = decryptData(CookiesServices.getCookies('userID'));
  const role = decryptData(CookiesServices.getCookies('role'));
  const history = useHistory();

  const logoutUser = (): void => {
    CookiesServices.clearCookies('token');
    CookiesServices.clearCookies('userID');
    CookiesServices.clearCookies('role');
    history.push('identity/login');
  };

  const menu = (
    <StyledMenu>
      <StyledItem>{fullName}</StyledItem>
      <StyledItem>
        <span>{email}</span>
      </StyledItem>
      <StyledDivider />
      <StyledItem>
        <button type="button">
          <StyledLink to="/identity/changepassword">
            <SettingOutlined /> Đổi Mật Khẩu
          </StyledLink>
        </button>
      </StyledItem>
      <StyledItem>
        <button type="button" onClick={logoutUser}>
          <LogoutOutlined /> Đăng Xuất
        </button>
      </StyledItem>
    </StyledMenu>
  );

  const convertTime = (x: number): string => {
    if (x < 10) return `0${x}`;
    return `${x}`;
  };

  const convertUnixToTime = (unix: number): string => {
    const checkinUnixToDate = new Date(unix * 1000);
    const checkin_date = checkinUnixToDate.getDate();
    const checkin_month = checkinUnixToDate.getMonth() + 1;
    const checkin_year = checkinUnixToDate.getFullYear();
    const checkin_hour = checkinUnixToDate.getHours() - 7;
    const checkin_minutes = convertTime(checkinUnixToDate.getMinutes());
    return `${checkin_date}/${checkin_month}/${checkin_year} - ${checkin_hour}:${checkin_minutes}`;
  };

  const convertDiff = (createdAt: number): any => {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt * 1000);
    const startTime = moment(createdAtTime);
    const endTime = moment(currentTime);
    const diff = endTime.diff(startTime);
    const diffDuration = moment.duration(diff);
    return diffDuration;
  };

  const convertHour = (hour: number): number => {
    if (hour === 0) return 24;
    else if (hour >= 7 && hour <= 23) return hour;
    return 24 + hour;
  };

  const displayDiff = (createdAt: number): any => {
    const diffDuration = convertDiff(createdAt);
    if (diffDuration.days() !== 0) {
      if (diffDuration.days() >= 7) {
        const checkinUnixToDate = new Date(createdAt * 1000);
        const checkin_date = checkinUnixToDate.getDate();
        const checkin_month = checkinUnixToDate.getMonth() + 1;
        const checkin_year = checkinUnixToDate.getFullYear();
        const checkin_hour = convertTime(convertHour(checkinUnixToDate.getHours()) - 7);
        const checkin_minutes = convertTime(checkinUnixToDate.getMinutes());
        // const checkin_seconds = convertTime(checkinUnixToDate.getSeconds());
        return `Vào lúc ${checkin_hour}:${checkin_minutes} - ${checkin_date}/${checkin_month}/${checkin_year}`;
      }
      return `${diffDuration.days()} ngày trước`;
    } else if (diffDuration.hours() !== 0) return `${diffDuration.hours()} giờ trước`;
    else if (diffDuration.minutes() !== 0) return `${diffDuration.minutes()} phút trước`;
    else return `${diffDuration.seconds()} giây trước`;
  };

  const convertAMPM = (hour: number): string => {
    if (hour >= 12) return 'PM';
    return 'AM';
  };

  const formatHour = (hour: number): number => {
    if (hour > 12) return hour - 12;
    return hour;
  };

  const convertUnixToString = (unix: any) => {
    const checkinUnixToDate = new Date(unix * 1000);
    const checkin_date = checkinUnixToDate.getDate();
    const checkin_month = checkinUnixToDate.getMonth() + 1;
    const checkin_year = checkinUnixToDate.getFullYear();
    const checkin_hour = convertHour(checkinUnixToDate.getHours()) - 7;
    const checkin_minutes = convertTime(checkinUnixToDate.getMinutes());
    const checkin_seconds = convertTime(checkinUnixToDate.getSeconds());
    const AM_PM = convertAMPM(checkin_hour);
    return `${checkin_date}/${checkin_month}/${checkin_year} ${formatHour(
      checkin_hour
    )}:${checkin_minutes}:${checkin_seconds} ${AM_PM}`;
  };

  const convertUnixToDate = (unix: any) => {
    const checkinUnixToDate = new Date(unix * 1000);
    const checkin_date = convertTime(checkinUnixToDate.getDate());
    const checkin_month = convertTime(checkinUnixToDate.getMonth() + 1);
    const checkin_year = convertTime(checkinUnixToDate.getFullYear());
    return `${checkin_date}/${checkin_month}/${checkin_year}`;
  };

  useEffect(() => {
    (async () => {
      const res = await UserServices.getProfile(userID);
      console.log(res);
      setEmail(res.data.Email);
      setFullName(res.data.LastName + ' ' + res.data.FirstName);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const noti = await CommentServices.getNotificationByUserID(userID);
        setNotification(noti);
      } catch (error) {
        console.log(error);
        setNotification(error);
      }
    })();
  }, []);

  const notiMenu = (
    <Menu className={style.notimenu}>
      {notification.length === 0 && (
        <div className={style.empty}>
          <Empty description={<span>Chưa có thông báo nào!</span>} />
        </div>
      )}
      {notification.map((x, id) => {
        return (
          <Menu.Item className={style.noti} key={id}>
            <Link
              to={`/attendance/id=${x.StaffID}&attendance=${
                x.Attendance
              }&from=${`${x.LastName}${x.FirstName}`}`}>
              <div className={style.notiBox}>
                <span>
                  <b>
                    {role === '0'
                      ? `${x.LastName}${x.FirstName} (HR)`
                      : `${x.LastName}${x.FirstName}`}
                  </b>{' '}
                  đã bình luận về điểm danh của {role === '0' ? 'bạn' : 'họ'}{' '}
                  {`(${convertUnixToString(x.Attendance)})`}
                </span>
                <h4>{displayDiff(x.createdAt)}</h4>
              </div>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  console.log(notification);

  return (
    <Header className={style.header}>
      <div>
        <img
          src="https://ev-sb.payoo.vn/assets/assets/images/payoo_white.png"
          alt=""
          className={style.logo}
        />
        <MenuOutlined className={style.menuIcon} onClick={props.toggleMenu} />
      </div>
      <div className={style.user}>
        <div>
          <Dropdown overlay={menu} trigger={['click']}>
            <StyledButton>
              {email} <CaretDownOutlined />
            </StyledButton>
          </Dropdown>
        </div>
        <div style={{ marginLeft: 15 }}>
          <CustomBadge count={notification.length} overflowCount={99} size="small" offset={[-4, 3]}>
            <Dropdown overlay={notiMenu} trigger={['click']}>
              <BellOutlined style={{ fontSize: 23 }} />
            </Dropdown>
          </CustomBadge>
        </div>
      </div>
    </Header>
  );
}
