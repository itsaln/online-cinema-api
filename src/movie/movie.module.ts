import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { MovieController } from '@app/movie/movie.controller'
import { MovieService } from '@app/movie/movie.service'
import { MovieModel } from '@app/movie/movie.model'

@Module({
	controllers: [MovieController],
	providers: [MovieService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: MovieModel,
				schemaOptions: {
					collection: 'Movie'
				}
			}
		]),
		ConfigModule
	],
	exports: [MovieService]
})
export class MovieModule {}
