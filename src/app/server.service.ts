import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

export interface Server {
  id?: string;
  name: string;
  host: string;
  port: number;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ServerService {
  private socket?: WebSocketSubject<any>;

  constructor(private http: HttpClient) {}

  getServers(): Observable<Server[]> {
    return this.http.get<Server[]>(`${environment.apiUrl}/servers`);
  }

  addServer(server: Server): Observable<Server> {
    return this.http.post<Server>(`${environment.apiUrl}/servers`, server);
  }

  deleteServer(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/servers/${id}`);
  }

  connect(id: string): void {
    this.socket = webSocket(`${environment.apiUrl.replace('http', 'ws')}/servers/${id}/rcon`);
  }

  sendCommand(cmd: string): void {
    this.socket?.next(cmd);
  }

  onMessage(): Observable<any> | undefined {
    return this.socket?.asObservable();
  }

  disconnect(): void {
    this.socket?.complete();
    this.socket = undefined;
  }
}
