import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { apiUrl } from '../api';

const styles = {
  videoWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  },
  chatBox: {
    width: '100%',
    height: '400px',
    overflowY: 'auto',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column'
  },
  messageInput: {
    width: '100%',
    padding: '10px',
    marginTop: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  message: {
    padding: '10px',
    margin: '5px 0',
    borderRadius: '5px',
    maxWidth: '80%',
  },
  studentMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-start'
  },
  mentorMessage: {
    backgroundColor: '#cfe2ff',
    alignSelf: 'flex-end'
  },
  sendButton: {
    padding: '10px 15px',
    marginTop: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

const Chat = ({RecieverId}) => {
    const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")))
    // const user = JSON.parse(localStorage.getItem("user"));

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
  
    // console.log(influencerId, brandId);
  
  
    // const RecieverId = location.state.id._id;
  
    const senderId = user._id;
  
    console.log("sender",user._id);
    console.log("reciever",RecieverId);
  
    useEffect(() => {
      axios
        .post(`${apiUrl}/chat/${senderId}/${RecieverId}`, {
          token: localStorage.getItem("token"),
        })
        .then((response) => setMessages(response.data))
        .catch((error) => console.error("Error fetching chat messages:", error));
    }, [messages]);
  
    console.log(messages);
  
    const sendMessage = () => {
      if (newMessage.trim() === "") return;
  
      const messageData = {
        text: newMessage,
        RecieverId,
        senderId,
        token: localStorage.getItem("token"),
      };
  
      axios
        .post(`${apiUrl}/chat/send`, messageData)
        .then((response) => {
          setMessages([...messages, response.data]);
          setNewMessage("");
        })
        .catch((error) => console.error("Error sending message:", error));
    };
  

  return (
    <div style={styles.videoWrapper}>
      <h2>Chat between Student and Mentor</h2>
      <div style={styles.chatBox}>
        {/* {messages.map((msg, index) => (
          <div key={index} style={{ ...styles.message, ...(msg.sender === 'student' ? styles.studentMessage : styles.mentorMessage) }}>
            {msg.text}
          </div>
        ))} */}
        {messages
            .filter((msg) =>
              msg.senderId === senderId
                ? msg.senderId == senderId
                : msg.RecieverId == senderId
            )
            .map((msg, index) => (
                <div key={index} style={{ ...styles.message, ...(msg.RecieverId === user._id ? styles.studentMessage : styles.mentorMessage) }}>
                {msg.text}
              </div>
            ))}
      </div>
      <input
        type="text"
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        style={styles.messageInput}
      />
      <button onClick={sendMessage} style={styles.sendButton}>Send</button>
    </div>
  );
};

export default Chat;
