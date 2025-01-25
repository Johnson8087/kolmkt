import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert
} from '@mui/material';
import { getProfile, updateProfile } from '../services/api';

const ProfileEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);  // Add loading state

    const loadProfile = useCallback(async () => {
        try {
            const response = await getProfile(id);
            setProfile(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
            setError('Error loading profile');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]); // Add loadProfile to the dependencies array

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(id, profile);
            setSuccess('Profile updated successfully');
            setTimeout(() => navigate(`/profile/${id}`), 2000);
        } catch (error) {
            setError(error.response?.data?.error || 'Error updating profile');
        }
    };
    
    if (loading) return <Typography>Loading...</Typography>;
    if (!profile) return <Typography>Profile not found</Typography>;

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Edit Profile
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Category"
                        value={profile.category}
                        onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Introduction"
                        value={profile.introduction}
                        onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                            Save Changes
                        </Button>
                        <Button onClick={() => navigate(`/profile/${id}`)} variant="outlined">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default ProfileEdit;