# Happy Wedding Website

A beautiful wedding invitation website with wish functionality.

## Features

- Wedding countdown timer
- Photo album slider
- Love story timeline
- **Wish system with server-side storage**
- Background music
- Responsive design
- Snowfall animation

## Setup Instructions

### Prerequisites
- Node.js installed on your system

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## How the Wish System Works

The wish system now saves messages to a server instead of just localStorage:

- **Server-side storage**: Wishes are saved in `wishes.json` file
- **API endpoints**: 
  - `GET /api/wishes` - Retrieve all wishes
  - `POST /api/wishes` - Submit a new wish
  - `DELETE /api/wishes/:id` - Delete a wish (admin)
- **Fallback**: If server is unavailable, wishes fall back to localStorage
- **Backup**: Wishes are also saved to localStorage as backup

## File Structure

```
happy-wedding/
├── index.html          # Main HTML file
├── server.js           # Node.js server for wish API
├── package.json        # Node.js dependencies
├── wishes.json         # Wishes storage (created automatically)
├── assets/
│   ├── css/
│   │   └── style.css   # Styles
│   ├── js/
│   │   └── main.js     # Frontend JavaScript
│   ├── album/          # Wedding photos
│   └── ...             # Other assets
```

## API Endpoints

### Get All Wishes
```
GET /api/wishes
```

Returns an array of wish objects:
```json
[
  {
    "id": "1640995200000",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Congratulations!",
    "timestamp": 1640995200000
  }
]
```

### Submit New Wish
```
POST /api/wishes
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "message": "Wishing you both a lifetime of happiness!"
}
```

### Health Check
```
GET /api/health
```

## Deployment

For production deployment:

1. Set the PORT environment variable:
```bash
export PORT=80
npm start
```

2. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name "wedding-server"
```

## Troubleshooting

### Wishes not saving?
- Check if the server is running on the correct port
- Check browser console for error messages
- Verify `wishes.json` file is being created in the project root

### Server not starting?
- Make sure Node.js is installed
- Check if port 3000 is available
- Run `npm install` to install dependencies

### CORS issues?
The server includes CORS middleware for local development. For production, you may need to configure specific origins.

## License

MIT License
