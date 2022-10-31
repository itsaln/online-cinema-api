import { Controller } from '@nestjs/common'
import { MovieService } from '@app/movie/movie.service'

@Controller('movie')
export class MovieController {
	constructor(private readonly movieService: MovieService) {}
}
