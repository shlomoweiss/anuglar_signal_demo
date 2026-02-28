import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { User } from '../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = '/api/users';

  // In a real app this would be: constructor(private http: HttpClient) {}
  // Using mock data here for the demo
  constructor() {}

  getAll(): Observable<User[]> {
    // Simulates HTTP GET /api/users
    return of(MOCK_USERS).pipe(delay(1000));
  }

  getById(id: string): Observable<User> {
    const user = MOCK_USERS.find(u => u.id === id)!;
    return of(user).pipe(delay(300));
  }

  create(payload: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const user: User = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    return of(user).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    return of(void 0).pipe(delay(300));
  }
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Connor',  email: 'sarah@resistance.net', role: 'admin',  active: true,  createdAt: new Date('2024-01-15') },
  { id: 'u2', name: 'John Connor',   email: 'john@resistance.net',  role: 'user',   active: true,  createdAt: new Date('2024-02-20') },
  { id: 'u3', name: 'Miles Dyson',   email: 'miles@cyberdyne.io',   role: 'admin',  active: false, createdAt: new Date('2024-03-10') },
  { id: 'u4', name: 'Kate Brewster', email: 'kate@resistance.net',  role: 'user',   active: true,  createdAt: new Date('2024-04-05') },
  { id: 'u5', name: 'T-800 Unit',    email: 'unit@skynet.io',       role: 'viewer', active: true,  createdAt: new Date('2024-05-01') },
];
