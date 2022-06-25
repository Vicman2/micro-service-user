import {
  Body,
  Controller,
  ForbiddenException,
  Inject,
  Post,
} from '@nestjs/common';

import { createUserDto } from './dto/add-user.dto';
import { UserDocument, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { REQUEST } from '@nestjs/core';
import { AuthRequest } from 'src/common/interfaces/req.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly request: AuthRequest,
  ) {}
  @Post('/create')
  async create(@Body() userData: createUserDto): Promise<UserDocument> {
    // Check if user already exists
    const exisitingUser = await this.userService.findGeneralUserByEmail(
      userData.email,
    );

    // If user already exists, throw error
    if (exisitingUser)
      throw new ForbiddenException(null, 'User already exists');
    // If user doesn't exist, create user and return
    const dataToReturn = await this.userService.createUser({
      ...userData,
    });

    return dataToReturn;
  }
}
