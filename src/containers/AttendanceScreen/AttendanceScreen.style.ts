import styled from 'styled-components';
import { Input, Select, DatePicker } from 'antd';

const { RangePicker } = DatePicker;

export const StyledDatePicker = styled(RangePicker)`
  width: 40rem;
  & > .ant-picker-input > input {
    text-align: center;
  }
`;

export const StyledSearch = styled(Input)`
  width: 25rem;
`;

export const StyledSelect = styled(Select)`
  width: 25rem;
`;

export const StyledWrapperNotFound = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
