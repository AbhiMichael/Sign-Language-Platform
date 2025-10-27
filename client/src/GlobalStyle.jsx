import { createGlobalStyle } from 'styled-components'


const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Poppins', sans-serif;
    }
    html{
        font-size: 62.5%;
        overflow-x: hidden;
    }
    body{
        color: ${({ theme }) => theme.colors.black};
        z-index: 3;


    }
    .container{
        max-width: 120em;
        margin: 0 auto;
    }
    .grid{
        display: grid;
        gap:9em;
    }

    .grid-two-column{
        grid-template-columns: repeat(2,1fr);
    }
    .grid-three-column{
        grid-template-columns: repeat(3,1fr);
    }



   
`;




export default GlobalStyle