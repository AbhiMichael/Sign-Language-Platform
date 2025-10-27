import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from "../api";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${apiUrl}/notifications/${user._id}`);
        if (response.data.success) {
          setNotifications(response.data.notifications);
        } else {
          setError('Failed to fetch notifications');
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user._id]);

  console.log(notifications);
  

  // Function to join the video call
  const handleJoinCall = (roomId,mentorId) => {
    const RecieverId = mentorId;
    navigate(`/videocall/${roomId}/${RecieverId}`); // Redirect to the video call page
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Notifications</h2>

      {loading && <p style={styles.loading}>Loading notifications...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && notifications.length === 0 && (
        <p style={styles.noNotifications}>No notifications available</p>
      )}

      <ul style={styles.list}>
        {notifications.map((notification) => (
          <li key={notification._id} style={styles.listItem}>
            <strong>Room ID:</strong> {notification.roomId} <br />
            <strong>Date:</strong> {notification.date} <br />
            <strong>Time:</strong> {notification.time} <br />
            <button 
              style={styles.button} 
              onClick={() => handleJoinCall(notification.roomId, notification.mentorId)}
            >
              Join Video Call
            </button>
          </li>
        ))}
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
    fontSize: '1.6rem'
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '15px',
    color: '#333'
  },
  loading: {
    color: '#888',
    fontSize: '1rem'
  },
  error: {
    color: 'red',
    fontSize: '1rem'
  },
  noNotifications: {
    color: '#555',
    fontSize: '1rem'
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
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    fontSize: '1rem'
  }
};

export default Notifications;
