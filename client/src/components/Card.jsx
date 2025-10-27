// import React from 'react'
import { styled } from 'styled-components'


const Wrapper = styled.section`
    max-width: 25em;
    display: flex;
    flex-direction: column;
    background-color: #ebb032;
    border:2px solid #ffffff; 
                   border-radius:10px;
        img{
            width: 100%;
            height: 90%;
                    /* border:2px solid #fff;  */
                    /* box-shadow: 10px 10px 5px #ebb032;  */
                   /* border-radius:25px; */
        }

    h2{
            margin: 0 auto;
            
    }

`



const Card = ({ letter, isWord = false }) => {
    return (
        <Wrapper>
            {isWord ?
                <img src={`/images/words/${letter}.jpeg`} />
                :
                <img src={`/images/letters/${letter}.png`} />
            }
            <h2>{letter}</h2>

        </Wrapper>
    )
}

export default Card