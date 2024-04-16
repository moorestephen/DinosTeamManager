import React, { useState, useEffect } from "react";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
import { Grid, Typography } from '@mui/material';


export default function UserInformation(props) {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">
                    User: {props.name} (Role: {props.role})
                </Typography>
            </Grid>
        </Grid>
    );
};
