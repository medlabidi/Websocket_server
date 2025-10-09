const { SerialPort } = require('serialport');
const Printer = require('./printer');
const { MANUFACTURERS } = require('./config');

class PrinterManager {
  constructor() {
    this.printers = []; // List of connected printers
  }

  async detectPrinters() {
    const ports = await SerialPort.list();

    if (ports.length === 0) {
      console.log('No printers detected.');
      return [];
    }

    // Filter ports by known manufacturers (optional)
    const printerPorts = ports.filter(p =>
      p.manufacturer && MANUFACTURERS.some(m => p.manufacturer.toLowerCase().includes(m))
    );

    if (printerPorts.length === 0) {
      console.log('No recognized 3D printers found. Showing all ports instead.');
    }

    const selectedPorts = printerPorts.length ? printerPorts : ports;

    // Create Printer instances
    this.printers = selectedPorts.map((p, i) => new Printer(i + 1, p));

    console.log(`Detected ${this.printers.length} printer(s).`);
    this.printers.forEach(p => console.log(`  [${p.id}] ${p.portInfo.path} (${p.portInfo.manufacturer || 'Unknown'})`));

    return this.printers;
  }

  async connectAll() {
    for (const printer of this.printers) {
      await printer.connect();
    }
  }

  getPrinterById(id) {
    return this.printers.find(p => p.id === id);
  }

  closeAll() {
    this.printers.forEach(p => p.close());
  }
}

module.exports = PrinterManager;
