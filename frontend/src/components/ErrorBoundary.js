import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container maxWidth="sm">
                    <Box sx={{ mt: 8, textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            Something went wrong
                        </Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => window.location.reload()}
                            sx={{ mt: 2 }}
                        >
                            Reload Page
                        </Button>
                    </Box>
                </Container>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;