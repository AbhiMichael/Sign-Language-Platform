// StudentDetails.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import profileImage from '/public/images/dummy-profile-pic.jpg';
import axios from "axios";


const StudentDetailsContainer = styled.div`
  text-align: left;
  background-color: #f0f0f0; /* Fallback color */
  background-image: linear-gradient(to right, #ff7e5f, #feb47b); /* Gradient background */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 20px;
`;

const DetailsSection = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
`;

const QuestionAnswerSection = styled.div`
  font-size: 20px;
  margin-left: auto; /* Push the section to the right */
  background-color: #f0f0f0; /* Fallback color */
  background-image: linear-gradient(to right, #ff7e5f, #feb47b); /* Gradient background */
  
`;

const StudentDetails = () => {
  const student = {
    name: 'Krishna',
    age: 15,
    parentsName: 'Kala and Krishnan',
    address: 'Krishnalayam, Taliparamba',
    mobileno: '9807365421',
    questions: [
      { question: 'Find the missing letter of the word "_PPLE"', answer: 'Right' },
      { question: 'Find the missing letter of the word "SCHO_L"', answer: 'Wrong' },
      { question: 'Find the missing letter of the word "F_OWER"', answer: 'Wrong' },
      { question: 'Find the missing letter of the word "TEA_HER"', answer: 'Right'}
    ]
  };


  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);



  const calculatePercentage = () => {
    if (results.length === 0) {
      return 0;
    }

    const correctAnswers = results.filter(result => result.result === 'RIGHT').length;
    const totalQuestions = results.length;
    const percentage = (correctAnswers / totalQuestions) * 100;
    return percentage.toFixed(2); // Round to two decimal places
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    if (!token) {
      setError('Authorization token is required.');
      return;
    }

    axios.post('http://localhost:5000/question/profile', {
      token:localStorage.getItem("token")
    })
    .then(response => {
      const { profile, results } = response.data;
      setProfile(profile);
      setResults(results);
      console.log("frontend response",response.data);
    })
    .catch(error => {
      setError(error.message);
    });


    


  }, []); // Run only once on component mount



  return (
    <>
    <StudentDetailsContainer>
      <ProfileImage src={profileImage} alt="Profile" />
      <div>
        <h1>STUDENT DETAILS</h1>
        <DetailsSection>
          <p><strong>Name: </strong> {profile&&profile.name}</p>
          <p><strong>Email: </strong> {profile&&profile.email}</p>
          <p><strong>Address: </strong> {profile&&profile.address}</p>
          <p><strong>Mobile No: </strong> {profile&&profile.phone}</p>

        </DetailsSection>
      </div>

      <QuestionAnswerSection>
        <h1>Performance</h1>
        <div>
            <p><strong>{calculatePercentage()+"%"}</strong></p>
        </div>
      </QuestionAnswerSection>
    </StudentDetailsContainer>
    <QuestionAnswerSection>
        <h1>Questions & Answers</h1>
        {results&&results.map((item, index) => (
          <div key={index}>
            <p><strong>Question {index + 1}:</strong> {item.question}</p>
            <p><strong>Answer:</strong> {item.answer}</p>
            <p><strong>Result:</strong> {item.result}</p>

          </div>
        ))}
      </QuestionAnswerSection>
    </>

  );
};

export default StudentDetails;
