import { Injectable } from '@nestjs/common';
import { compareSync } from 'bcrypt';
import { UserService } from 'src/app/endpoints/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.findOneOrFail({ where: { email } });
      const isPasswordValid = compareSync(password, user.password);

      return isPasswordValid ? user : null;
    } catch (error) {
      return null;
    }
  }
}
