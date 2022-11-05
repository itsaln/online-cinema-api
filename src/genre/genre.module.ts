import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { GenreController } from '@app/genre/genre.controller'
import { GenreService } from '@app/genre/genre.service'
import { GenreModel } from '@app/genre/genre.model'
import { MovieModule } from '@app/movie/movie.module'

@Module({
	controllers: [GenreController],
	providers: [GenreService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: GenreModel,
				schemaOptions: {
					collection: 'Genre'
				}
			}
		]),
		MovieModule,
		ConfigModule
	]
})
export class GenreModule {}
