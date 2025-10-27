import React from 'react'
import Card from '../components/Card'
import { useGlobalContext } from '../../context'
import { styled } from 'styled-components'

const Wrapper = styled.section`
padding: 12rem 1rem;
background: ${({ theme }) => theme.colors.black};
.title{
    color: white;
    text-align: center;
    font-size: 4rem;
    margin-bottom:3em;
}
#course{
    color: #000000;
    width: 250px;
  border: 2px solid rgb(201, 99, 99);
  border-radius: 500px;
  padding: 0.5em 1em;
  display: inline-block;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: inset 0 0 0 0 #ffae00;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
}
#course1{
    color: #000000;
    width: 500px;
  border: 2px solid rgb(255, 0, 0);
  border-radius: 500px;
  padding: 0.5em 1em;
  display: inline-block;
  font-size: 14px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: inset 0 0 0 0 #ff9500;
  -webkit-transition: ease-out 0.4s;
  -moz-transition: ease-out 0.4s;
  transition: ease-out 0.4s;
}
`

const Learn = () => {
    const { letters } = useGlobalContext()
    // console.log(letters);

    return (
        <Wrapper>
            <div className="title">
                Learn Alphabets
            </div>
            <div className="container grid grid-three-column">
                {letters.map((letter) => {
                    return <Card key={letter} letter={letter} />
                })}
            </div>
        </Wrapper>
    )
}

export default Learn