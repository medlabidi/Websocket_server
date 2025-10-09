// testServer.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log('Received from client:', message);

    // Echo back message for testing
    ws.send(JSON.stringify({ printerId: 1, response: 'ok from server' }));
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log('WebSocket server running on ws://localhost:3000');
