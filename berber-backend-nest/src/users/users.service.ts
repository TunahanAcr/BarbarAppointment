import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  //Constructor Kurucu Metot
  //User modelini enjekte et
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
