import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // 1. Token nerede? Header'da "Bearer eyJhb..." olarak gelir.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // 2. Süresi dolmuş mu? Kontrol et.
      ignoreExpiration: false,

      // 3. İŞTE BURASI! .env dosyasındaki ortak şifreyi alıyoruz.
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  // Token geçerliyse bu fonksiyon çalışır.
  // "payload" = Token'ın içindeki şifrelenmiş veri (userId, email vs.)
  async validate(payload: any) {
    // Buradan dönen veri, request.user içine yapışır.
    // Express tarafında payload içine ne koyduysan burada o çıkar.
    // Genelde: { sub: id, email: ... } olur.
    return { userId: payload.id, email: payload.email, name: payload.name };
  }
}
