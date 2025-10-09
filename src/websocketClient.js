const WebSocket = require('ws');

// PrinterManager handles all connected printers
const PrinterManager = require('./printerManager');

const PORT = 3000; // WebSocket server port

async function startWebSocketServer(manager) {
  if (!manager) throw new Error('PrinterManager instance is required');

  // Create WebSocket server
  const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
  });

  // Handle new client connections
  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Receive commands from client 
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        const { printerId, command } = data;

        const printer = manager.getPrinterById(printerId);
        if (printer) {
          console.log(`[Client → Printer ${printerId}] ${command}`);
          printer.sendCommand(command);
        } else {
          console.log(`Printer ${printerId} not found.`);
        }
      } catch (err) {
        console.error('Invalid message format:', message);
      }
    });

    ws.on('close', () => console.log('Client disconnected'));
  });

  // Relay printer responses to all connected clients
  manager.printers.forEach((printer) => {
    printer.parser.on('data', (line) => {
      const response = {
        printerId: printer.id,
        response: line.trim()
      };
      // Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }
      });
    });
  });
}

module.exports = startWebSocketServer;
