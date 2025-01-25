import React from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@mui/material';

const SearchFilters = ({ filters, onFilterChange }) => {
    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        label="Search by Name"
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            value={filters.sortBy}
                            label="Sort By"
                            onChange={(e) => onFilterChange('sortBy', e.target.value)}
                        >
                            <MenuItem value="followers">Followers</MenuItem>
                            <MenuItem value="reels">Average Reel Views</MenuItem>
                            <MenuItem value="date">Date Added</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filters.category}
                            label="Category"
                            onChange={(e) => onFilterChange('category', e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Influencer">Influencer</MenuItem>
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Creator">Creator</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchFilters;