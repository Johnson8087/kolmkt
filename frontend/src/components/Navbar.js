import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, cursor: 'pointer' }}
                        onClick={() => navigate('/profiles')}
                    >
                        Instagram Analytics
                    </Typography>
                    
                    {user ? (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button 
                                color="inherit" 
                                onClick={() => navigate('/profiles')}
                            >
                                Profiles
                            </Button>
                            
                            {user.role === 'admin' && (
                                <Button 
                                    color="inherit" 
                                    onClick={() => navigate('/admin')}
                                >
                                    Admin
                                </Button>
                            )}
                            
                            <Button 
                                color="inherit" 
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Button 
                            color="inherit" 
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </Button>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;