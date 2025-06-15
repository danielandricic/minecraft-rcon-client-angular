import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Server, ServerService } from '../server.service';

@Component({
  selector: 'app-server-list',
  template: `
    <h1>Servers</h1>
    <form (ngSubmit)="addServer()">
      <input [(ngModel)]="newServer.name" name="name" placeholder="Name" required />
      <input [(ngModel)]="newServer.host" name="host" placeholder="Host" required />
      <input [(ngModel)]="newServer.port" name="port" placeholder="Port" required type="number" />
      <input [(ngModel)]="newServer.password" name="password" placeholder="Password" required type="password" />
      <button type="submit">Add</button>
    </form>

    <ul>
      <li *ngFor="let s of servers">
        {{s.name}} ({{s.host}}:{{s.port}})
        <button (click)="connect(s)">Connect</button>
        <button (click)="delete(s)">Delete</button>
      </li>
    </ul>
  `,
  styles: [
  ]
})
export class ServerListComponent implements OnInit {

  servers: Server[] = [];
  newServer: Server = { name: '', host: '', port: 25575, password: '' };

  constructor(private serverService: ServerService, private router: Router) { }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.serverService.getServers().subscribe(s => this.servers = s);
  }

  addServer(): void {
    this.serverService.addServer(this.newServer).subscribe(() => {
      this.newServer = { name: '', host: '', port: 25575, password: '' };
      this.load();
    });
  }

  delete(server: Server): void {
    if (!server.id) { return; }
    this.serverService.deleteServer(server.id).subscribe(() => this.load());
  }

  connect(server: Server): void {
    if (!server.id) { return; }
    this.router.navigate(['/servers', server.id]);
  }

}
