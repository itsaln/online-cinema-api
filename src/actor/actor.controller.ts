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
import { ActorService } from '@app/actor/actor.service'
import { Auth } from '@app/auth/decorators/auth.decorator'
import { IdValidationPipe } from '@app/pipes/id.validation.pipe'
import { ActorDto } from '@app/actor/actor.dto'

@Controller('actors')
export class ActorController {
	constructor(private readonly actorService: ActorService) {}

	@Get(':id')
	@Auth('admin')
	findOne(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.findOne(id)
	}

	@Get('bg-slug/:slug')
	findBySlug(@Param('slug') slug: string) {
		return this.actorService.findBySlug(slug)
	}

	@Get()
	findAll(@Query('searchTerm') searchTerm?: string) {
		return this.actorService.findAll(searchTerm)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	create() {
		return this.actorService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	update(@Param('id', IdValidationPipe) id: string, @Body() dto: ActorDto) {
		return this.actorService.update(id, dto)
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	delete(@Param('id', IdValidationPipe) id: string) {
		return this.actorService.delete(id)
	}
}
