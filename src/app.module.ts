import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { COMMON_CONSTANTS } from './common/constants/common.constants';
import { AuthenticationMiddleware } from './middlewares/auth.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    MongooseModule.forRoot(COMMON_CONSTANTS().DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: 'api/v1/users/create', method: RequestMethod.POST },
        { path: 'api/v1/auth/login', method: RequestMethod.POST },
        { path: 'api/v1/auth/forgot-password', method: RequestMethod.ALL },
        {
          path: 'api/v1/auth/reset-password',
          method: RequestMethod.ALL,
        },
        {
          path: 'api/v1/auth/verify-email',
          method: RequestMethod.PATCH,
        },
      )
      .forRoutes('*');
  }
}
