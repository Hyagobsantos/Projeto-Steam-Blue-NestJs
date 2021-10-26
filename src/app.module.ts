import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { UsersModule } from './users/users.module';
import { GamesModule } from './games/games.module';
import { AuthModule } from './auth/auth.module';


// @Module({
//   imports: [
//     TypeOrmModule.forRoot(typeOrmConfig),
//     ConfigModule.forRoot({ isGlobal: true }),
//     UsersModule,
//     GamesModule,
//     AuthModule,
//   ],
//   controllers: [],
//   providers: [],
// })

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    AuthModule,
    GamesModule,
  ],
  controllers: [],
})


export class AppModule {}
function winstonConfig(
  winstonConfig: any,
):
  | import('@nestjs/common').Type<any>
  | import('@nestjs/common').DynamicModule
  | Promise<import('@nestjs/common').DynamicModule>
  | import('@nestjs/common').ForwardReference<any> {
  throw new Error('Function not implemented.');
}
