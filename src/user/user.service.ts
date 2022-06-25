import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { encryptData, passwordHash } from 'src/common/utilizers/util.utilizer';

import { IAddUser } from './interfaces/add-user.interface';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(user: IAddUser): Promise<any> {
    const { password } = user;
    user.password = await passwordHash(password);

    const generalUser = await this.userModel.create({
      ...user,
    });

    const token = await encryptData(
      {
        id: generalUser._id,
        email: generalUser.email,
      },
      3600,
    );

    return {
      ...generalUser.toJSON(),
      token,
    };
  }

  async findGeneralUserByEmail(email: string) {
    return await this.userModel.findOne({
      email: email.toLowerCase(),
    });
  }

  async findGeneralUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id);
  }
}
