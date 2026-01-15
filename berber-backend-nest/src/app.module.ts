import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  //Local MongoDB Bağlantısı
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env dosyasını global yaparak her yerde kullanabiliriz
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/berberApp'),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
