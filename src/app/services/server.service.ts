import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Server, NewServer } from '../models/server';

const STORAGE_KEY = 'servers';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serversSubject = new BehaviorSubject<Server[]>(this.loadServers());
  servers$ = this.serversSubject.asObservable();

  addServer(data: NewServer): void {
    const server: Server = { ...data, id: generateId(), isOnline: false };
    const servers = [...this.serversSubject.value, server];
    this.serversSubject.next(servers);
    this.saveServers(servers);
  }

  removeServer(id: string): void {
    const servers = this.serversSubject.value.filter(s => s.id !== id);
    this.serversSubject.next(servers);
    this.saveServers(servers);
  }

  updateServer(server: Server): void {
    const servers = this.serversSubject.value.map(s => s.id === server.id ? server : s);
    this.serversSubject.next(servers);
    this.saveServers(servers);
  }

  getServer(id: string): Server | undefined {
    return this.serversSubject.value.find(s => s.id === id);
  }

  private loadServers(): Server[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as Server[] : [];
    } catch {
      return [];
    }
  }

  private saveServers(servers: Server[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
    } catch {
      // ignored
    }
  }
}
