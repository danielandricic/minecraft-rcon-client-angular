import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../server.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-terminal',
  template: `
    <h1>Terminal</h1>
    <div style="border:1px solid #ccc;height:300px;overflow:auto;padding:4px;" #log>
      <div *ngFor="let m of messages">{{m}}</div>
    </div>
    <form (ngSubmit)="send()">
      <input [(ngModel)]="command" name="command" placeholder="Command" required />
      <button type="submit">Send</button>
    </form>
  `,
  styles: [
  ]
})
export class TerminalComponent implements OnInit, OnDestroy {

  messages: string[] = [];
  command = '';
  private name = '';
  private sub?: Subscription;

  constructor(private route: ActivatedRoute, private service: ServerService) { }

  ngOnInit(): void {
    this.name = this.route.snapshot.paramMap.get('name') || '';
    this.service.connect(this.name);
    const obs = this.service.onMessage();
    this.sub = obs.subscribe(m => this.messages.push(m));
  }

  send(): void {
    if (this.command.trim()) {
      this.service.sendCommand(this.command);
      this.command = '';
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.service.disconnect();
  }
}
