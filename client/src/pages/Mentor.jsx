import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from "../api";
import { useNavigate } from 'react-router-dom';

const MentorPanel = () => {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));


  const navigate = useNavigate()

  useEffect(() => {
    // Fetch student profiles when the component mounts
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(apiUrl+ '/allstudents'); // Adjust the endpoint to match your backend route
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  console.log(students);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h1>Mentor Panel</h1>
      <div style={{ marginTop: '20px' }}>
        <h2>Student Profile</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left',  backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left',  backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Profile</th>
              <th style={{ padding: '10px', textAlign: 'left',  backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}>Video Chat</th>


            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}   >
                <td style={{ padding: '10px', textAlign: 'centre' }} >{student.name}</td>
                <td style={{ padding: '10px', textAlign: 'centre' }}>{student.email}</td>
                <td style={{ padding: '10px', textAlign: 'centre' }}>


                <button
                  onClick={() => navigate("/studentprofile_id/"+student._id)}
                  style={{ padding: '5px', margin:"auto", border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'left', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}
                  >Profile</button>
                  </td>
                <td style={{ padding: '10px', textAlign: 'centre' }}>{student.mentor===user._id?
                
                <button
                  onClick={() => navigate(`/videoChat/${student._id}`)}
                  style={{ padding: '10px', border: 'none', cursor: 'pointer', borderRadius: '5px', textAlign: 'left', backgroundColor: '#4caf50', color: 'white', fontSize: '1.5rem' }}
                >Video Chat</button>
                :
                ""
                }</td>
                

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorPanel;
