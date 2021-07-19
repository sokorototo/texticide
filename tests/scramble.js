// Scrambles the inputs
const PATH = './tests/examples.json', fs = require('fs');
fs.writeFileSync(PATH, JSON.stringify(JSON.parse(fs.readFileSync(PATH)).sort(() => { return (Math.random() * 2 - 1) })), { encoding: 'utf-8' });