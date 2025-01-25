import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Container, 
    Grid,
    Pagination as MuiPagination,
    Card,
    CardContent,
    Typography,
    CardMedia,
    Button,
    Box,
    Paper
    // Remove Alert since it's not used
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';  // Update this import
import SearchFilters from './SearchFilters';
import LoadingSpinner from './LoadingSpinner';
// Remove this import
// import defaultProfileImage from '../assets/default-profile.png';

// Add this constant at the top of your file, after imports
// Replace the placeholder URL with a data URL
const defaultProfileImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

const ProfileList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add this line
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'followers',
        category: ''
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        const loadProfiles = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get('/api/profiles');
                if (response && response.data) {
                    setProfiles(response.data);
                } else {
                    setError('No data received from server');
                }
            } catch (err) {
                console.error('Failed to load profiles:', err);
                setError(err.message || 'Failed to load profiles');
            } finally {
                setLoading(false);
            }
        };
    
        loadProfiles();
    }, []); // Remove nested useEffect

    const getStatistics = useCallback(() => {
        if (!profiles.length) {
            console.log('No profiles available for statistics');
            return {
                totalProfiles: 0,
                totalFollowers: 0,
                averageViews: 0,
                categories: 0,
                topInfluencer: { name: 'N/A', followers: '0' }
            };
        }

        return {
            totalProfiles: profiles.length,
            totalFollowers: profiles.reduce((sum, p) => {
                const followers = parseInt((p.followers || '0').replace(/[^0-9]/g, ''));
                return sum + (isNaN(followers) ? 0 : followers);
            }, 0),
            averageViews: Math.round(
                profiles.reduce((sum, p) => sum + (parseInt(p.average_reel_views) || 0), 0) / profiles.length
            ),
            categories: [...new Set(profiles.filter(p => p.category).map(p => p.category))].length,
            topInfluencer: profiles.reduce((max, p) => {
                const currentFollowers = parseInt((p.followers || '0').replace(/[^0-9]/g, ''));
                const maxFollowers = parseInt((max.followers || '0').replace(/[^0-9]/g, ''));
                return (currentFollowers > maxFollowers) ? p : max;
            }, profiles[0] || { name: 'N/A', followers: '0' }),
        };
    }, [profiles]);

    useEffect(() => {
        if (profiles.length > 0) {
            console.log('Statistics:', getStatistics());
        }
    }, [profiles, getStatistics]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <LoadingSpinner />;

    const filteredProfiles = profiles
        .filter(profile => {
            const matchesSearch = profile.name.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = !filters.category || profile.category === filters.category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'followers':
                    return parseInt(b.followers.replace(/,/g, '')) - parseInt(a.followers.replace(/,/g, ''));
                case 'reels':
                    return (b.average_reel_views || 0) - (a.average_reel_views || 0);
                case 'date':
                    return new Date(b.created_at) - new Date(a.created_at);
                default:
                    return 0;
            }
        });

    const paginatedProfiles = filteredProfiles.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    // Delete the first getImageUrl function that's here
    
    // Keep only this version of getImageUrl
    const getImageUrl = (profileImage) => {
        if (!profileImage) return defaultProfileImage;
        // If it's a local path starting with /uploads
        if (profileImage.startsWith('/uploads')) {
            // Direct path to uploads directory, no need for /backend prefix
            return `http://142.171.199.20:4001${profileImage}`;
        }
        // Fallback to the original URL if it's an external URL
        return profileImage;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Remove comment from JSX and use proper braces */}
            {profiles.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Statistics Dashboard */}
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Total Profiles</Typography>
                            <Typography variant="h4">{getStatistics().totalProfiles}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Total Followers</Typography>
                            <Typography variant="h4">
                                {getStatistics().totalFollowers.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Avg. Reel Views</Typography>
                            <Typography variant="h4">
                                {getStatistics().averageViews.toLocaleString()}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Paper sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="h6">Categories</Typography>
                            <Typography variant="h4">{getStatistics().categories}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>Top Influencer</Typography>
                            <Typography>
                                {getStatistics().topInfluencer.name} ({getStatistics().topInfluencer.followers} followers)
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Existing search filters and profile grid remain the same */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            if (filteredProfiles.length === 0) {
                                return;
                            }
                            
                            const csv = filteredProfiles.map(p => ({
                                ID: p.id,
                                Name: p.name,
                                Category: p.category || '',
                                Posts: p.posts || '0',
                                Followers: p.followers || '0',
                                Following: p.following || '0',
                                Introduction: p.introduction || '',
                                'Reels Analyzed': p.reels_analyzed || '0',
                                'Highest Reel Views': p.highest_reel_views || '0',
                                'Average Reel Views': p.average_reel_views || '0',
                                'Created At': p.created_at,
                                'Updated At': p.updated_at
                            }));
                            
                            const csvString = [
                                Object.keys(csv[0]).join(','),
                                ...csv.map(row => Object.values(row).join(','))
                            ].join('\n');
                            
                            const blob = new Blob([csvString], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'profiles.csv';
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }}
                        disabled={filteredProfiles.length === 0}
                    >
                        Export CSV
                    </Button>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        style={{ padding: '8px' }}
                    >
                        <option value={12}>12 per page</option>
                        <option value={24}>24 per page</option>
                        <option value={48}>48 per page</option>
                    </select>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {paginatedProfiles.map((profile) => (
                    <Grid item key={profile.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={getImageUrl(profile.profile_image)}
                                alt={profile.name}
                                sx={{ 
                                    objectFit: 'cover',
                                    backgroundColor: 'grey.100'
                                }}
                                onError={(e) => {
                                    console.log('Image load error for:', profile.profile_image);
                                    e.target.onerror = null;
                                    e.target.src = defaultProfileImage;
                                }}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {profile.name}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Posts: {profile.posts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Followers: {profile.followers}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Following: {profile.following}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Category: {profile.category || 'N/A'}
                                    </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {profile.introduction || 'No introduction available'}
                                </Typography>
                                
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Reels Analyzed: {profile.reels_analyzed || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Highest Reel Views: {profile.highest_reel_views?.toLocaleString() || 0}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Avg. Reel Views: {profile.average_reel_views?.toLocaleString() || 0}
                                    </Typography>
                                </Box>
                                
                                <Typography variant="caption" color="text.secondary" display="block">
                                    Created: {new Date(profile.created_at).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                    Updated: {new Date(profile.updated_at).toLocaleDateString()}
                                </Typography>
                                
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => navigate(`/profile/${profile.id}`)}
                                    >
                                        View Details
                                    </Button>
                                    {user?.role === 'admin' && (
                                        <Button 
                                            variant="outlined"
                                            onClick={() => navigate(`/profile/edit/${profile.id}`)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <MuiPagination  // Use renamed Material-UI Pagination
                    count={Math.ceil(filteredProfiles.length / rowsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Container>
    );
};

export default ProfileList;