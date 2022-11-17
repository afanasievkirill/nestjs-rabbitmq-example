import { Body, Controller, Post } from '@nestjs/common';
import {
  AccountLogin,
  AccountRegister,
} from '@nestjs-rabbitmq-example/contacts';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  async register(
    @Body() dto: AccountRegister.Request,
  ): Promise<AccountRegister.Responce> {}

  @Post('login')
  async login(
    @Body() { email, password }: AccountLogin.Request,
  ): Promise<AccountLogin.Responce> {}
}
