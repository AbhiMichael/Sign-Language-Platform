import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import SimplePeer from "simple-peer";
import { useParams } from "react-router-dom";
import Chat from "./Chat";

const socket = io("http://localhost:5000"); // Change if needed

const VideoCall = () => {
  const [stream, setStream] = useState(null);
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const { roomId,RecieverId } = useParams();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);


  console.log("Reciever id", RecieverId);
  

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
        socket.emit("join-room", { roomId });
      })
      .catch((err) => console.error("Error getting media:", err));
  }, [roomId]);

  useEffect(() => {
    if (!stream) return;
    
    socket.on("user-joined", ({ peerId }) => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      peerRef.current = createPeer(peerId, stream);
    });

    socket.on("receive-offer", ({ senderId, offer }) => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      peerRef.current = acceptPeer(senderId, offer, stream);
    });

    socket.on("receive-answer", ({ answer }) => {
      if (peerRef.current) {
        peerRef.current.signal(answer);
      }
    });

    socket.on("receive-ice-candidate", ({ candidate }) => {
      if (peerRef.current) {
        peerRef.current.signal(candidate);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("receive-offer");
      socket.off("receive-answer");
      socket.off("receive-ice-candidate");
      
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
    };
  }, [stream]);

  function createPeer(peerId, stream) {
    console.log("create peer", peerId);
    console.log("stream", stream);
    
    const peer = new SimplePeer({
      initiator: true,
      trickle: true,
      stream,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    });

    peer.on("signal", (offer) => {
      socket.emit("offer", { roomId, offer, target: peerId });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    return peer;
  }

  function acceptPeer(peerId, offer, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: true,
      stream,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    });

    peer.signal(offer);
    
    peer.on("signal", (answer) => {
      socket.emit("answer", { roomId, answer, target: peerId });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    return peer;
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = isVideoPaused;
      setIsVideoPaused(!isVideoPaused);
    }
  };

  return (
    <div style={styles.container}>
      <div className="video">

      <h2 style={styles.title}>Video Call Room: {roomId}</h2>
      <div style={styles.videoContainer}>
        <div style={styles.videoWrapper}>
          <h3 style={styles.subTitle}>Your Video</h3>
          <video ref={myVideoRef} autoPlay muted style={styles.video} />
        </div>
        <div style={styles.videoWrapper}>
          <h3 style={styles.subTitle}>Remote Video</h3>
          <video ref={remoteVideoRef} autoPlay style={styles.video} />
        </div>
        
      </div>
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={toggleMute} 
          style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button 
          onClick={toggleVideo} 
          style={{ padding: "10px 20px", fontSize: "16px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          {isVideoPaused ? "Resume Video" : "Pause Video"}
        </button>
      </div>
      </div>

      <Chat RecieverId={RecieverId} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    // flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "85vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  videoContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  videoWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  subTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  video: {
    width: "300px",
    height: "auto",
    borderRadius: "10px",
    border: "2px solid #333",
  },
};

export default VideoCall;
