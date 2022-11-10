import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async findUser(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async deleteUser(email: string) {
    await this.userModel.deleteOne({ email }).exec();
  }
}
