import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { UserService } from '@app/user/user.service'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'
import { UpdateUserDto } from '@app/user/dto/update-user.dto'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	getProfile(@User('_id') _id: string) {
		return this.userService.findOne(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateProfile(_id, dto)
	}

	@Get('count')
	@Auth('admin')
	getCountUsers() {
		return this.userService.getCount()
	}

	@Get()
	@Auth('admin')
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.findAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: string) {
		return this.userService.findOne(id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	updateUser(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.delete(id)
	}
}
