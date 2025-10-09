const PrinterManager = require('./printerManager');
const startCLI = require('./cli');
const startWebSocketClient = require('./websocketClient');

async function main() {
  const manager = new PrinterManager();
  await manager.detectPrinters();
  await manager.connectAll();

  startCLI(manager);                 // Start local CLI
  startWebSocketClient(manager);     // Pass the manager to the WebSocket client
}

main();
