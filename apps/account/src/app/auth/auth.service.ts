import { UserRole } from '@nestjs-rabbitmq-example/interfaces';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import {
  EMAIL__ARE_TAKEN_ERROR,
  PASSWORD_ARE_NOT_VALID_ERROR,
  USER_NOT_FOUND_ERROR,
} from './auth.constants';
import { RegisterDto } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtServise: JwtService,
  ) {}

  async register({ email, password, displayName }: RegisterDto) {
    const oldUser = await this.userRepository.findUser(email);
    if (oldUser) {
      throw new Error(EMAIL__ARE_TAKEN_ERROR);
    }
    const newUserEntity = await new UserEntity({
      email,
      displayName,
      passwordHash: '',
      role: UserRole.Student,
    }).setPassword(password);
    const newUser = await this.userRepository.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error(USER_NOT_FOUND_ERROR);
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);
    if (!isCorrectPassword) {
      throw new Error(PASSWORD_ARE_NOT_VALID_ERROR);
    }
    return { id: user._id };
  }

  async login(id: string) {
    return {
      access_token: await this.jwtServise.signAsync({ id }),
    };
  }
}
