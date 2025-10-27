import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import * as tmImage from '@teachablemachine/image';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios"

const Wrapper = styled.section`


  background-color: ${({ theme }) => theme.colors.black};
  color: white;
  padding: 5em 4em;
  .next{
    position:absolute;
    width:200px;
    height:60px;
    background:orange;
    border:none;
    outline:none;
    border-radius:20px;
    right:60px;
    cursor:pointer;
    font-size:30px;
  }

  .title {
    text-align: center;
    font-size: 4rem;
    text-transform: uppercase;
  }
  .question{
    text-align: center;
    font-size: 3rem;
    margin-top: 1em;

  }
.box{
    display: flex;
    justify-content: space-between;
    padding: 2em 0;

    .camera {
      text-align: center;
      
  
      video {

        border: 2px solid white;
        border-radius: 20px;
      }
    }
    img{
        border: 2px solid white;
        border-radius: 20px;

  transform: rotateY(180deg);

    }
}
.btn{
    
        max-width: 16em;
        color: #FFF;
  border: 2px solid rgb(242, 218, 232);
  border-radius: 500px;
  padding: 0.5em 1em;
  font-size: 14px;
  letter-spacing: 1px;
  color: #060606;
    background-color: #ebb032;
  cursor: pointer;
  text-align: center;
margin:0 auto;
  &:hover{
    background-color: #000000;
        color: #ebb032;
        border-color:#ebb032;
  }
  
}



  canvas {
    border: 2px solid white;
  }
  #label-container{
    font-size: 2rem;
  }
`;



const questions=[
    {
        ques_number: 1,
        question: 'Find the missing letter of the word "_PPLE"',
        answer: 'A'
    },
    {
        ques_number: 2,
        question: 'Find the missing letter of the word "SCHO_L"',
        answer: 'O'
    },
    {
        ques_number: 3,
        question: 'Find the missing letter of the word "F_OWER"',
        answer: 'L'
    },
    {
        ques_number: 4,
        question: 'Find the missing letter of the word "TEA_HER"',
        answer: 'C'
    }
  ]

const   Question = () => {


    const { ques_num,modelName } = useParams();

    const navigate = useNavigate()

  
    const question = questions.find(q => q.ques_number === parseInt(ques_num));
    
    console.log(question);
    if (!question) {
      return <div>Question not found</div>;
    }


    
  

  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [predictedClass, setPredictedClass] = useState(false);

  useEffect(() => {

    // const modelName="adf"

    console.log(modelName);

  


    const init = async () => {
      const URL = `/model/${modelName}/`;
      const modelURL = URL + 'model.json';
      const metadataURL = URL + 'metadata.json';

      const loadedModel = await tmImage.load(modelURL, metadataURL);
      setModel(loadedModel);
      setMaxPredictions(loadedModel.getTotalClasses());
    };

    init();
  }, []);

  const predict = async (image) => {
    console.log("predict",model);
    if (model) {
      const prediction = await model.predict(image);
      setPredictions(prediction);

      // Find the index of the predicted class with the maximum probability
      const maxProbabilityIndex = prediction.reduce(
        (maxIndex, currentPrediction, currentIndex) => {
          return currentPrediction.probability > prediction[maxIndex].probability ? currentIndex : maxIndex;
        },
        0
      );

      axios.post('http://localhost:5000/question/results', {
        question: question.question,
        answer: question.answer,
        result: prediction[maxProbabilityIndex].className,
        token:localStorage.getItem('token')
      })
      .then((response) => {
        console.log('Response:', response.data);
        // You can perform further actions based on the response, like showing a success message.
      })
      .catch((error) => {
        console.error('Error:', error.response.data.message);
        // Handle error, show error message to user, etc.
      });

      setPredictedClass(prediction[maxProbabilityIndex].className);
      console.log(prediction[maxProbabilityIndex].className);
    }
  };


  

  const captureImage = () => {
    if (!captureInProgress) {
      setCaptureInProgress(true);
      setTimeout(() => {
        const videoElement = document.querySelector('video');

        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const imageDataArray = imageData.data;
        console.log(imageDataArray)

        // Preprocess the image data
        for (let i = 0; i < imageDataArray.length; i += 4) {
          // Apply any preprocessing steps here
          // Example: Convert to grayscale
          const r = imageDataArray[i];
          const g = imageDataArray[i + 1];
          const b = imageDataArray[i + 2];
          const grayScale = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

          imageDataArray[i] = grayScale;
          imageDataArray[i + 1] = grayScale;
          imageDataArray[i + 2] = grayScale;
        }

        context.putImageData(imageData, 0, 0);

        const image = new Image();
        image.src = canvas.toDataURL('image/jpeg');

        image.addEventListener('load', () => {
          setCapturedImage(image);
          predict(image);
          setCaptureInProgress(false);
        });
      }, 5000);
    }
  };



  return (
    <Wrapper id="demos">
      <button className="next" onClick={()=>question.ques_number==1?navigate("/question/o/2"):question.ques_number==2?navigate("/question/l/3"):question.ques_number==3?navigate("/question/c/4"):question.ques_number==4?navigate("/learn_first"):null} >Next</button>
      <div className="title">Question {question.ques_number}</div>
      <div className="question">{question.question}</div>
      <div className="box">
        <div className="camera">
          <Webcam
            audio={false}
            mirrored={true}

          />
        </div>
        {capturedImage && <img src={capturedImage.src} alt="Captured" />}
      </div>
      <div className="btn" onClick={captureImage}>
        Capture Image
      </div>
      <div id="label-container">
        <div>Predicted Class: {predictedClass ? predictedClass==="WRONG"?<span style={{color:"red"}}>Wrong</span> :<span style={{color:"green"}}>Correct</span>:""}</div>
        {/* {predictions.map((prediction, index) => (
          <div key={index}>{`${prediction.className}: ${prediction.probability.toFixed(2)}`}</div>
        ))} */}
      </div>
    </Wrapper>
  );
};

export default Question;
