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



const Practice = () => {
    const { letterClass } = useGlobalContext()
    console.log(letterClass);

    return (
        <Wrapper>
            <div className="title">
                Practice
            </div>


            <div className="box">

                {letterClass.map((singleClass) => {
                    return (<NavLink key={singleClass} to={`/model/${singleClass}`}><div className='btn'>{singleClass}</div></NavLink>)
                })}
                <NavLink to={`/Word`}><div className='btn'>Words</div></NavLink>
            </div>




        </Wrapper >
    )
}

export default Practice