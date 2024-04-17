import React, { useState, useEffect } from "react";
import axios from 'axios';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import DisplayAppBar from "./DisplayAppBar.js";
import UserInformation from "./UserInformation.js";

import { Paper, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,
         Button, Box, Dialog, DialogContent, TextField, DialogTitle, DialogActions, 
         DialogContentText, FormControlLabel, Checkbox,  } from '@mui/material';

function AddSwimmerPopup(props) {
    const { open, onClose, setSwimmerData } = props;
    const [ groups, setGroups ] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/group-names/')
        .then(response => {
            setGroups(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        }, []);

    const handleClose = () => {
        const email = document.getElementById('email').value;
        const dob = document.getElementById('dob').value;
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const group = document.getElementById('group-select').value;

        axios.post('http://localhost:8000/create-user/', {
            email: email,
            username: email,
            password: "password"
        })
        .then(response => {
            axios.post('http://localhost:8000/swimmers/', {
                email: email,
                dob: dob,
                fname: fname,
                lname: lname,
                user: response.data.id,
                club: "Dinos"
            })
            .then(response => {
                axios.post('http://localhost:8000/swimmers-group/', {
                    "swimmer": email,
                    "group": group
                })
                .then(response => {
                    axios.get('http://localhost:8000/swimmers-and-group/')
                        .then(response => {
                            setSwimmerData(response.data);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
            })
        }) 
        
        onClose();

    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent >
                <DialogContentText variant="h6" style={{ marginBottom: '20px' }}>Add Swimmer</DialogContentText>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField required id="email" label="Email" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="fname" label="First Name" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="lname" label="Last Name" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="dob" type="date" label="Birthdate" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <Autocomplete
                            required
                            id="group-select"
                            options={groups}
                            getOptionLabel={(option) => option.name}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Group" variant="outlined" />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} >
                    Add Swimmer
                </Button>
            </DialogActions>
        </Dialog>
    )
}

AddSwimmerPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

function AddCoachPopup(props) {
    const {open, onClose, setCoachData} = props;

    const handleClose = () => {
        const email = document.getElementById('email').value;
        const fname = document.getElementById('fname').value;
        const lname = document.getElementById('lname').value;
        const tenure_start = document.getElementById('tenure_start').value;
        const contract_start = document.getElementById('contract_start').value;

        axios.post('http://localhost:8000/create-user/', {
            email: email,
            username: email,
            password: "password"
        })
        .then(response => {
            axios.post('http://localhost:8000/coaches/', {
                email: email,
                fname: fname,
                lname: lname,
                tenure_start: tenure_start,
                contract_start: contract_start,
                user: response.data.id,
                club: "Dinos"
            })
            .then(response => {
                axios.get('http://localhost:8000/coaches/')
                    .then(response => {
                        setCoachData(response.data);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })

        })
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogContent >
            <DialogContentText variant="h6" style={{ marginBottom: '20px' }}>Add Coach</DialogContentText>
                <Grid container spacing={2}>
                    <Grid item>
                        <TextField required id="email" label="Email" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="fname" label="First Name" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="lname" label="Last Name" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="tenure_start" type="date" label="Tenure Start" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                    <Grid item>
                        <TextField required id="contract_start" type="date" label="Contract Start" variant="outlined" InputLabelProps={{shrink: true}}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={handleClose} >
                    Add Coach
                </Button>
            </DialogActions>
        </Dialog>
    
    )
}

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


export default function AdministratorPage(props) {
    const [userData, setUserData] = useState([]);

    const [swimmerData, setSwimmerData] = useState([]);
    const [coachData, setCoachData] = useState([]);
    const [groupCoachData, setGroupCoachData] = useState([]);
    const [competitionData, setCompetitionData] = useState([]);
    const [competitionNames, setCompetitionNames] = useState([]);

    const [addSwimmerPopupOpen, setAddSwimmerPopupOpen] = useState(false);
    const [addCoachPopupOpen, setAddCoachPopupOpen] = useState(false);

    const [AddCompetitionPopupOpen, setAddCompetitionPopupOpen] = useState(false);
    const [RemoveCompetitionPopupOpen, setRemoveCompetitionPopupOpen] = useState(false);

    const navigate = useNavigate();

    //add swimmer
    const handleAddSwimmerClickOpen = () => {
        setAddSwimmerPopupOpen(true);
    };

    const handleAddSwimmerClose = () => {
        setAddSwimmerPopupOpen(false);
    };

    //add coach
    const handleAddCoachClickOpen = () => { 
        setAddCoachPopupOpen(true);
    };

    const handleAddCoachClose = () => {
        setAddCoachPopupOpen(false);
    };

    //add competition
    const handleAddCompetitionClickOpen = () => { 
        setAddCompetitionPopupOpen(true);
    };

    const handleAddCompetitionClickClose = () => {
        setAddCompetitionPopupOpen(false);
    };

    //remove competition
    const handleRemoveCompetitionClickOpen = () => { 
        setRemoveCompetitionPopupOpen(true);
    };

    const handleRemoveCompetitionClickClose = () => {
        setRemoveCompetitionPopupOpen(false);
    };



    useEffect(() => {

        // Navigate back to login page if user not logged in
        /*
        axios.get("http://localhost:8000/check-login-status/", {withCredentials: true})
        .then(response => {
            if (!response.data['is_authenticated']) {
                navigate('/'); // Navigate to login page if not logged in
            }
        })
        .catch(error => {
            console.log(error);
        })

        // Direct to appropriate page if they are logged in but on the wrong page
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

        // Pull user info for display and reference
        axios.get('http://localhost:8000/user-info/', {withCredentials : true})
        .then(response => {
            setUserData(response.data);
            console.log(response)
        })
        .catch((error) => {
            console.log(error);
        });*/

        axios.get('http://localhost:8000/swimmers-and-group/')
        .then(response => {
            setSwimmerData(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

        axios.get('http://localhost:8000/coaches/')
        .then(response => {
            setCoachData(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

        axios.get('http://localhost:8000/coach-and-group/')
        .then(response => {
            setGroupCoachData(response.data);
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
                        <UserInformation email={userData.email} role={userData.role}/>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper variant="outlined" spacing={1}>
                        <Typography variant='h6'>Swimmers</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Birthdate</TableCell>
                                <TableCell>Group</TableCell>
                            </TableHead>
                            <TableBody>
                                {swimmerData.map((swimmer) => (
                                    <TableRow key={swimmer.email}>
                                        <TableCell>{swimmer.fname} {swimmer.lname}</TableCell>
                                        <TableCell>{swimmer.email}</TableCell>
                                        <TableCell>{swimmer.dob}</TableCell>
                                        <TableCell>{swimmer.group_id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleAddSwimmerClickOpen}>Add Swimmer</Button>
                            <AddSwimmerPopup open={addSwimmerPopupOpen} onClose={handleAddSwimmerClose} setSwimmerData={setSwimmerData} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper variant="outlined">
                        <Typography variant='h6'>Coaches</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Tenure Start</TableCell>
                                <TableCell>Contract Start</TableCell>
                            </TableHead>
                            <TableBody>
                                {coachData.map((coach) => (
                                    <TableRow key={coach.email}>
                                        <TableCell>{coach.fname} {coach.lname}</TableCell>
                                        <TableCell>{coach.email}</TableCell>
                                        <TableCell>{coach.tenure_start}</TableCell>
                                        <TableCell>{coach.contract_start}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box display="flex" justifyContent="flex-end">
                            <Button variant="outlined" onClick={handleAddCoachClickOpen}>Add Coach</Button>
                            <AddCoachPopup open={addCoachPopupOpen} onClose={handleAddCoachClose} setCoachData={setCoachData} />
                        </Box>
                    </Paper>
                    <Paper variant="outlined">
                        <Typography variant='h6'>Groups and Coaches</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableCell>Group</TableCell>
                                <TableCell>Coach</TableCell>
                            </TableHead>
                            <TableBody>
                                {groupCoachData.map((groupCoach) => (
                                    <TableRow key={groupCoach.group_id}>
                                        <TableCell>{groupCoach.group_id}</TableCell>
                                        <TableCell>{groupCoach.fname} {groupCoach.lname}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
};
