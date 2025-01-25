import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
        >
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>{message}</Typography>
        </Box>
    );
};

export default LoadingSpinner;