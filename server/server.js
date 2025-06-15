const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { Rcon } = require('rcon-client');
const WebSocket = require('ws');

const app = express();
app.use(bodyParser.json());

const serversFile = path.join(__dirname, 'servers.json');
function readServers() {
  try {
    const data = fs.readFileSync(serversFile, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function saveServers(list) {
  fs.writeFileSync(serversFile, JSON.stringify(list, null, 2));
}

app.get('/servers', (req, res) => {
  res.json(readServers());
});

app.post('/servers', (req, res) => {
  const servers = readServers();
  servers.push(req.body);
  saveServers(servers);
  res.json({ status: 'ok' });
});

app.delete('/servers/:index', (req, res) => {
  const servers = readServers();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < servers.length) {
    servers.splice(index, 1);
    saveServers(servers);
  }
  res.json({ status: 'ok' });
});

const server = app.listen(8080, () => {
  console.log('API listening on 8080');
});

const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', ws => {
  let rcon;
  ws.on('message', async msg => {
    try {
      const data = JSON.parse(msg);
      if (data.type === 'connect') {
        if (rcon) {
          await rcon.end();
        }
        rcon = await Rcon.connect({
          host: data.host,
          port: data.port,
          password: data.password
        });
        ws.send(JSON.stringify({ type: 'connected' }));
      } else if (data.type === 'command' && rcon) {
        const resp = await rcon.send(data.command);
        ws.send(JSON.stringify({ type: 'response', response: resp }));
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: 'error', error: err.message }));
    }
  });
  ws.on('close', () => {
    if (rcon) rcon.end();
  });
});
