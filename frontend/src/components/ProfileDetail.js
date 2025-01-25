import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, 
    Card, 
    CardContent, 
    Typography, 
    CardMedia,
    Grid,
    Box
} from '@mui/material';
import { getProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProfileDetail = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const { id } = useParams();

    const loadProfile = useCallback(async () => {
        try {
            const response = await getProfile(id);
            setProfile(response.data);
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }, [id]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    if (!profile) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Card>
                <CardMedia
                    component="img"
                    height="300"
                    image={profile.profile_image}
                    alt={profile.name}
                />
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {profile.name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6">{profile.posts}</Typography>
                                <Typography color="text.secondary">Posts</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6">{profile.followers}</Typography>
                                <Typography color="text.secondary">Followers</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box textAlign="center">
                                <Typography variant="h6">{profile.following}</Typography>
                                <Typography color="text.secondary">Following</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 3 }}>Category</Typography>
                    <Typography color="text.secondary" gutterBottom>
                        {profile.category}
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Introduction</Typography>
                    <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {profile.introduction}
                    </Typography>
                    
                    {profile.reels_analyzed > 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Reels Performance</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h6">{profile.reels_analyzed}</Typography>
                                        <Typography color="text.secondary">Reels Analyzed</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h6">
                                            {profile.highest_reel_views?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography color="text.secondary">Highest Views</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box textAlign="center">
                                        <Typography variant="h6">
                                            {profile.average_reel_views?.toLocaleString() || 0}
                                        </Typography>
                                        <Typography color="text.secondary">Average Views</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {user?.role === 'admin' && (
                        <Box sx={{ mt: 3, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                            <Typography variant="h6" gutterBottom>
                                Internal Notes
                            </Typography>
                            <Typography color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                                {profile.internal_note || 'No internal notes available.'}
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProfileDetail;