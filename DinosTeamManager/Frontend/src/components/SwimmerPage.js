import React, { useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import DisplayAppBar from "./DisplayAppBar.js";
import UserInformation from "./UserInformation.js";

import { Paper, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
         Button, Box, Dialog, DialogContent, TextField, DialogTitle, DialogActions,
         FormControlLabel, Checkbox, DialogContentText} from '@mui/material';


function AddEventRecordPopup(props) {
    const {open, onClose, setEventRecordData, userData} = props;

    const [competitionData, setCompetitionData ] = useState([]);
    const [swimmer, setSwimmer ] = useState([]);

    const [currentTime, setCurrentTime] = useState(new Date().toISOString().substr(11, 8));

    useEffect(() => {
        axios.get('http://localhost:8000/competitions/')
            .then(response => {
                setCompetitionData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        
        axios.get('http://localhost:8000/swimmers/')
            .then(response => {
                setSwimmer(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
        },

        []);

    const handleClose = () => {
        axios.post('http://localhost:8000/event_record/', {
            entry_time: currentTime,
            final_time_seconds: document.getElementById('final_time_seconds').value,
            distance: document.getElementById('distance').value,
            stroke: document.getElementById('stroke').value,
            course: document.getElementById('course').value,
            competition: document.getElementById('competition-select').value,
            swimmer: userData.email,
        })
        .then(response => {
            axios.get('http://localhost:8000/event_record/')  
                .then(response => {
                    setEventRecordData(response.data);
                })
                .catch((error) => {
                    console.log(error);
                });
            })
            .catch((error) => {
                console.log(error);
            });            
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent>
                <DialogContentText variant="h6" style={{ marginBottom: '20px' }}>Add Competition</DialogContentText>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField required id="final_time_seconds" type='number' label="Final Time (Seconds)" variant="outlined" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            required
                            id="distance"
                            options={['25', '50', '100', '200', '400', '800', '1500']}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Distance (m)" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            required
                            id="stroke"
                            options={['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly']}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Stroke" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            required
                            id="course"
                            options={['Short Course', 'Long Course']}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Course" variant="outlined" />}
                        />
                    </Grid>

                    <Grid item>
                        <Autocomplete
                            required
                            id="competition-select"
                            options={competitionData}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Competition" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} >
                    Add Event Record
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddEventRecordPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default function SwimmerPage(props) {
    const [userData, setUserData] = useState([{}]);

    const [AddEventRecordPopupOpen, setAddEventPopupOpen] = useState(false);

    const [eventRecordData, setEventRecordData] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [competitionNames, setCompetitionNames] = useState([]);

    const handleAddEventClickOpen = () => {
        setAddEventPopupOpen(true);
    };

    const handleAddEventClickClose = () => {
        setAddEventPopupOpen(false);
    };

    const navigate = useNavigate();

    useEffect(() => {
        // Navigate back to login page if user not logged in
        axios.get("http://localhost:8000/check-login-status/", {withCredentials: true})
        .then(response => {
            if (!response.data['is_authenticated']) {
                navigate('/'); // Navigate to login page if not logged in
            }
        })
        .catch(error => {
            console.log(error);
        })

        // Pull user info for display and reference 
        axios.get('http://localhost:8000/user-info/', {withCredentials : true})
        .then(response => {
            setUserData(response.data);
            console.log(response)
        })
        .catch((error) => {
            console.log(error);
        });

        axios.get(`http://localhost:8000/event_record`)
            .then(response => {
                setEventRecordData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

        axios.get(`http://localhost:8000/competitions`)
            .then(response => {
                const names = response.data.map(competition => competition.name);
                setCompetitionNames(names);
                setCompetitionData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <DisplayAppBar />
                </Grid>
                <Grid item xs={12}>
                    <Paper variant="outlined">
                        <UserInformation email={userData.email} role={userData.role} />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper variant="outlined">
                        <Typography variant='h6'>Event Record</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Swimmer Email</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Distance</TableCell>
                                    <TableCell>Stroke</TableCell>
                                    <TableCell>Course</TableCell>
                                    <TableCell>Competition</TableCell>  
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {eventRecordData.filter(record => record.swimmer === userData.email).map((event_record) => (
                                    <TableRow key={event_record.id}>
                                        <TableCell>{event_record.swimmer}</TableCell>
                                        <TableCell>{event_record.final_time_seconds}</TableCell>
                                        <TableCell>{event_record.distance}</TableCell>
                                        <TableCell>{event_record.stroke}</TableCell>
                                        <TableCell>{event_record.course}</TableCell>
                                        <TableCell>{event_record.competition}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleAddEventClickOpen}>Add Event</Button>
                            <AddEventRecordPopup open={AddEventRecordPopupOpen} onClose={handleAddEventClickClose} setEventRecordData={setEventRecordData} userData={userData} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper variant="outlined">
                        <Typography variant='h6'>Competitions</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Sanctioned</TableCell>
                                    <TableCell>Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {competitionData.map((competition) => (
                                    <TableRow key={competition.name}>
                                        <TableCell>{competition.name}</TableCell>
                                        <TableCell>{competition.sanctioned ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>{competition.start_date} to {competition.end_date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}