import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ServerService } from './server.service';
import { Server } from '../models/server';

@Injectable({
  providedIn: 'root'
})
export class RconService {

  constructor(private serverService: ServerService) { }

  connect(server: Server): Observable<string> {
    this.serverService.updateServer({ ...server, isOnline: true });
    return interval(2000).pipe(
      startWith(0),
      map((i: number) => `Log ${i} from ${server.host}:${server.port}`)
    );
  }

  disconnect(server: Server): void {
    this.serverService.updateServer({ ...server, isOnline: false });
  }
}
