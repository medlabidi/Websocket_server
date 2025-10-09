# multiprinter local server 
A Node.js-based CLI and WebSocket server that connects to and controls multiple 3D printers simultaneously.
It automatically detects connected printers, lets you send G-code commands, and displays real-time printer responses — all from a single terminal interface or remotely via WebSocket.

## Features
 **Automatic detection** of connected 3D printers 
 **Multi-printer management** — control many printers at once 
 **Interactive command-line interface** for real-time G-code input
 **WebSocket server support** — control printers remotely (e.g., via Postman or custom client)
 **ID-based routing** — send commands to a specific printer  
 **Modular architecture** — easy to extend or integrate with web UI 
 **Error handling & clean disconnection** on exit

 ## project structure
src/
├── app.js              # Entry point
├── cli.js              # Command-line interface for local control
├── printerManager.js   # Handles multiple printers and manages connections
├── printer.js          # Represents a single printer
├── config.js           # Configuration (baud rate, defaults, IDs)
└── websocketServer.js  # WebSocket server for remote control

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
               ┌─────────────────────────────────────────────┐
               │           WebSocket Server (wsServer.js)     │
               │ - Listens for connections from remote clients│
               │ - Receives JSON commands:                     │
               │   { "printerId": 1, "command": "G28" }      │
               │ - Routes commands to PrinterManager          │
               │ - Broadcasts printer responses to clients    │
               └─────────────────────────────────────────────┘
                                       ▲
                                       │
                               Remote Client (Postman, Web UI, etc.)

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


## Websocket explanation
WebSocket is a bi-directional communication protocol, it allows continuous two-way communication between a client and a server.

In this project, this enables remote clients (like Postman or a web UI) to send G-code commands to printers, and the server to send printer responses back in real time.
## Websocket architecture
Remote Client (Postman/Web UI)
         │
         ▼
 WebSocket Server (wsServer.js)
         │
         ▼
  PrinterManager (printerManager.js)
         │
         ▼
   Printer Instances (printer.js)
         │
         ▼
      Physical Printers



🧩 Environment Setup

Follow these steps to install and run the project locally.

1️⃣ Prerequisites

Before starting, make sure you have:

Node.js ≥ 18.x

npm (comes with Node.js)

At least one 3D printer connected via USB

(Optional) Postman or any WebSocket client to test remote control

2️⃣ Clone the repository
git clone https://github.com/medlabidi/Websocket_server.git

cd Websocket_server

3️⃣ Install dependencies
npm install serialport
npm install ws

serialport
 → to communicate with printers via USB

ws
 → to handle WebSocket connections

5️⃣ Run the server
node src/app.js

✅ This will:

Automatically detect all connected 3D printers

Start a CLI for local commands

Start a WebSocket server (default port 3000)

You should see something like:

Connecting to: COM3 (Creality)
Printer connected successfully.
WebSocket server running on ws://localhost:3000

6️⃣ Test locally (CLI)

In the terminal, type commands like:

list                 # Shows all connected printers
1 M105               # Send G-code to printer with ID 1
exit                 # Closes all printers and exits

7️⃣ Test remotely (WebSocket)

Open Postman → “New” → “WebSocket Request”.

Connect to:

ws://localhost:3000


Send a JSON message:

{ "printerId": 1, "command": "M105" }


You’ll receive real-time printer responses like:

{ "printerId": 1, "response": "ok T:25.0 /0.0 B:60 /60" }

8️⃣ Optional: Edit configuration

Open src/config.js to adjust:

module.exports = {
  BAUD_RATE: 115200,
  WEBSOCKET_PORT: 3000
};

9️⃣ Stop the server

Press Ctrl + C in the terminal to safely close all connections.

✅ Done!
Your environment is now ready — you can control multiple 3D printers locally and remotely through WebSocket.