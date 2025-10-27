import React from 'react'
import { styled } from 'styled-components'
import { NavLink } from 'react-router-dom'
import { useGlobalContext } from '../../context'

const Wrapper = styled.section`
    padding: 9em 2em;

    background-color: ${({ theme }) => theme.colors.black};
    color: white;    
.title{
    
    text-align: center;
    font-size: 4rem;
    padding: 2em;

}
a{
    text-decoration: none;
}

.box{
    display: grid;
    grid-template-columns: 1fr 1fr;	
    justify-items: center;
    gap: 4em;
    .btn{
        max-width: 10em;
        padding: 2em 4em;
        border: 2px solid #ffff;
        border-radius: 10px;
        text-align: center;
        font-size: 2.2rem;
        font-weight: 600;
        color: #060606;
        background-color: #ebb032;
        text-transform: uppercase;
    
        &:hover{
            background-color: #000000;
            color: #ebb032;
            border-color:#ebb032;
        }
}
    
}

`


const Exam = () => {
    // const { questionClass } = useGlobalContext()
    // console.log(questionClass);


  return (
    <Wrapper>
    <div className="title">
        Exam
    </div>


    <div className="box">
        <NavLink to={"/question/a/1"} ><div className='btn'>Q 1</div></NavLink>
        <NavLink to={"/question/o/2"}><div className='btn'>Q 2</div></NavLink>
        <NavLink to={"/question/l/3"}><div className='btn'>Q 3</div></NavLink>
        <NavLink to={"/question/c/4"}><div className='btn'>Q 4</div></NavLink>
    </div>
</Wrapper >
  )
}

export default Exam
