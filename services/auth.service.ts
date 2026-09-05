import { UserRepository } from '@/repositories/user.repository';
import bcrypt from 'bcryptjs';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async validateCredentials(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    // Google OAuth users don't have a password — block credentials login
    if (!user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
    };
  }
}
