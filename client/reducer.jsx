const reducer = (state, action) => {
    if (action.type === "GET_LETTERS") {
        return {
            ...state,
            letters: action.payload
        }
    }
    if (action.type === 'GET_LETTERCLASS') {
        return {
            ...state,
            letterClass: action.payload
        }
    }
    if (action.type === 'GET_QUESTIONCLASS') {
        return {
            ...state,
            questionClass: action.payload
        }
    }
    return state
}

export default reducer