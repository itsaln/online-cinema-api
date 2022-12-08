import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Types } from 'mongoose'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { MovieService } from '@app/movie/movie.service'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { CreateMovieDto } from '@app/movie/dto/create-movie.dto'
import { GenreIdsDto } from '@app/movie/dto/genreIds.dto'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}

	@Get('most-popular')
	getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@Put('update-count-opened')
	@HttpCode(200)
	updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOpened(slug)
	}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.findOne(id)
	}

	@Get('by-slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.movieService.findBySlug(slug)
	}

	@Get('by-actor/:actorId')
	findByActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.findByActor(actorId)
	}

	@UsePipes(new ValidationPipe())
	@Post('by-genres')
	@HttpCode(200)
	findByGenres(@Body() { genreIds }: GenreIdsDto) {
		return this.movieService.findByGenres(genreIds)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.findAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateMovieDto
	) {
		return this.movieService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	delete(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.delete(id)
	}
}
