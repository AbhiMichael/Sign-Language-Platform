import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast"
import axios from 'axios';
import { apiUrl } from '../api';

const Button = styled.button`
  margin-top: 8px;
  width: 10rem;
`;

const Textarea = styled.textarea`
  margin-top: 8px;
  width: 100%;
  height: 200px; /* Increase height of textarea */
  resize: none; /* Prevent textarea from being resizable */
`;

const ModalOverlay = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  z-index: 999;
  backdrop-filter: blur(5px); /* Apply blur effect to the background */
`;

const ModalContent = styled.div`
  display: ${(props) => (props.show ? 'block' : 'none')};
  width: 60rem;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ccc; /* Gray background color */
  padding: 40px;
  border-radius: 8px;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  margin-top: 16px;
`;

const PopupForm = ({ show, onClose, question }) => {
    const [text, setText] = useState("")
    console.log("text is", text, "and ", question);
    const { role, userId } = useAuth()
    console.log("question is", question);
    const handleSubmit = async () => {
        if (text == "") {
            return toast.error("Please enter a question")
        }
        if (role == "user") {
            const response = await axios.post(apiUrl + "/question/addQuestion",
                { id: userId, questionDescription: text },
                {
                    headers: {
                        "Content-type": "application/json",
                    },
                })
            toast.success(response.data.message)
            onClose()
            window.location.reload()


        } else {
            const response = await axios.post(apiUrl + "/question/addAnswer", {
                qId: question._id,
                answerText: text,
                answeredBy: userId
            },
                {
                    headers: {
                        "Content-type": "application/json",
                    }
                })

            console.log("answer response", response);
            toast.success(response.data.message)
            onClose()
            window.location.reload()

        }
    }

    return (
        <>
            <ModalOverlay show={show} onClick={onClose} />
            <ModalContent show={show}>
                <CloseButton onClick={onClose}>X</CloseButton>

                <h2>{question ? 'Answer Question' : 'Ask Question'}</h2>
                {question && (
                    <>
                        <h3>{question.title}</h3>
                        <p>{question.description}</p>
                    </>
                )}
                <Textarea placeholder={question ? 'Type your answer here' : 'Type your question here'} value={text} onChange={e => setText(e.target.value)} />
                <SubmitButton onClick={handleSubmit}>{question ? 'Submit' : 'Ask'}</SubmitButton>
            </ModalContent>
        </>
    );
};

export default PopupForm;
