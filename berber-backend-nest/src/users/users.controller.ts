import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'; // Passport tabanlı guard'ı içe aktar

@Controller('users')
export class UsersController {
  //Dependency Injection ile UsersService i enjekte et
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt')) // Sadece token doğrulaması yapılmış istekler erişebilir
  @Get('profile')
  getProfile(@Request() req) {
    return { mesaj: "NestJS'e hoş geldiniz!", BİLGİLER: req.user };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
