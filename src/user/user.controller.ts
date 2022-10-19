import { Controller } from '@nestjs/common'
import { UserService } from '@app/user/user.service'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
}
