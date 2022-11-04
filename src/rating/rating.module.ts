import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { RatingController } from '@app/rating/rating.controller'
import { RatingService } from '@app/rating/rating.service'
import { RatingModel } from '@app/rating/rating.model'
import { MovieModule } from '@app/movie/movie.module'

@Module({
	controllers: [RatingController],
	providers: [RatingService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: RatingModel,
				schemaOptions: {
					collection: 'Rating'
				}
			}
		]),
		ConfigModule,
		MovieModule
	]
})
export class RatingModule {}
