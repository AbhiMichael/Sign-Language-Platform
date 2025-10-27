import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from "../api";
import { useNavigate } from 'react-router-dom';

const MentorsList = () => {
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [user, setuser] = useState(null);

  console.log(user);
  

  const navigate = useNavigate();

  useEffect(() => {
    fetchMentors();
  }, []);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Make a GET request to your user REST API
        const response = await axios.get(apiUrl+'/getUser',{
          headers: {
            'token': localStorage.getItem("token")
          }
        }); // Replace '/api/user' with your actual API endpoint
        // Assuming the response data contains user information
        setuser(response.data);
        console.log("response",response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(apiUrl + '/allmentors'); 
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const selectMentor = async (mentorId) => {
    try {
      const response = await axios.post(apiUrl + '/selectmentor', {
        studentId:user._id,
        mentorId
      });

      if (response.data.success) {
        setSelectedMentor(mentorId);
        alert('Mentor selected successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error selecting mentor:', error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1>Mentor Panel</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>Mentor List</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'center', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px', textAlign: 'center' }}>{mentor.name}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>{mentor.email}</td>
                <td style={{ padding: '10px', textAlign: 'center' }}>
                  <button 
                    onClick={() => selectMentor(mentor._id)} 
                    disabled={selectedMentor === mentor._id}
                    style={{ 
                      backgroundColor: selectedMentor === mentor._id ? '#aaa' : '#4caf50', 
                      color: 'white', 
                      padding: '8px', 
                      border: 'none', 
                      cursor: selectedMentor === mentor._id ? 'default' : 'pointer'
                    }}
                  >
                    {user?.mentor === mentor._id ? 'Selected' : 'Select Mentor'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorsList;
