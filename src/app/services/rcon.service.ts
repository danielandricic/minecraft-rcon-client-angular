import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RconService {
  private socket?: WebSocket;
  private messages = new Subject<string>();

  connect(url: string): Observable<string> {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = new WebSocket(url);
    this.socket.onmessage = e => this.messages.next(e.data);
    return this.messages.asObservable();
  }

  send(message: string): void {
    this.socket?.send(message);
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = undefined;
  }
}
