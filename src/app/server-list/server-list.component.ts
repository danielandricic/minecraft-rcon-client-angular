import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerService } from '../services/server.service';
import { NewServer, Server } from '../models/server';

@Component({
  selector: 'app-server-list',
  templateUrl: './server-list.component.html',
  styleUrls: ['./server-list.component.scss']
})
export class ServerListComponent {
  servers$ = this.serverService.servers$;
  newServer: Partial<NewServer> = { port: 25575 };

  constructor(private serverService: ServerService) { }

  addServer(): void {
    if (this.newServer.name && this.newServer.host && this.newServer.port) {
      this.serverService.addServer(this.newServer as NewServer);
      this.newServer = { port: 25575 };
    }
  }

  deleteServer(id: string): void {
    this.serverService.removeServer(id);
  }
}
