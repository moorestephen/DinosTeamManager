import React, { useEffect }from  'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Grid, TextField } from '@mui/material'

import DisplayAppBar from './DisplayAppBar';

export default function LoginPage() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/check-login-status/", {withCredentials: true})
        .then(response => {
            if (response.data['is_authenticated']) {
                navigate('/home'); // Navigate to home page if already logged in
            }})
        .catch(error => {
            console.log(error);
        })
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            axios.post('http://localhost:8000/login/', {
                username: username,
                password: password,
            }, {withCredentials: true})
            .then((response) => {
                navigate('/home'); // Navigate to home page
            }).catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <DisplayAppBar />
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} >
                <Grid item>
                    <TextField required label="Username" variant="outlined" id="usernameField" onChange={(e) => setUsername(e.target.value)}/>
                </Grid>
                <Grid item>
                    <TextField required label="Password" variant="outlined" id="passwordField" onChange={(e) => setPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" onClick={handleLogin}>Login</Button>
                </Grid>
            </Grid>
        </div>
    )
};
