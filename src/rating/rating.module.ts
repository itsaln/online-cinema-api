import { Module } from '@nestjs/common'
import { RatingService } from '@app/rating/rating.service'
import { RatingController } from '@app/rating/rating.controller'

@Module({
	controllers: [RatingController],
	providers: [RatingService]
})
export class RatingModule {}
