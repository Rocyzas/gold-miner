// jest.setup.js

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { createCanvas } = require('canvas');

// Polyfill getContext on HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = function (type) {
  if (type === '2d') {
    return createCanvas(800, 600).getContext('2d');
  }
  return null;
};
