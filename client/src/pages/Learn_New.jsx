import React, { useEffect } from 'react'
import Card from '../components/Card'
import { useGlobalContext } from '../../context'
import { styled } from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'


const Wrapper = styled.section`

padding: 12rem 1rem;
background: linear-gradient(olive,black);
display: flex;
align-items: center;
justify-content: center;
min-height: 100vh;
.learning{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
#course,#course1{
    margin: 30px;
    max-width: 100em;
    border: 2px solid #ffff;
    border-radius: 10px;
    text-align: center;
    color: white;
    font-size: 2.5em;
    text-transform: uppercase;
    letter-spacing: 2px;
    background-color: #262626;
    text-transform: uppercase;
    box-shadow: 0 0 5px #ffffff,
    0 0 15px #ffffff;
    cursor: pointer;

    &:hover{
        background-color: #ff562224;
        color: #ffffff ;
        border-color: #E64A19;
    }
}

#course{
    padding: 50px 88px;
}
#course1{
    padding: 50px 67px;
}
/*
#course,#course1{
    position: relative;
    background: #262626;
    margin: 30px; 
    cursor: pointer;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 5px #ffffff,
    0 0 15px #ffffff;
&:hover{
    color: #d000e8;
}
}
#course1 :hover{

}


span{
    color: white;
    font-size: 1.5em;
    text-transform: uppercase;
    letter-spacing: 2px;

}
*/
/*.learning{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
#course,#course1{
    position: relative;
    width: 300px;
    height: 160px;
    display: inline-block;
    background: #ffffff;
    margin: 20px; 
    cursor: pointer;
}
#course :before,
#course :after
{
    content: '';
    position: absolute;
    inset: 0;
    background: #b80000;
    transition: 0.5s;
}
#course :nth-child(1):before,
#course :nth-child(1):after{
    background: linear-gradient(45deg,#00ccff,#0e1538,#0e1538,#d400d4);
}

#course :hover:before{
    inset: -3px;
}
#course :hover:after{
    inset: -3px;
    filter: blur(10px);
}
#course span{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    background: #0e1538;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #ffffff;
    border: 1px solid #040a29;
    overflow: hidden;
}
#course span:before{
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.075);
    transform: skew(25deg);
} 
#course1 :before,
#course1 :after
{
    content: '';
    position: absolute;
    inset: 0;
    background: #b80000;
    transition: 0.5s;
}
#course1 :nth-child(1):before,
#course1 :nth-child(1):after{
    background: linear-gradient(45deg,#ff075b,#0e1538,#0e1538,#1aff22);
}
#course1 :hover:before{
    inset: -3px;
}
#course1 :hover:after{
    inset: -3px;
    filter: blur(10px);
}
#course1 span{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    background: #0e1538;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #ffffff;
    border: 1px solid #040a29;
    overflow: hidden;
}
#course1 span:before{
    content: '';
    position: absolute;
    top: 0;
    left: -50%;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.075);
    transform: skew(25deg);
} 
*/
`

const Learn_first = () => {
    const { letters } = useGlobalContext()
    // console.log(letters);

    const { isLoggedIn, login, logout } = useAuth();


    const navigate = useNavigate()


    useEffect(()=>{
        
        !isLoggedIn && navigate("/login")

    },[])


    return (
        <Wrapper>
            <div className='learning'>
                <NavLink to='/learn'>
                    <button id='course1'><span>Learn</span></button>
                </NavLink>
                <NavLink to='/practice'>
                    <button id='course1'><span>Practice</span></button>
                </NavLink>
                <NavLink to='/exam'>
                    <button id='course1'><span>Exam</span></button>
                </NavLink>
                {/* <NavLink to='/community'>
                    <button id='course'><span>Community</span></button>
                </NavLink> */}
               
            </div>
        </Wrapper >
    )
}

export default Learn_first