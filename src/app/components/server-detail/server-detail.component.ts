import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Server } from '../../models/server';
import { RconService } from '../../services/rcon.service';
import { ServerService } from '../../services/server.service';

@Component({
  selector: 'app-server-detail',
  templateUrl: './server-detail.component.html',
  styleUrls: ['./server-detail.component.scss']
})
export class ServerDetailComponent implements OnInit, OnDestroy {
  server?: Server;
  log: string[] = [];
  command = '';
  private sub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private rcon: RconService,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.server = this.serverService.getServer(id);
      if (this.server) {
        const url = `ws://${this.server.host}:${this.server.port}`;
        this.sub = this.rcon.connect(url).subscribe(msg => this.log.push(msg));
      }
    }
  }

  send(): void {
    if (this.command.trim()) {
      this.rcon.send(this.command);
      this.command = '';
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.rcon.disconnect();
  }
}
