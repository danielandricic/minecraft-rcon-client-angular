import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Server } from '../models/server';
import { ServerService } from '../services/server.service';
import { RconService } from '../services/rcon.service';

@Component({
  selector: 'app-server-console',
  templateUrl: './server-console.component.html',
  styleUrls: ['./server-console.component.scss']
})
export class ServerConsoleComponent implements OnInit, OnDestroy {
  server?: Server;
  logs: string[] = [];
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService,
    private rcon: RconService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const server = id ? this.serverService.getServer(id) : undefined;
    if (server) {
      this.server = server;
      this.sub = this.rcon.connect(server).subscribe(log => this.logs.push(log));
    }
  }

  disconnect(): void {
    if (this.server) {
      this.rcon.disconnect(this.server);
    }
    this.sub?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
