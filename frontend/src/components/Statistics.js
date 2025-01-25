import React, { useState } from 'react';
import { Paper, Typography, Grid, Tabs, Tab, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, ScatterChart, Scatter } from 'recharts';

const Statistics = ({ profiles }) => {
    const [currentTab, setCurrentTab] = useState(0);

    // Existing category and follower calculations
    const categoryData = profiles.reduce((acc, profile) => {
        acc[profile.category] = (acc[profile.category] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value
    }));

    // Enhanced follower ranges with engagement metrics
    const followerRanges = profiles.reduce((acc, profile) => {
        const followers = parseInt(profile.followers.replace(/,/g, ''));
        const range = followers < 10000 ? '< 10K' : 
                     followers < 100000 ? '10K-100K' :
                     followers < 1000000 ? '100K-1M' : '> 1M';
        
        if (!acc[range]) {
            acc[range] = {
                count: 0,
                totalViews: 0,
                profiles: []
            };
        }
        
        acc[range].count++;
        acc[range].totalViews += profile.average_reel_views || 0;
        acc[range].profiles.push(profile);
        return acc;
    }, {});

    // Prepare data for charts
    const engagementData = Object.entries(followerRanges).map(([range, data]) => ({
        range,
        avgViews: data.profiles.length ? Math.round(data.totalViews / data.profiles.length) : 0,
        profileCount: data.count
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    // Add performance metrics calculations
    const performanceMetrics = {
        totalProfiles: profiles.length,
        avgFollowers: Math.round(profiles.reduce((acc, p) => acc + parseInt(p.followers.replace(/,/g, '')), 0) / profiles.length),
        avgReelViews: Math.round(profiles.reduce((acc, p) => acc + (p.average_reel_views || 0), 0) / profiles.length),
        topPerformers: profiles
            .sort((a, b) => (b.average_reel_views || 0) - (a.average_reel_views || 0))
            .slice(0, 5)
    };

    // Prepare engagement scatter plot data
    const scatterData = profiles.map(profile => ({
        followers: parseInt(profile.followers.replace(/,/g, '')),
        views: profile.average_reel_views || 0,
        name: profile.name
    }));

    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>Analytics Overview</Typography>
            <Tabs 
                value={currentTab} 
                onChange={(e, newValue) => setCurrentTab(newValue)}
                sx={{ mb: 3 }}
            >
                <Tab label="Distribution" />
                <Tab label="Engagement" />
                <Tab label="Performance" />
            </Tabs>

            {currentTab === 0 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" align="center">Category Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" align="center">Follower Distribution</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={engagementData}>
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="profileCount" fill="#8884d8" name="Number of Profiles" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}

            {currentTab === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center">Average Reel Views by Follower Range</Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={engagementData}>
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip formatter={(value) => value.toLocaleString()} />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="avgViews" 
                                    stroke="#8884d8" 
                                    name="Average Views"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
            {currentTab === 2 && (
                <Grid container spacing={3}>
                    <Grid item xs={12} container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Total Profiles
                                    </Typography>
                                    <Typography variant="h4">
                                        {performanceMetrics.totalProfiles}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Average Followers
                                    </Typography>
                                    <Typography variant="h4">
                                        {performanceMetrics.avgFollowers.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="textSecondary" gutterBottom>
                                        Average Reel Views
                                    </Typography>
                                    <Typography variant="h4">
                                        {performanceMetrics.avgReelViews.toLocaleString()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" align="center" sx={{ mt: 3 }}>
                            Followers vs Reel Views Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis 
                                    dataKey="followers" 
                                    name="Followers" 
                                    type="number"
                                    scale="log"
                                    domain={['auto', 'auto']}
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <YAxis 
                                    dataKey="views" 
                                    name="Average Views"
                                    tickFormatter={(value) => value.toLocaleString()}
                                />
                                <Tooltip 
                                    formatter={(value) => value.toLocaleString()}
                                    labelFormatter={(value) => `Followers: ${parseInt(value).toLocaleString()}`}
                                />
                                <Scatter data={scatterData} fill="#8884d8" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            )}
        </Paper>
    );
};

export default Statistics;