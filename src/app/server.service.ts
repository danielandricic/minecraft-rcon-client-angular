import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export interface Server {
  id?: string;
  name: string;
  host: string;
  port: number;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class ServerService {
  private connection?: HubConnection;
  private serverName = '';
  private messageSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  getServers(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/servers`);
  }

  getServer(name: string): Observable<Server> {
    return this.http.get<Server>(`${environment.apiUrl}/server/${name}`);
  }

  addServer(server: Server): Observable<Server> {
    return this.http.post<Server>(`${environment.apiUrl}/servers`, server);
  }

  deleteServer(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/servers/${id}`);
  }

  connect(name: string): void {
    this.serverName = name;
    const hubUrl = environment.apiUrl.replace(/\/api\/?$/, '') + '/rconHub';
    this.connection = new HubConnectionBuilder()
      .withUrl(hubUrl, { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.connection.on('Log', (_: string, message: string) => {
      this.messageSubject.next(message);
    });

    this.connection.on('ReceiveMessage', (msg: string) => {
      this.messageSubject.next(msg);
    });

    this.connection.on('Response', (_: string, resp: string) => {
      this.messageSubject.next(resp);
    });

    this.connection.on('Error', (err: string) => {
      this.messageSubject.next('Error: ' + err);
    });

    this.connection.start()
      .then(() => this.connection?.invoke('ConnectToServer', this.serverName))
      .catch(err => this.messageSubject.next('Error: ' + err.toString()));
  }

  sendCommand(cmd: string): void {
    if (!this.connection) { return; }
    this.connection.invoke('SendCommand', this.serverName, cmd)
      .catch(err => this.messageSubject.next('Error: ' + err.toString()));
  }

  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  disconnect(): void {
    this.connection?.stop();
    this.connection = undefined;
    this.serverName = '';
  }
}
