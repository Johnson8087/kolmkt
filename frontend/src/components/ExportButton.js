import React from 'react';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportButton = ({ data }) => {
    const handleExport = () => {
        const exportData = data.map(profile => ({
            Name: profile.name,
            Category: profile.category,
            Followers: profile.followers,
            Posts: profile.posts,
            Following: profile.following,
            'Average Reel Views': profile.average_reel_views,
            'Highest Reel Views': profile.highest_reel_views,
            'Reels Analyzed': profile.reels_analyzed,
            'Created At': new Date(profile.created_at).toLocaleDateString()
        }));

        const csv = [
            Object.keys(exportData[0]),
            ...exportData.map(row => Object.values(row))
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `instagram_profiles_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
        >
            Export to CSV
        </Button>
    );
};

export default ExportButton;