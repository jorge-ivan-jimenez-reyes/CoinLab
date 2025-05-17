import { User } from '../entities/User';
import { AuthCredentialsDTO } from '../entities/DTOs/AuthCredentialsDTO';
import { UserRegistrationDTO } from '../entities/DTOs/UserRegistrationDTO';

export interface IAuthRepository {
  login(credentials: AuthCredentialsDTO): Promise<User>;
  register(userData: UserRegistrationDTO): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
} 