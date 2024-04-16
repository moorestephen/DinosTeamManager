import React, { useState, useEffect } from "react";
import { Grid, Typography } from '@mui/material';

export default function UserInformation(props) {

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5">
                    User: {props.email} (Role: {props.role})
                </Typography>
            </Grid>
        </Grid>
    );
};
