import React, { useState, useEffect } from  'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Typography, Button, Grid, TextField } from '@mui/material'

import DisplayAppBar from './DisplayAppBar';

export default function HomePage() {
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/check-login-status/", {withCredentials: true})
        .then(response => {
            if (!response.data['is_authenticated']) {
                navigate('/'); // Navigate to login page if not logged in
            }
        })
        .catch(error => {
            console.log(error);
        })

        // Direct to appropriate page depending on user role
        axios.get("http://localhost:8000/user-info/", {withCredentials: true})
        .then(response => {
            if (response.data['role'] === 'Swimmer') {
                navigate('/swimmer');
            } else if (response.data['role'] === 'Coach') {
                navigate('/coach');
            } else if (response.data['role'] === 'Administrator') {
                navigate('/administrator');
            } else {
                navigate('/'); // Navigate to login page if user role is not recognized
            }
        })
    }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            axios.get('http://localhost:8000/logout/', {withCredentials: true})
            .then((response) => {
                navigate('/');
            }).catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Button variant="outlined" onClick={handleLogout}>Log Out</Button>
        </div>
    )
};
