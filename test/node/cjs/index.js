if ('Bun' in globalThis) {
  throw new Error('❌ Use Node.js to run this test!');
}

const { html } = require('@elysiajs/html');

if (typeof html !== 'function') {
  throw new Error('❌ CommonJS Node.js failed');
}

console.log('✅ CommonJS Node.js works!');
