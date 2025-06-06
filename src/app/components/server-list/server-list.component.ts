import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../services/server.service';
import { Server } from '../../models/server';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent implements OnInit {
  servers: Server[] = [];
  newServer: Omit<Server, 'id'> = { name: '', host: '', port: 25575, password: '' };

  constructor(private serverService: ServerService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.servers = this.serverService.getServers();
  }

  addServer(): void {
    if (!this.newServer.name || !this.newServer.host) {
      return;
    }
    this.serverService.addServer(this.newServer);
    this.newServer = { name: '', host: '', port: 25575, password: '' };
    this.load();
  }

  deleteServer(id: string): void {
    this.serverService.deleteServer(id);
    this.load();
  }

  open(server: Server): void {
    this.router.navigate(['/server', server.id]);
  }
}
