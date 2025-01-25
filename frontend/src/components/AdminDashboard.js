import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Alert,
    AppBar,
    Toolbar
} from '@mui/material';
import { getUsers } from '../services/api';  // Remove registerUser import
import api from '../services/api';  // Add this import

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Remove the unused loading variable if you're not using it
    
    useEffect(() => {
        loadUsers();
    }, []);

    const [loading, setLoading] = useState(true);

        const loadUsers = async () => {
            setLoading(true);
            try {
                console.log('Fetching users...');
                const response = await getUsers();
                console.log('API Response:', response);
                if (response.data) {
                    setUsers(response.data);
                } else {
                    setError('No data received from server');
                }
            } catch (error) {
                console.error('Error loading users:', error);
                setError(error.response?.data?.message || 'Error loading users');
            } finally {
                setLoading(false);
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/users/register', newUser);
            console.log('User registration response:', response);
            setSuccess('User created successfully');
            setNewUser({ username: '', password: '', role: 'user' });
            loadUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            console.error('Registration error:', error);
            setError(error.response?.data?.error || 'Error creating user');
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Instagram Analytics
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/profiles')}>
                        Profiles
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/admin')}>
                        Admin
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/logout')}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            
            <Container maxWidth="md">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Admin Dashboard
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            Create New User
                        </Typography>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                margin="normal"
                                required
                            />
                            <TextField
                                select
                                fullWidth
                                label="Role"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                margin="normal"
                                SelectProps={{
                                    native: true,
                                }}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </TextField>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 2 }}
                            >
                                Create User
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h6" gutterBottom>
                            User Management
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => {/* TODO: Implement delete user */}}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default AdminDashboard;