const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });
const apiUrl = (result.parsed && result.parsed.API_URL) || 'http://localhost:8080';

const content = `window['env'] = window['env'] || {};
window['env']['API_URL'] = '${apiUrl}';
`;

const outputPath = path.resolve(__dirname, '..', 'src', 'assets', 'env.js');
fs.writeFileSync(outputPath, content);

