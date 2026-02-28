export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}
