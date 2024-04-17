import React, { useState, useEffect } from "react";
import { Grid, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserInformation(props) {

    const navigate = useNavigate();

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
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Typography variant="h5">
                    User: {props.email} (Role: {props.role})
                </Typography>
                
            </Grid>
            <Grid item xs={6}>
                <Button variant="outlined" onClick={handleLogout}>Log Out</Button>
            </Grid>
        </Grid>
    );
};
