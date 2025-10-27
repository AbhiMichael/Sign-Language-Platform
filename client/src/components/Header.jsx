import React from "react";
import { styled } from "styled-components";
import { NavLink } from "react-router-dom";
import logo from "/images/R.png";
import Navbar from "./Navbar";

const Header = ({ notToken }) => {
  return (
    <>
      <MainHeader>
        <NavLink to="/">
          <img src={logo} alt="logo" />
          <span id="sign">
            <b>SignL</b>
          </span>
        </NavLink>
        <Navbar notToken={notToken} />
      </MainHeader>
    </>
  );
};

const MainHeader = styled.header`
  /*position: fixed;
        width: 100%;
        z-index: 1;
    */
  padding: 2em 1em;
  background-color: ${({ theme }) => theme.colors.black};
  display: flex;
  justify-content: space-between;

  img {
    width: 5em;
    object-fit: scale-down;
  }
  span {
    font-size: 20px;
    color: white;
    float: right;
    padding-left: 10px;
    padding-top: 10px;
  }
`;

export default Header;
