import styled from 'styled-components';
import { Input } from 'antd';

export const StyledInputEmail = styled(Input)`
  width: 100%;
  padding: 1.2rem 2rem;
  font-size: 2.5rem;
  border: none;
  box-sizing: border-box;

  &:focus,
  &:hover {
    outline: none;
  }
`;

export const StyledInputPassword = styled(Input.Password)`
  & > input {
    width: 100%;
    font-size: 2.5rem;
    padding: 1.2rem 2rem;
    border: none;
    box-sizing: border-box;
  }

  &:focus,
  &:hover {
    outline: none;
  }
`;
