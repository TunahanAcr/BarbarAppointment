import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config'; // .env dosyasını okumak için

@Module({
  imports: [
    ConfigModule.forRoot(), // .env dosyasını yükle
    PassportModule,
  ],
  providers: [JwtStrategy], // JWT stratejisini sağlayıcı olarak ekle
  exports: [PassportModule], // Diğer modüllerde kullanmak için PassportModule'ü dışa aktar
})
export class AuthModule {}
