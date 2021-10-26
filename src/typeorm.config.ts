import { TypeOrmModuleOptions } from '@nestjs/typeorm';


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: 5432,
  username: 'postgres',
  password: 'fatestay',
  database: 'steamdb',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};


