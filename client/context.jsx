import React, { useContext, useEffect, useReducer } from "react";
import { letter, letterClass } from "./data"
import reducer from "./reducer";


const AppContext = React.createContext()

const initialState = {
    letters: [],
    letterClass: [],
    questionClass:[]
}

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const getLetters = () => {
        return dispatch({
            type: "GET_LETTERS",
            payload: letter
        }

        )
    }
    const getLetterClass = () => {
        return dispatch({
            type: 'GET_LETTERCLASS',
            payload: letterClass
        })
    }



    useEffect(() => {
        getLetters()
        getLetterClass()
    }, [])


    return (<AppContext.Provider value={{ ...state }}>{children}</AppContext.Provider>)
}

const useGlobalContext = () => {
    return useContext(AppContext)
}

export { AppProvider, AppContext, useGlobalContext }