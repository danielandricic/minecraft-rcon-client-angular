import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Server {
  name: string;
  host: string;
  port: number;
  password: string;
}

declare const window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  servers: Server[] = [];
  newServer: Server = { name: '', host: '', port: 25575, password: '' };
  command = '';
  log = '';
  ws?: WebSocket;
  connected = false;

  apiUrl = (window as any).env?.API_URL || '';

  constructor(private http: HttpClient) {
    this.loadServers();
  }

  loadServers(): void {
    this.http.get<Server[]>(`${this.apiUrl}/servers`).subscribe(s => this.servers = s);
  }

  addServer(): void {
    this.http.post(`${this.apiUrl}/servers`, this.newServer).subscribe(() => {
      this.newServer = { name: '', host: '', port: 25575, password: '' };
      this.loadServers();
    });
  }

  deleteServer(i: number): void {
    this.http.delete(`${this.apiUrl}/servers/${i}`).subscribe(() => this.loadServers());
  }

  connect(i: number): void {
    const s = this.servers[i];
    this.ws = new WebSocket(`${this.apiUrl.replace('http', 'ws')}/ws`);
    this.ws.onopen = () => {
      if (this.ws) {
        this.ws.send(JSON.stringify({ type: 'connect', host: s.host, port: s.port, password: s.password }));
      }
    };
    this.ws.onmessage = ev => {
      const data = JSON.parse(ev.data);
      if (data.type === 'connected') {
        this.connected = true;
        this.log += 'Connected\n';
      } else if (data.type === 'response') {
        this.log += data.response + '\n';
      } else if (data.type === 'error') {
        this.log += 'Error: ' + data.error + '\n';
      }
    };
    this.ws.onclose = () => {
      this.connected = false;
    };
  }

  sendCommand(): void {
    if (this.ws) {
      this.ws.send(JSON.stringify({ type: 'command', command: this.command }));
      this.command = '';
    }
  }
}
