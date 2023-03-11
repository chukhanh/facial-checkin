/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement } from 'react';
import { Form, Button, Input, Empty } from 'antd';
import style from './style.module.scss';
import {
  CustomComment,
  CustomCommentEditor,
  CustomForm,
  NestComment,
} from 'styles/styledComponent';
import { decryptData } from 'utils/EncryptDecryptData';
import CookiesServices from 'services/cookies-services';
import { CommentServices } from 'services/api';
import moment from 'moment';
import { SendOutlined } from '@ant-design/icons';

interface propType {
  clickClose: () => void;
  clickDone: () => void;
  listComment: any;
  attendance: string;
  staffID: number;
  commentDispatch: any;
}
const CommentModal = ({
  clickClose,
  clickDone,
  listComment,
  attendance,
  staffID,
  commentDispatch,
}: propType): ReactElement => {
  const parentComment = listComment[0];

  const onFinish = values => {
    (async () => {
      console.log(staffID, attendance, values);
    })();
  };

  const onChange = (e: any): any => {
    (async () => {
      try {
        const data = await CommentServices.addComment({
          Sender: Number(decryptData(CookiesServices.getCookies('userID'))),
          StaffID: staffID,
          Attendance: attendance,
          Content: e.target.value,
        });
        commentDispatch({ type: 'ADD_COMMENT', payload: data });
      } catch (error) {
        console.log(error);
        commentDispatch({ type: 'ADD_COMMENT', payload: error });
      }
    })();
  };

  const Editor = () => (
    <CustomForm colon={false} onFinish={onFinish}>
      <Form.Item>
        <Input suffix={<SendOutlined />} onPressEnter={onChange} />
      </Form.Item>
    </CustomForm>
  );

  const convertDiff = (createdAt: number): any => {
    const currentTime = new Date();
    const createdAtTime = new Date(createdAt * 1000);
    const startTime = moment(createdAtTime);
    const endTime = moment(currentTime);
    const diff = endTime.diff(startTime);
    const diffDuration = moment.duration(diff);
    return diffDuration;
  };

  const convertTime = (x: number): string => {
    if (x < 10) return `0${x}`;
    return `${x}`;
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
        return `Vào lúc ${checkin_hour}:${checkin_minutes} - ${checkin_date}/${checkin_month}/${checkin_year}`;
      }
      return `${diffDuration.days()} ngày trước`;
    } else if (diffDuration.hours() !== 0) return `${diffDuration.hours()} giờ trước`;
    else if (diffDuration.minutes() !== 0) return `${diffDuration.minutes()} phút trước`;
    else return `${diffDuration.seconds()} giây trước`;
  };

  return (
    <div className={style.bodyWrapper}>
      <CustomCommentEditor author={<span>Tôi</span>} content={<Editor />} />
      {listComment.length === 0 ? (
        <div className={style.commentList}>
          <Empty description={<span>Chưa có bình luận nào!</span>} />
        </div>
      ) : (
        <div className={style.commentWrap}>
          <NestComment
            avatar={null}
            datetime={displayDiff(parentComment.createdAt)}
            author={
              parentComment.SenderID ===
              Number(decryptData(CookiesServices.getCookies('userID'))) ? (
                <span className={style.author}>Tôi</span>
              ) : (
                <span className={style.author}>
                  {parentComment.Roles === 1
                    ? `${parentComment.SenderLastName} ${parentComment.SenderFirstName} (HR)`
                    : `${parentComment.SenderLastName} ${parentComment.SenderFirstName}`}
                </span>
              )
            }
            content={parentComment.Content}>
            {listComment.map((x, id) => {
              if (id > 0) {
                return (
                  <CustomComment
                    key={x.ID}
                    avatar={null}
                    datetime={displayDiff(x.createdAt)}
                    author={
                      x.SenderID === Number(decryptData(CookiesServices.getCookies('userID'))) ? (
                        <span className={style.author}>Tôi</span>
                      ) : (
                        <span className={style.author}>
                          {x.Roles === 1
                            ? `${x.SenderLastName} ${x.SenderFirstName} (HR)`
                            : `${x.SenderLastName} ${x.SenderFirstName}`}
                        </span>
                      )
                    }
                    content={x.Content}
                  />
                );
              }
            })}
          </NestComment>
        </div>
      )}
      <div className={style.buttonWrapper}>
        <Button size="middle" className={style.close} onClick={clickClose}>
          Đóng
        </Button>
        <Button size="middle" className={style.done} onClick={clickDone}>
          Hoàn thành
        </Button>
      </div>
    </div>
  );
};

export default CommentModal;
