import React, { useState, useEffect } from "react";
import { Grid, AppBar, Typography } from "@mui/material";

export default function DisplayAppBar(props) {

    return (
        <AppBar position="static" color="transparent" variant="outlined" elevation={0}>
            <Grid container justifyContent="center" alignItems="center" spacing={8}>
                <Grid item>
                    <Typography variant="h3">
                        University of Calgary Dinos Swimming
                    </Typography>                    
                </Grid>
            </Grid>
        </AppBar>
    );
};
