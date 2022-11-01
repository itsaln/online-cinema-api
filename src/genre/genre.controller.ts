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
import { GenreService } from '@app/genre/genre.service'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { CreateGenreDto } from '@app/genre/dto/create-genre.dto'

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) {}

	@Get('collections')
	getCollections() {
		return this.genreService.getCollections()
	}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.findOne(id)
	}

	@Get('bg-slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.genreService.findBySlug(slug)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.findAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	create() {
		return this.genreService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: CreateGenreDto
	) {
		return this.genreService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	delete(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.delete(id)
	}
}
