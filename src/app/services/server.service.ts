import { Injectable } from '@angular/core';
import { Server } from '../models/server';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'servers';

@Injectable({ providedIn: 'root' })
export class ServerService {
  private load(): Server[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private save(servers: Server[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servers));
  }

  getServers(): Server[] {
    return this.load();
  }

  getServer(id: string): Server | undefined {
    return this.load().find(s => s.id === id);
  }

  addServer(server: Omit<Server, 'id'>): Server {
    const servers = this.load();
    const newServer: Server = { ...server, id: uuidv4() };
    servers.push(newServer);
    this.save(servers);
    return newServer;
  }

  deleteServer(id: string): void {
    const servers = this.load().filter(s => s.id !== id);
    this.save(servers);
  }
}
