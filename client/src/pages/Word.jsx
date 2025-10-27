// import React, { useEffect, useRef } from 'react';
// import * as tmImage from '@teachablemachine/image';

// const Word = () => {
//     const webcamRef = useRef(null);
//     const labelContainerRef = useRef(null);

//     useEffect(() => {
//         let webcam;
//         let model;
//         let maxPredictions;

//         const init = async () => {
//             // Load the image model and setup the webcam
//             const URL = "/model/words/";
//             const modelURL = URL + "model.json";
//             const metadataURL = URL + "metadata.json";

//             // Load the model and metadata
//             model = await tmImage.load(modelURL, metadataURL);
//             maxPredictions = model.getTotalClasses();

//             // Setup the webcam
//             const flip = true;
//             webcam = new tmImage.Webcam(200, 200, flip);
//             await webcam.setup();
//             webcamRef.current.srcObject = webcam.stream;
//             await webcam.play();
//             window.requestAnimationFrame(loop);
//         };

//         const loop = () => {
//             webcam.update();
//             predict();
//             window.requestAnimationFrame(loop);
//         };

//         const predict = async () => {
//             const prediction = await model.predict(webcam.canvas);
//             for (let i = 0; i < maxPredictions; i++) {
//                 const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
//                 console.log(classPrediction);
//             }
//         };

//         // Initialize the webcam when the component mounts
//         init();

//         // Cleanup function
//         return () => {
//             if (webcam) {
//                 webcam.stop();
//             }
//         };
//     }, []);

//     return (
//         <div className="wrd-wrapper">
//             <div className="wrd-wrap-box">
//                 <div className="wrd-wrap-box-head">Teachable Machine Image Model</div>
//                 <div className="wrd-wrap-row-2">
//                     <button type="button">Start</button>
//                     <video ref={webcamRef} autoPlay playsInline id="webcam-container" />
//                     <div id="image-container">
//                         <img id="photo" alt="The screen capture will appear in this box." />
//                     </div>
//                     <div ref={labelContainerRef} id="label-container" />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Word;

import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";
import styled from "styled-components";



const Word = () => {

    const Wrapper = styled.section`
        min-height: 80vh;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4rem;
        canvas{
           width: 30rem;
           height: 30rem;
        }


        `



    const webcamRef = useRef(null);
    const labelContainerRef = useRef(null);

    useEffect(() => {
        const modelURL = "model/words/model.json"; // Replace with your model URL
        const metadataURL = "model/words/metadata.json"; // Replace with your metadata URL

        async function loadTMModel() {
            const model = await tmImage.load(modelURL, metadataURL);
            const maxPredictions = model.getTotalClasses();

            setInterval(() => {
                detectFromWebcam(model, maxPredictions);
            }, 1000); // Perform prediction every 1 second
        }

        loadTMModel();
    }, []);

    const detectFromWebcam = async (model, maxPredictions) => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const predictions = await model.predict(webcamRef.current.video);

            // Render predictions
            renderPredictions(predictions, maxPredictions);
        }
    };

    const renderPredictions = (predictions, maxPredictions) => {
        const ctx = labelContainerRef.current.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = `${predictions[i].className}: ${predictions[i].probability.toFixed(2)}`;
            ctx.font = "16px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(classPrediction, 10, (i + 1) * 20);
        }
    };

    return (
        <Wrapper>
            <Webcam
                className="webcam"
                ref={webcamRef}
                width={640}
                height={480}
                screenshotFormat="image/jpeg"
                audio={false}
            />
            <canvas
                className="ouptut-container"
                ref={labelContainerRef}

            />
        </Wrapper>
    );
};

export default Word;
