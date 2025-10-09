# multiprinter local server 
A **Node.js-based CLI tool** that connects to and controls **multiple 3D printers simultaneously** through serial communication.  
It automatically detects connected printers, lets you send G-code commands, and displays real-time printer responses — all from a single terminal interface.

## Features
 **Automatic detection** of connected 3D printers 
 **Multi-printer management** — control many printers at once 
 **Interactive command-line interface** for real-time G-code input
 **ID-based routing** — send commands to a specific printer  
 **Modular architecture** — easy to extend or integrate with web UI 
 **Error handling & clean disconnection** on exit

 ## project structure
 src/
├── app.js # Entry point
├── cli.js # CLI for user interaction
├── printerManager.js # Handles multiple printers
├── printer.js # Represents a single printer
└── config.js # Configuration (baud rate, defaults)

## architecture overview
```text
                          ┌────────────────────────────┐
                          │        User (CLI)          │
                          │   Types commands in CLI    │
                          └────────────┬───────────────┘
                                       │
                             CLI INTERFACE (cli.js)
                                       │
               ┌───────────────────────┴────────────────────────┐
               │ "list" → show printers                         │
               │ "exit" → close all                             │
               │ "[id] GCODE" → send command to a printer       │
               └───────────────────────┬────────────────────────┘
                                       │
                                       ▼
                        ┌──────────────────────────────┐
                        │     PrinterManager Class     │
                        │       (printerManager.js)    │
                        ├──────────────────────────────┤
                        │ - Detects all serial ports   │
                        │ - Creates Printer instances  │
                        │ - Connects / Closes all      │
                        │ - Routes commands to printers│
                        └──────────┬───────────────────┘
                                   │
                 ┌─────────────────┼───────────────────┐
                 │                 │                   │
                 ▼                 ▼                   ▼
       ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
       │  Printer #1     │ │  Printer #2     │ │  Printer #3     │
       │ (printer.js)    │ │ (printer.js)    │ │ (printer.js)    │
       ├─────────────────┤ ├─────────────────┤ ├─────────────────┤
       │ - ID: 1         │ │ - ID: 2         │ │ - ID: 3         │
       │ - SerialPort    │ │ - SerialPort    │ │ - SerialPort    │
       │ - ReadlineParser│ │ - ReadlineParser│ │ - ReadlineParser│
       │ - sendCommand() │ │ - sendCommand() │ │ - sendCommand() │
       └──────┬──────────┘ └──────┬──────────┘ └──────┬──────────┘
              │                   │                   │
              ▼                   ▼                   ▼
       ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
       │ 3D Printer #1  │ │ 3D Printer #2  │ │ 3D Printer #3  │
       └────────────────┘ └────────────────┘ └────────────────┘
```

 # 1. printer.js

Represents a single printer connection.

Opens serial communication

Sends G-code commands

Parses and logs printer responses

Handles connection errors and disconnections

# 2. printerManager.js

Coordinates all connected printers.

Detects serial ports

Creates one Printer instance per port

Manages lifecycle (connect/disconnect)

Routes commands to the correct printer by ID

# 3. cli.js

Interactive command-line interface.

Reads user input in real time

Supports:

list → shows all connected printers

exit → safely closes all ports

[id] command → sends a G-code to a specific printer

# 4. app.js

Entry point that initializes the PrinterManager and starts the CLI.

Starts the WebSocket client for remote API control

# 5. websocketClient.js

Connects local printers to a remote API via WebSocket

Receives G-code commands from the API and forwards to the correct printer in json format

Sends printer responses back to the API in json format

Handles connection, disconnection, and errors