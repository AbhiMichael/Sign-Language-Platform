import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import * as tmImage from '@teachablemachine/image';
import { useParams } from 'react-router-dom';


const Wrapper = styled.section`
  background-color: ${({ theme }) => theme.colors.black};
  color: white;
  padding: 9em 4em;

  .title {
    text-align: center;
    font-size: 4rem;
    text-transform: uppercase;
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

const   Model = () => {
  const { modelName } = useParams();


  const [model, setModel] = useState(null);
  const [maxPredictions, setMaxPredictions] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureInProgress, setCaptureInProgress] = useState(false);
  const [predictedClass, setPredictedClass] = useState('');

  useEffect(() => {
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

      setPredictedClass(prediction[maxProbabilityIndex].className);
    }
  };

  // const captureImage = () => {

  //   if (!captureInProgress) {
  //     setCaptureInProgress(true);
  //     setTimeout(() => {
  //       const videoElement = document.querySelector('video');

  //       const canvas = document.createElement('canvas');
  //       canvas.width = videoElement.videoWidth;
  //       canvas.height = videoElement.videoHeight;

  //       const context = canvas.getContext('2d');
  //       context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  //       const image = new Image();
  //       image.src = canvas.toDataURL('image/jpeg');

  //       image.addEventListener('load', () => {
  //         setCapturedImage(image);
  //         predict(image);
  //         setCaptureInProgress(false);
  //       });
  //     }, 5000);
  //   }
  // };

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
      <div className="title">Model</div>
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
        <div>Predicted Class: {predictedClass}</div>
        {/* {predictions.map((prediction, index) => (
          <div key={index}>{`${prediction.className}: ${prediction.probability.toFixed(2)}`}</div>
        ))} */}
      </div>
    </Wrapper>
  );
};

export default Model;
