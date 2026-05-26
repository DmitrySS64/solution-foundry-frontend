const { WebSocketServer } = require('ws');
const { setupWSConnection } = require('@y/websocket-server/utils');
const http = require('http');

// HTTP server for health check
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
    console.log(`[Server] Client connected to: ${req.url}`);
    setupWSConnection(ws, req, { gc: true });
});

const PORT = 1234;
server.listen(PORT, () => {
    console.log(`[Server] Yjs WebSocket server running on ws://localhost:${PORT}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/health`);
});
