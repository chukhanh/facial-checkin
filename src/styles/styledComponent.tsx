import styled, { css } from 'styled-components';
import 'styles/variable.scss';
import {
  Modal,
  Upload,
  Input,
  Checkbox,
  Divider,
  Select,
  DatePicker,
  Comment,
  Form,
  Badge,
} from 'antd';

const font = {
  family: 'Open Sans, sans-serif',
};

interface InputProps {
  noMargin?: boolean;
}

export const CustomModal = styled(Modal)`
  .ant-modal-header {
    background: #27aae1;
    min-height: 1rem;
    .ant-card-head-title {
      padding: 0;
    }
  }
  .ant-modal-title {
    color: #fff;
    font-size: 24px;
    font-family: ${font.family};
  }
`;

export const CustomInput = styled(Input)<InputProps>`
  width: 38rem;
  border-bottom: 2px solid rgba(196, 196, 196, 0.5) !important;
  ${props =>
    !props.noMargin &&
    css`
      margin-right: 3rem;
      &:nth-of-type(3) {
        margin-right: 0rem;
      }
      margin-bottom: 2rem;
    `}
  ${props =>
    props.noMargin &&
    css`
      margin-bottom: 2.6rem;
      margin-left: 1rem;
    `}
  &:focus,
  &:hover {
    border-bottom: 2px solid #27aae1 !important;
  }
  .ant-input-prefix {
    margin-right: 0rem;
  }
`;

export const CustomInputEmail = styled(Input)`
  width: 79rem;
  border-bottom: 2px solid rgba(196, 196, 196, 0.5) !important;
  margin-bottom: 3rem;
  &:focus,
  &:hover {
    border-bottom: 2px solid #27aae1 !important;
  }
`;

export const CustomInputPassword = styled(Input.Password)`
  width: 79rem;
  border-bottom: 2px solid rgba(196, 196, 196, 0.5) !important;
  margin-bottom: 2rem;
  &:focus,
  &:hover {
    border-bottom: 2px solid #27aae1 !important;
  }
`;

export const CustomUpload = styled(Upload)`
  .ant-upload {
    width: 20rem;
    height: 20rem;
  }
`;

export const CustomCheckbox = styled(Checkbox)`
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: #27aae1;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner {
    border-color: #27aae1;
  }
`;

export const CustomDivider = styled(Divider)``;

export const StyledUploadImage = styled.div`
  margin-top: 8px;
`;

export const StyledImageAvatar = styled.img`
  width: 100%;
  max-height: 20rem;
`;

export const StyledSearch = styled(Input)`
  width: 30rem;
`;

export const StyledSelect = styled(Select)`
  width: 30rem;
`;

export const CustomSelect = styled(Select)`
  width: 38rem;
  border-bottom: 2px solid rgba(196, 196, 196, 0.5) !important;
  margin-bottom: 2rem;
  &:focus,
  &:hover {
    border-bottom: 2px solid #27aae1 !important;
  }
`;

export const CustomDatePicker = styled(DatePicker)`
  input {
    width: 38rem;
    border-bottom: 2px solid rgba(196, 196, 196, 0.5) !important;
    margin-bottom: 1.8rem;
    padding-left: 1.1rem;
    &:focus,
    &:hover,
    &:active {
      border-bottom: 2px solid #27aae1 !important;
    }
  }
`;

export const CustomCommentEditor = styled(Comment)`
  .ant-comment-inner {
    padding: 0;
  }
`;

export const CustomComment = styled(Comment)`
  .ant-comment-inner {
    padding: 10px 0;
  }
`;

export const NestComment = styled(Comment)`
  .ant-comment-nested {
    margin-left: 25px;
  }
  .ant-comment-inner {
    padding: 10px 0;
  }
`;

export const CustomForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 0px;
  }
`;

export const CustomBadge = styled(Badge)`
  .ant-badge-multiple-words {
    padding: 0 2px;
  }
  .ant-scroll-number-only-unit {
    font-size: 11px;
  }
`;
