// Configuration constants for the 3D printer connection
module.exports = {
  BAUD_RATE: 115200,                 // Serial communication speed
  MANUFACTURERS: ['arduino', 'creality', 'ftdi', 'silicon'], // Common printer manufacturers
  PROMPT: 'G-code> '                 // CLI prompt string
};
