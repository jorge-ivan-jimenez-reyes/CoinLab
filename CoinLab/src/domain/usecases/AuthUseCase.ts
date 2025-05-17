import { IAuthRepository } from '../interfaces/IAuthRepository';
import { User } from '../entities/User';
import { AuthCredentialsDTO } from '../entities/DTOs/AuthCredentialsDTO';
import { UserRegistrationDTO } from '../entities/DTOs/UserRegistrationDTO';

export class AuthUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(credentials: AuthCredentialsDTO): Promise<User> {
    return this.authRepository.login(credentials);
  }

  async register(userData: UserRegistrationDTO): Promise<User> {
    return this.authRepository.register(userData);
  }

  async logout(): Promise<void> {
    return this.authRepository.logout();
  }

  async getCurrentUser(): Promise<User | null> {
    return this.authRepository.getCurrentUser();
  }

  async forgotPassword(email: string): Promise<void> {
    return this.authRepository.forgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.authRepository.resetPassword(token, newPassword);
  }
} 