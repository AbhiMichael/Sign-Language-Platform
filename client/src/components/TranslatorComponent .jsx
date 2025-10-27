import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Translate.css";


const TranslatorComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responseType, setResponseType] = useState("");
  const [responseUrl, setResponseUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const imgRef = useRef(null); // Create a reference for the image
  const sliderRef = useRef(null);

  const [voicetext, setvoicetext] = useState("")

  useEffect(() => {
    const updateImageWidth = () => {
      if (imgRef.current) {
        const imageWidth = imgRef.current.offsetWidth; // Get the image width dynamically
        console.log("Image Width:", imageWidth);

        const steps = Math.floor(imageWidth / 360) - 1; // Calculate the steps
        console.log("Steps:", steps);

        // Update CSS custom properties
        document.documentElement.style.setProperty("--steps", steps > 0 ? steps : 0);
        document.documentElement.style.setProperty("--total-width", `${imageWidth}px`);
      }
    };

    // Check if the image is already loaded
    if (imgRef.current && imgRef.current.complete) {
      updateImageWidth();
    } else if (imgRef.current) {
      imgRef.current.addEventListener("load", updateImageWidth);
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.removeEventListener("load", updateImageWidth);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log("Audio chunk received:", e.data);
        audioChunks.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        audioChunks.current = []; // Reset for the next recording
        console.log("Audio recording stopped, sending to backend");
        sendAudioToBackend(audioBlob);

        // Optional: Play the recorded audio
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      };

      audioChunks.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError("Failed to access the microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob) => {
    setIsLoading(true);
    console.log("Sending audio to backend...", audioBlob);
    


    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.wav");

    try {
      const res = await axios.post("http://127.0.0.1:5000/translate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // To handle image/GIF response
      });

      console.log("Response from backend:", res.headers["cache-control"]);
      
      setvoicetext(res.headers["cache-control"])
      const contentType = res.headers["content-type"];
      const blobUrl = URL.createObjectURL(res.data);

      if (contentType.includes("image/gif")) {
        setResponseType("gif");
      } else if (contentType.includes("image/jpeg")) {
        setResponseType("image");
      }

      setResponseUrl(blobUrl);
    } catch (err) {
      setError("Failed to process the audio input. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="translator-container">
    <div className="recording-section">
      <h2>Recording</h2>
      {!isRecording ? (
        <button className="record-button" onClick={startRecording}>
          Start Recording
        </button>
      ) : (
        <button className="record-button" onClick={stopRecording}>
          Stop Recording
        </button>
      )}
      {isLoading && <p>Processing...</p>}
      {error && <p className="error">{error}</p>}
    </div>
    <div className="output-section">
      <h1>Translation Result</h1>
      <h2>{voicetext}</h2>
      {responseUrl && (
        responseType === "gif" ? (
          <div className="gif-container">
            <img src={responseUrl} alt="Translated GIF" />
          </div>
        ) : (
          <div className="slider-container">
            <div className="slider" ref={sliderRef}>
              <img src={responseUrl} alt="Sliding Image" ref={imgRef} />
            </div>
          </div>
        )
      )}

    </div>
  </div>
  );
};

export default TranslatorComponent;
