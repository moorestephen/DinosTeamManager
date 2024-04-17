import React, { useEffect }from  'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Grid, TextField, Box, Typography, createTheme, ThemeProvider, Link,
         Dialog, DialogTitle, DialogContent, DialogActions, Alert, Stack } from '@mui/material'

import DisplayAppBar from './DisplayAppBar';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000',
        },
    },
});

function AddAdminPopup(props) {
    const {open, onClose } = props;

    const handleClose = () => {
        const email = document.getElementById('EmailField').value;
        const password = document.getElementById('PasswordField').value;
        const firstName = document.getElementById('FirstNameField').value;
        const lastName = document.getElementById('LastNameField').value;
        const tenureStart = document.getElementById('TenureStartField').value;

        axios.post('http://localhost:8000/create-user/', {
            email: email,
            username: email,
            password: password,
        })
        .then(response => {
            console.log(response.data)
            axios.post('http://localhost:8000/administrators/', {
                email: email,
                fname: firstName,
                lname: lastName,
                tenure_start: tenureStart,
                user: response.data.id,
                club_name: "Dinos"
            })
        })
        .catch(error => {
            console.log(error);
        })
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Add Administrator</DialogTitle>
            <DialogContent >
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField required label="Email" variant="outlined" id="EmailField" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required label="Password" variant="outlined" id="PasswordField" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required label="First Name" variant="outlined" id="FirstNameField" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required label="Last Name" variant="outlined" id="LastNameField" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required type="date" label="Tenure Start" variant="outlined" id="TenureStartField" InputLabelProps={{shrink: true}}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} >
                    Create new Administrator
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default function LoginPage() {

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [addAdminPopupOpen, setAddAdminPopupOpen] = React.useState(false);

    const navigate = useNavigate();

    const handleAddAdminClickOpen = () => {
        setAddAdminPopupOpen(true);
    };

    const handleAddAdminClickClose = () => {
        setAddAdminPopupOpen(false);
    };

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
        <ThemeProvider theme={theme}>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} height='90vh'>
                <Grid item>
                    <Typography variant='h2'>University of Calgary Dinos Swimming</Typography>
                </Grid>
                <Grid item>
                    <TextField required label="Email" variant="outlined" id="usernameField" onChange={(e) => setUsername(e.target.value)}/>
                </Grid>
                <Grid item>
                    <TextField required label="Password" variant="outlined" id="passwordField" onChange={(e) => setPassword(e.target.value)}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color='primary' onClick={handleLogin}>Login</Button>
                </Grid>
            </Grid>
            <Grid container justifyContent="center" alignItems="flex-end" >
                    <Button variant='text' color='primary' onClick={handleAddAdminClickOpen}>Create new administrator</Button>
                    <AddAdminPopup open={addAdminPopupOpen} onClose={handleAddAdminClickClose}/>
            </Grid>
        </ThemeProvider>
    )
};
