// import React from 'react'
import styled from "styled-components";
import { NavLink } from "react-router-dom";

const Wrapper = styled.section`
  /* background-color: ${({ theme }) => theme.colors.black}; */
  background: linear-gradient(to bottom, maroon, #000000);

  padding: 15em 0;
  color: ${({ theme }) => theme.colors.white};
  .section-hero-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .hero-heading {
    font-size: 4rem;
    color: #ebb032;
  }
  .hero-text {
    margin-top: 1rem;
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  .section-hero-image {
    max-width: 50%;
    opacity: 0.7;
    img {
      width: calc(50vw - 22px);
      border: 2px solid #fff;
      /* box-shadow: 10px 10px 5px #ebb032; */
      border-radius: 25px;
    }
  }
  .btn {
    /* max-width: 15rem; */
    color: #fff;
    border: 2px solid rgb(242, 218, 232);
    border-radius: 500px;
    padding: 0.5em 1em;
    display: inline-block;
    font-size: 14px;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: inset 0 0 0 0 #ebb032;
    -webkit-transition: ease-out 0.4s;
    -moz-transition: ease-out 0.4s;
    transition: ease-out 0.4s;
  }

  .slide_right:hover {
    box-shadow: inset 400px 0 0 0 #dfac53;
    color: black;
  }
`;

const Home = () => {




  return (
    <Wrapper>
      <div className="container grid grid-two-column">
        <div className="section-hero-image">
          <img src="/images/signl.jpeg" alt="Hero image" />
        </div>
        <div className="section-hero-data">
          <h3 className="hero-heading">
            A good education is a foundation for a better Future!
          </h3>
          <p className="hero-text">
            You can never comprehend sign language until you understand the
            reason behind it.
          </p>
          <NavLink to="/learn_first">
            <div className="btn slide_right">Get Started </div>
          </NavLink>
        </div>
      </div>
    </Wrapper>
  );
};

export default Home;
