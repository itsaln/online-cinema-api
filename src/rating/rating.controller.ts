import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { User } from '@app/user/decorators/user.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { RatingService } from '@app/rating/rating.service'
import { SetRatingDto } from '@app/rating/dto/set-rating.dto'

@ApiTags('Ratings')
@Controller('ratings')
export class RatingController {
	constructor(private readonly ratingService: RatingService) {}

	@UsePipes(new ValidationPipe())
	@Post('set-rating')
	@HttpCode(200)
	@Auth()
	async setRating(@User('_id') userId: Types.ObjectId, @Body() dto: SetRatingDto) {
		return this.ratingService.setRating(userId, dto)
	}

	@Get(':movieId')
	@Auth()
	async getMovieValueByUser(
		@Param('movieId', IdValidationPipe) movieId: Types.ObjectId,
		@User('_id') userId: Types.ObjectId
	) {
		return this.ratingService.getMovieValueByUser(movieId, userId)
	}
}
