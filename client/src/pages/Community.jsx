import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from "../AuthContext";
import PopupForm from '../components/Popup';
import axios from 'axios';
import { apiUrl } from '../api';

// Styled components
const Wrapper = styled.div`
  min-height: 70vh;
  max-height: 100vh;
  background-color: #000;
  padding: 20px;
  font-size: 1.4rem;
  overflow-y:scroll;
`;

const Button = styled.button`

width: 10rem;
  margin-top: 8px;
`;

const Card = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  background-color: #fff; /* Set background color for cards */
  display: flex;
  flex-direction: column; /* Change flex direction to column */
`;

const QuestionText = styled.div`
  flex: 1;
`;

const AnswerText = styled.div`
display: flex;
align-items: center;
border-radius: 4px;
margin-top: 2rem;

h2{
   padding: 2rem;
   background-color: #488348;
}
    p{
        padding: 2rem;
    }
    background-color: #83ed83;
`





const Community = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [selectedQuestion, setSelectedQuestion] = React.useState(null);
    const [questionList, setQuestionList] = useState([])

    const { role } = useAuth()
    // Dummy questions for testing




    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(apiUrl + "/question/all")
            const resData = await response.data
            console.log(resData)
            setQuestionList(resData.question)
        }

        fetchData()
    }, [])

    // Handler for answering a question
    const handleAnswerClick = (question) => {
        setSelectedQuestion(question);
        setShowModal(true);
    };

    // Handler for adding a new question
    const handleAddQuestionClick = () => {
        setSelectedQuestion(null);
        setShowModal(true);
    };

    // Handler for closing the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Wrapper>
            {role === 'user' && (
                <Button onClick={handleAddQuestionClick}>Ask Question</Button>
            )}
            {questionList.map((question) => (
                <Card key={question._id}>
                    <QuestionText>
                        <p>{question.description}</p>
                    </QuestionText>
                    {role === 'mentor' && !question.answer && <Button onClick={() => handleAnswerClick(question)}>Answer</Button>}
                    {question.answer &&
                        (<>

                            <AnswerText>
                                <h2>Answer</h2>
                                <p>
                                    {question.answer.text}
                                </p> </AnswerText>

                        </>)}


                </Card>

            ))}


            <PopupForm show={showModal} onClose={handleCloseModal} question={selectedQuestion} />
        </Wrapper>
    );
};

export default Community;