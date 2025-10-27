import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "../api";

const VideoChat = () => {
  const { studentId } = useParams();  // Get student ID from URL params
  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  // Fetch notifications sent by the mentor
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiUrl}/mentor-notifications/${user._id}`);
        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setMessage('Failed to fetch notifications.');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setMessage('An error occurred while fetching notifications.');
      }
    };

    fetchNotifications();
  }, [user._id]);

  const handleSendNotification = async () => {
    if (!roomId || !date || !time) {
      setMessage('Please fill all fields!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(`${apiUrl}/sendNotification`, {
        studentId,
        mentorid: user._id,
        roomId,
        date,
        time
      });

      if (response.data.success) {
        setMessage('Notification sent successfully!');
        // Update the notifications list
        setNotifications([...notifications, response.data.notification]);
      } else {
        setMessage('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage('An error occurred while sending.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCall = (roomId,studentId) => {
    const RecieverId = studentId// Determine the receiver ID based on the current user's ID
    navigate(`/videocall/${roomId}/${RecieverId}`); // Redirect to the video call page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Schedule Video Chat</h2>

      <label style={styles.label}>Room ID:</label>
      <input 
        type="text" 
        value={roomId} 
        onChange={(e) => setRoomId(e.target.value)} 
        style={styles.input} 
        placeholder="Enter Room ID" 
      />

      <label style={styles.label}>Date:</label>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        style={styles.input} 
      />

      <label style={styles.label}>Time:</label>
      <input 
        type="time" 
        value={time} 
        onChange={(e) => setTime(e.target.value)} 
        style={styles.input} 
      />

      <button 
        onClick={handleSendNotification} 
        style={styles.button} 
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Notification'}
      </button>

      {message && <p style={styles.message}>{message}</p>}

      {/* Mentor's Sent Notifications */}
      <h3 style={styles.subTitle}>Sent Notifications</h3>
      <ul style={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li key={notification._id} style={styles.listItem}>
              <strong>Room ID:</strong> {notification.roomId} <br />
              <strong>Date:</strong> {notification.date} <br />
              <strong>Time:</strong> {notification.time}
              <button 
              style={styles.button} 
              onClick={() => handleJoinCall(notification.roomId, notification.studentId)}
            >
              Join Video Call
            </button>
            </li>
          ))
        ) : (
          <p style={styles.noNotifications}>No notifications sent yet.</p>
        )}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    fontSize: '1.6rem',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '15px',
    color: '#333'
  },
  subTitle: {
    fontSize: '1.5rem',
    marginTop: '20px',
    color: '#555'
  },
  label: {
    display: 'block',
    marginTop: '10px',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '5px 0 10px',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '15px',
    fontSize: '1rem'
  },
  message: {
    marginTop: '10px',
    fontWeight: 'bold',
    color: 'green'
  },
  list: {
    listStyleType: 'none',
    padding: 0
  },
  listItem: {
    backgroundColor: '#f9f9f9',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    textAlign: 'left'
  },
  noNotifications: {
    color: '#555',
    fontSize: '1rem'
  }
};

export default VideoChat;
