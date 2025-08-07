# TrendSniper API Caller

A web interface to trigger UiPath Orchestrator processes with custom parameters.

## Features

- Simple web interface for UiPath process triggering
- Configurable parameters (Share Count, Run Time, Email)
- Input validation and error handling
- Backend proxy to avoid CORS issues

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

## Configuration

Update the UiPath API configuration in `server.js`:
- `url`: Your UiPath Orchestrator endpoint
- `Authorization`: Your Bearer token

## Deployment Options

### Option 1: GitHub Pages (Frontend Only)
For frontend-only deployment, use the static version in `/docs` folder.

### Option 2: Full Stack Deployment
Deploy to platforms like Heroku, Vercel, or Railway for full backend functionality.

## API Parameters

The application accepts these parameters:
- `in_shareCount`: Number of shares to process
- `in_runTime`: Runtime duration
- `in_email`: Email address for notifications

## Security Note

⚠️ **Important**: Never commit real Bearer tokens to public repositories. Use environment variables for sensitive data.
