// ... existing imports ...
const path = require('path');

// ... other middleware ...

// Serve static files from the uploads directory
app.use('/uploads', express.static('/www/wwwroot/instgram-project/web_app/backend/uploads', {
    setHeaders: (res, path) => {
        res.set('Access-Control-Allow-Origin', '*');
    }
}));