import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../api';

// Styled components
const AdminWrapper = styled.div`
    min-height: 80vh;
    display: flex;
    font-size: 1.4rem;
`;

const Sidebar = styled.div`
    width: 200px;
    background-color: #f2f2f2;
`;

const MainContent = styled.div`
    flex: 1;
    padding: 20px;
`;

const SidebarButton = styled(Link)`
    display: block;
    padding: 10px 20px;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid #ddd;
    background-color: ${({ active }) => active ? "#ddd" : "inherit"};

    &:hover {
        background-color: #ddd;
    }
`;

const VerifyButton = styled.button`
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    margin-left: 5px;
`;

const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const TableHeader = styled.th`
    padding: 10px;
    background-color: #f2f2f2;
    border: 1px solid #ddd;
`;

const TableCell = styled.td`
   text-align:center;

    padding: 10px;
    border: 1px solid #ddd;
`;

const DeleteButton = styled.button`
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
`;

const Admin = () => {
    const [allData, setAllData] = useState([]);
    const [mentorData, setMentorData] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [activeSection, setActiveSection] = useState('mentors');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch all data when component mounts

        fetchAllData();
        if (!isLoading) {
            handleMentorClick()
        }
    }, [isLoading]);

    const fetchAllData = async () => {
        try {
            // Simulating fetching data from API
            const response = await axios.get(`${apiUrl}/all`);
            const resData = response.data;
            setAllData(resData);

            setIsLoading(false); // Data fetching is complete
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleMentorClick = () => {
        const mentors = allData.filter(item => item.Role === 'mentor');
        setMentorData(mentors);
        setStudentData([]); // Clear student data
        setActiveSection('mentors');
    };

    const handleStudentClick = () => {
        const students = allData.filter(item => item.Role === 'user');
        setStudentData(students);
        setMentorData([]); // Clear mentor data
        setActiveSection('students');
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${apiUrl}/user/${id}`);
            console.log('User deleted successfully');
            window.location.reload(); // Reload the page after delete
            
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleVerify = async (id) => {
        try {
            await axios.put(`${apiUrl}/mentor/${id}`, { verifiedmentor: true });
            console.log('Mentor verified successfully');
            window.location.reload(); // Reload the page after verification
        } catch (error) {
            console.error('Error verifying mentor:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <AdminWrapper>
            <Sidebar>
                <h2>Admin Panel</h2>
                <SidebarButton to="#" onClick={handleMentorClick} active={activeSection === 'mentors'}>Mentors</SidebarButton>
                <SidebarButton to="#" onClick={handleStudentClick} active={activeSection === 'students'}>Students</SidebarButton>
            </Sidebar>
            <MainContent>
                <Table>
                    <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Email</TableHeader>
                            <TableHeader>Role</TableHeader>
                            <TableHeader>Action</TableHeader>
                            {mentorData.length > 0 && <TableHeader>Verify</TableHeader>}
                        </tr>
                    </thead>
                    <tbody>
                        {(mentorData.length > 0 || studentData.length > 0) ? (
                            <>
                                {mentorData.map((item, index) => (
                                    <tr key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.Role}</TableCell>
                                        <TableCell>
                                            <DeleteButton onClick={() => handleDelete(item._id)}>Delete</DeleteButton>
                                        </TableCell>
                                        <TableCell>
                                            {!item.verifiedMentor ? (
                                                <VerifyButton onClick={() => handleVerify(item._id)}>Verify</VerifyButton>
                                            ) : (
                                                <span>Verified</span>
                                            )}
                                        </TableCell>
                                    </tr>
                                ))}
                                {studentData.map((item, index) => (
                                    <tr key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.Role}</TableCell>
                                        <TableCell>
                                            <DeleteButton onClick={() => handleDelete(item._id)}>Delete</DeleteButton>
                                        </TableCell>
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <tr>
                                <TableCell colSpan={5}>No data available</TableCell>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </MainContent>
        </AdminWrapper>
    );
};

export default Admin;
