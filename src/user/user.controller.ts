import { Controller, Get } from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	getProfile(@User('_id') _id: string) {
		return this.userService.findOne(_id)
	}
}
