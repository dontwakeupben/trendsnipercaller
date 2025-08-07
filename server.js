const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// UiPath API configuration
const UIPATH_CONFIG = {
    url: 'https://cloud.uipath.com/benangelo/DefaultTenant/orchestrator_/t/de2d5bde-ff58-4576-9e9a-6364e059cd7c/trendsniper',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer rt_3CE36E3BA69146817149CA57669C51A5195B49B77F7247E87E5CC6D9F425ED04-1',
    }
};

// API endpoint to proxy UiPath calls
app.post('/api/uipath', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        // Extract parameters from request body with defaults
        const shareCount = req.body.in_shareCount || req.body.shareCount || 4;
        const runTime = req.body.in_runTime || req.body.runTime || 2;
        const email = req.body.in_email || req.body.email || "default@example.com";

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.error('Invalid email format:', email);
            return res.status(400).json({
                error: 'Invalid email format',
                message: `Email "${email}" is not valid. Please provide a valid email address.`
            });
        }

        // Ensure parameters are the correct type and format
        const validatedPayload = {
            in_runTime: parseInt(runTime),
            in_shareCount: parseInt(shareCount),
            in_email: email.trim().toLowerCase() // Clean up email
        };

        console.log('Validated payload:', validatedPayload);
        console.log('Email validation passed for:', validatedPayload.in_email);

        // Make the request to UiPath
        const response = await fetch(UIPATH_CONFIG.url, {
            method: 'POST',
            headers: UIPATH_CONFIG.headers,
            body: JSON.stringify(validatedPayload)
        });

        console.log('UiPath response status:', response.status);
        console.log('UiPath response headers:', [...response.headers.entries()]);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('UiPath error response:', errorText);

            // Try to parse the error for more details
            let errorDetails = errorText;
            try {
                const errorJson = JSON.parse(errorText);
                errorDetails = errorJson;
                console.error('Parsed UiPath error:', errorJson);
            } catch (e) {
                console.error('Could not parse error as JSON:', e.message);
            }

            return res.status(response.status).json({
                error: 'UiPath API error',
                status: response.status,
                message: errorText,
                details: errorDetails,
                sentPayload: validatedPayload
            });
        }

        const data = await response.json();
        console.log('UiPath success response:', data);

        res.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Open your browser and go to http://localhost:3000');
});
