import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { User } from '../../domain/entities/User';
import { AuthCredentialsDTO } from '../../domain/entities/DTOs/AuthCredentialsDTO';
import { UserRegistrationDTO } from '../../domain/entities/DTOs/UserRegistrationDTO';

export class AuthRepository implements IAuthRepository {
  private readonly USER_STORAGE_KEY = '@CoinLab:user';
  
  async login(credentials: AuthCredentialsDTO): Promise<User> {
    // En un caso real, aquí se haría una llamada a la API
    // Por ahora, simulamos una respuesta exitosa
    const mockUser: User = {
      id: '1',
      email: credentials.email,
      firstName: 'Usuario',
      lastName: 'Ejemplo',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
  
  async register(userData: UserRegistrationDTO): Promise<User> {
    // En un caso real, aquí se haría una llamada a la API
    // Por ahora, simulamos una respuesta exitosa
    const mockUser: User = {
      id: '1',
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await AsyncStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  }
  
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(this.USER_STORAGE_KEY);
  }
  
  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(this.USER_STORAGE_KEY);
    if (!userData) return null;
    
    const user = JSON.parse(userData) as User;
    // Convertimos las fechas de string a Date
    user.createdAt = new Date(user.createdAt);
    user.updatedAt = new Date(user.updatedAt);
    
    return user;
  }
  
  async forgotPassword(email: string): Promise<void> {
    // Simulamos el envío de correo de recuperación
    console.log(`Correo de recuperación enviado a: ${email}`);
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Simulamos el reseteo de contraseña
    console.log(`Contraseña restablecida con token: ${token}`);
  }
} 