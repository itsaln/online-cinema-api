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
import { Types } from 'mongoose'
import { UserService } from '@app/user/user.service'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'
import { UpdateUserDto } from '@app/user/dto/update-user.dto'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { UserModel } from '@app/user/user.model'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('count')
	@Auth('admin')
	getCountUsers() {
		return this.userService.getCount()
	}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: string) {
		return this.userService.findOne(id)
	}

	@Get()
	@Auth('admin')
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.userService.findAll(searchTerm)
	}

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

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	deleteUser(@Param('id', IdValidationPipe) id: string) {
		return this.userService.delete(id)
	}

	@Get('profile/favorites')
	@Auth()
	getFavorites(@User('_id') _id: Types.ObjectId) {
		return this.userService.getFavoriteMovies(_id)
	}

	@Put('profile/favorites')
	@HttpCode(200)
	@Auth()
	toggleFavorite(
		@Body('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User() user: UserModel
	) {
		return this.userService.toggleFavorite(movieId, user)
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
}
