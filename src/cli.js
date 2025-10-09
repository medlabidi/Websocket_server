const readline = require('readline');
const { PROMPT } = require('./config');

function startCLI(manager) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: PROMPT
  });

  console.log('Type commands in this format:');
  console.log('  [printer_id] GCODE');
  console.log('Example: 1 M105  (send M105 to printer 1)');
  console.log('Type "list" to show printers, or "exit" to quit.');
  console.log('---------------------------------------------');

  rl.prompt();

  rl.on('line', line => {
    const input = line.trim();

    if (input.toLowerCase() === 'exit') {
      manager.closeAll();
      rl.close();
      return;
    }

    if (input.toLowerCase() === 'list') {
      manager.printers.forEach(p => console.log(`[${p.id}] ${p.portInfo.path}`));
      rl.prompt();
      return;
    }

    // Parse: [id] [command]
    const parts = input.split(' ');
    const id = parseInt(parts.shift());
    const command = parts.join(' ');

    const printer = manager.getPrinterById(id);
    if (!printer) {
      console.log(`Printer ${id} not found.`);
    } else {
      printer.sendCommand(command);
    }

    rl.prompt();
  });
}

module.exports = startCLI;
