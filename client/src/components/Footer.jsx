import React from 'react'
import { styled } from 'styled-components'


const Wrapper = styled.section`
padding: 5rem 0;
    background-color: ${({ theme }) => theme.colors.black};
    
    color:${({ theme }) => theme.colors.white};
    footer{
        padding-top:2em;
    }
    .footer-about{
        font-size: 1.5rem;
        a{
            font-size: 1rem;
            text-decoration: none;
            color: aliceblue;
        }
    }


`

const Footer = () => {
    return (
        <Wrapper>
            <hr />
            <footer>
                <div className="footer-about">
                    @ SignL
                </div>
            </footer>
        </Wrapper>
    )
}

export default Footer