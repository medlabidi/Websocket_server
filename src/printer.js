const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { BAUD_RATE } = require('./config');

class Printer {
  constructor(id, portInfo) {
    this.id = id;                  // Unique identifier (index)
    this.portInfo = portInfo;      // Serial port details
    this.port = null;
    this.parser = null;
  }

  async connect() {
    this.port = new SerialPort({ path: this.portInfo.path, baudRate: BAUD_RATE });
    this.parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    this.port.on('open', () =>
      console.log(`[Printer ${this.id}] Connected on ${this.portInfo.path}`)
    );

    this.parser.on('data', data =>
      console.log(`[Printer ${this.id}] → ${data.trim()}`)
    );

    this.port.on('error', err =>
      console.error(`[Printer ${this.id}] Serial error:`, err.message)
    );

    this.port.on('close', () =>
      console.log(`[Printer ${this.id}] Connection closed.`)
    );
  }

  sendCommand(command) {
    if (!this.port) throw new Error(`Printer ${this.id} not connected.`);
    this.port.write(command + '\n');
  }

  close() {
    if (this.port) this.port.close();
  }
}

module.exports = Printer;
