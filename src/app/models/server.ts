export interface Server {
  id: string;
  name: string;
  host: string;
  port: number;
  isOnline: boolean;
}

export type NewServer = Omit<Server, 'id' | 'isOnline'>;
