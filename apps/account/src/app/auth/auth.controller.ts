import { Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountLogin,
  AccountRegister,
} from '@nestjs-rabbitmq-example/contacts';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @RMQValidate()
  @RMQRoute(AccountRegister.topic)
  async register(
    @Body() dto: AccountRegister.Request,
  ): Promise<AccountRegister.Responce> {
    return this.authService.register(dto);
  }

  @RMQValidate()
  @RMQRoute(AccountLogin.topic)
  async login(
    @Body() { email, password }: AccountLogin.Request,
  ): Promise<AccountLogin.Responce> {
    const { id } = await this.authService.validateUser(email, password);
    return this.authService.login(id);
  }
}
