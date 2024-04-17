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
    const { open, onClose, setEventRecordData, competitionNames, setCompetitionNames, setCompetitionData } = props;
    const [swimmer, setSwimmer] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date().toISOString().substr(11, 8));

    useEffect(() => {
        axios.get('http://localhost:8000/competitions/')  
            .then(response => {
                setCompetitionNames(response.data.map(competition => competition.name));
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
    }, []);

    const handleClose = () => {
        axios.post('http://localhost:8000/event_record/', {
            entry_time: currentTime,
            final_time_seconds: document.getElementById('final_time_seconds').value,
            distance: document.getElementById('distance').value,
            stroke: document.getElementById('stroke').value,
            course: document.getElementById('course').value,
            competition: document.getElementById('competition-select').value,
            swimmer: document.getElementById('swimmer-select').value,
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
                            id="swimmer-select"
                            options={swimmer}
                            getOptionLabel={(option) => option.email}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Swimmer" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            required
                            id="competition-select"
                            options={competitionNames}
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

function RemoveEventRecordPopup(props) {
    const { open, onClose, setEventRecordData, eventRecordIds } = props;
    const [selectedEventRecordId, setSelectedEventRecordId] = useState('');

    const handleClose = () => {
        axios.delete(`http://localhost:8000/event_record/${selectedEventRecordId}`)
            .then(response => {
                setEventRecordData(prevData => prevData.filter(record => record.id !== selectedEventRecordId));
            })
            .catch((error) => {
                console.log(error);
            });
        onClose();
    };

    const handleInputChange = (newValue) => {
        setSelectedEventRecordId(newValue);
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <Autocomplete
                            required
                            id="event-record-select"
                            options={eventRecordIds}
                            value={selectedEventRecordId}
                            onChange={(event, newValue) => handleInputChange(newValue)}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Event Record IDs" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Remove Event Record
                </Button>
            </DialogActions>
        </Dialog>
    );
}

RemoveEventRecordPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    setEventRecordData: PropTypes.func.isRequired,
    eventRecordIds: PropTypes.array.isRequired,
};

function AddCompetitionPopup(props) {
    const {open, onClose, setCompetitionData, setCompetitionNames} = props;

    const handleClose = () => {
        axios.post('http://localhost:8000/competitions/', {
            name: document.getElementById('name').value,
            sanctioned: document.getElementById('sanctioned').checked,
            start_date: document.getElementById('start_date').value,
            end_date: document.getElementById('end_date').value,
        })
        .then(response => {
            axios.get('http://localhost:8000/competitions/')  
                .then(response => {
                    setCompetitionNames(response.data.map(competition => competition.name));
                    setCompetitionData(response.data);
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
                <Grid container spacing = {2}>
                    <Grid item xs = {6}>
                        <TextField required id="name" label="Name" variant="outlined" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs = {6}>
                        <FormControlLabel
                            control={<Checkbox required id='sanctioned' />}
                            label="Sanctioned"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField required id="start_date" type='date' label="Start Date" variant="outlined" InputLabelProps={{ shrink: true }} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField required id="end_date" type='date' label="End Date" variant="outlined" InputLabelProps={{ shrink: true }} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Add Competition
                </Button>
            </DialogActions>
        </Dialog>
    )
}

AddCompetitionPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
}

function RemoveCompetitionPopup(props) {
    const { open, onClose, setCompetitionData, setCompetitionNames, competitionNames} = props;
    const [competition, setCompetition] = useState('');
    //const [competitionNames, setCompetitionNames] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/competitions/')
        .then(response => {
            const names = response.data.map(competition => competition.name);
            setCompetitionNames(names);
        })
        .catch((error) => {
            console.log(error);
        });
    }, []);

    const handleClose = () => {
        axios.delete(`http://localhost:8000/competitions/${competition}`)
            .then(response => {
                // Update competition names after deletion
                setCompetitionNames(prevNames => prevNames.filter(name => name !== competition));
                axios.get('http://localhost:8000/competitions/')
                    .then(response => {
                        setCompetitionData(response.data);
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

    const handleInputChange = (newValue) => {
        setCompetition(newValue);
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogContent >
            <DialogContentText variant="h6" style={{ marginBottom: '20px' }}>Remove Competition</DialogContentText>
                <Grid container spacing={2}>
                    <Grid item>
                        <Autocomplete
                            required
                            id="competition-select"
                            options={competitionNames}
                            value={competition}
                            onChange={(event, newValue) => handleInputChange(newValue)}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Competitions" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                    Remove Competition
                </Button>
            </DialogActions>
        </Dialog>
    )
}

RemoveCompetitionPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    setCompetitionData: PropTypes.func.isRequired,
}

export default function CoachPage(props) {
    const [userData, setUserData] = useState([{}]);

    const [AddCompetitionPopupOpen, setAddCompetitionPopupOpen] = useState(false);
    const [RemoveCompetitionPopupOpen, setRemoveCompetitionPopupOpen] = useState(false);

    const [AddEventRecordPopupOpen, setAddEventPopupOpen] = useState(false);
    const [RemoveEventRecordPopupOpen, setRemoveEventRecordPopupOpen] = useState(false);

    const [eventRecordData, setEventRecordData] = useState([]);
    const [eventRecordIds, setEventRecordIds] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [competitionNames, setCompetitionNames] = useState([]);

    //add event record
    const handleAddEventClickOpen = () => {
        setAddEventPopupOpen(true);
    };

    const handleAddEventClickClose = () => {
        setAddEventPopupOpen(false);
    };

    //remove event record
    const handleRemoveEventClickOpen = () => {
        setRemoveEventRecordPopupOpen(true);
    };
    
    const handleRemoveEventClickClose = () => {
        setRemoveEventRecordPopupOpen(false);
    };

    //add comp
    const handleAddCompetitionClickOpen = () => {
        setAddCompetitionPopupOpen(true);
    };

    const handleAddCompetitionClickClose = () => {
        setAddCompetitionPopupOpen(false);
    };

    //remove comp
    const handleRemoveCompetitionClickOpen = () => {
        setRemoveCompetitionPopupOpen(true);
    };

    const handleRemoveCompetitionClickClose = () => {
        setRemoveCompetitionPopupOpen(false);
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
                                    <TableCell>Event Record ID</TableCell>
                                    <TableCell>Swimmer Email</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Distance</TableCell>
                                    <TableCell>Stroke</TableCell>
                                    <TableCell>Course</TableCell>
                                    <TableCell>Competition</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {eventRecordData.map((event_record) => (
                                    <TableRow key={event_record.id}>
                                        <TableCell>{event_record.id}</TableCell>
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
                            <Button variant="outlined" onClick={handleAddEventClickOpen}>Add Event Record</Button>
                            <Button variant="outlined" onClick={handleRemoveEventClickOpen}>Remove Event Record</Button>
                        </Box>
                            <AddEventRecordPopup 
                                open={AddEventRecordPopupOpen} 
                                onClose={handleAddEventClickClose} 
                                setEventRecordData={setEventRecordData}
                                competitionNames={competitionNames}
                                setCompetitionNames={setCompetitionNames}
                                setCompetitionData={setCompetitionData} />
                            <RemoveEventRecordPopup
                                open={RemoveEventRecordPopupOpen}
                                onClose={handleRemoveEventClickClose}
                                setEventRecordData={setEventRecordData}
                                eventRecordIds={eventRecordData.map(record => record.id)}/>     
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
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleAddCompetitionClickOpen}>Add Competition</Button>
                            <Button variant="outlined" onClick={handleRemoveCompetitionClickOpen}>Remove Competition</Button>
                        </Box>
                        <AddCompetitionPopup 
                            open={AddCompetitionPopupOpen} 
                            onClose={handleAddCompetitionClickClose} 
                            setCompetitionData={setCompetitionData} 
                            setCompetitionNames = {setCompetitionNames}/>
                        <RemoveCompetitionPopup 
                            open={RemoveCompetitionPopupOpen} 
                            onClose={handleRemoveCompetitionClickClose} 
                            setCompetitionData={setCompetitionData} 
                            setCompetitionNames = {setCompetitionNames}
                            competitionNames = {competitionNames}/>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}