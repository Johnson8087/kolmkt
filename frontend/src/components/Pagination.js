import React from 'react';
import { Box, Pagination as MuiPagination, FormControl, Select, MenuItem } from '@mui/material';

const Pagination = ({ page, totalPages, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
    return (
        <Box sx={{ mt: 4, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <FormControl size="small">
                <Select
                    value={rowsPerPage}
                    onChange={(e) => onRowsPerPageChange(e.target.value)}
                >
                    <MenuItem value={12}>12 per page</MenuItem>
                    <MenuItem value={24}>24 per page</MenuItem>
                    <MenuItem value={48}>48 per page</MenuItem>
                </Select>
            </FormControl>
            <MuiPagination 
                count={totalPages} 
                page={page} 
                onChange={(e, value) => onPageChange(value)}
                color="primary"
            />
        </Box>
    );
};

export default Pagination;