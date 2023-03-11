import styled from 'styled-components';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

export const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;

  &:hover {
    text-decoration: none;
    color: black;
  }
`;

export const StyledMenu = styled(Menu)`
  width: 25rem;
  height: 15rem;
  border: 0.1rem solid black;
`;

export const StyledItem = styled(Menu.Item)`
  color: #34495e;
  font-family: $font-family-base;
  margin-left: 1.6rem;
  font-style: normal;
  font-weight: normal;
  font-size: 1.3rem;
  padding: 0 1.5rem;
  cursor: context-menu;

  &:hover {
    background-color: white;
  }

  & > span {
    font-size: 1.2rem;
    opacity: 0.5rem;
  }

  & > button {
    border: none;
    background: none;
    font-style: normal;
    font-weight: bold;
    font-size: 1.4rem;
    padding: 0.3rem;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &:active {
      color: red;
    }
  }
`;

export const StyledButton = styled.button`
  border: none;
  background: none;
  color: #fff;
  font-family: $font-family-base;
  font-style: normal;
  font-weight: normal;
  font-size: 1.125em;

  &:focus {
    outline: none;
  }
`;

export const StyledDivider = styled(Menu.Divider)`
  margin: 1.6rem 2rem;
  margin-top: 0.5rem;
  background-color: black;
  padding: 0.1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;
