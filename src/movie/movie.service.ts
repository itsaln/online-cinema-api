import { Injectable, NotFoundException } from '@nestjs/common'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { MovieModel } from '@app/movie/movie.model'
import { UpdateMovieDto } from '@app/movie/dto/update-movie.dto'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
	) {}

	async findOne(_id: string) {
		const movie = await this.MovieModel.findById(_id)

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async findBySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async findByActor(actorId: Types.ObjectId) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec()

		if (!movies) throw new NotFoundException('Movies not found')

		return movies
	}

	async findByGenres(genreIds: Types.ObjectId[]) {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIds }
		}).exec()

		if (!movies) throw new NotFoundException('Movies not found')

		return movies
	}

	async findAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return await this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}

	async getMostPopular() {
		return await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: ''
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		// Telegram notification

		const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}

	async delete(_id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(_id).exec()

		if (!deleteMovie) throw new NotFoundException('Movie not found')

		return deleteMovie
	}

	async updateCountOpened(slug: string) {
		const updateMovie = await this.MovieModel.findByIdAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 }
			}
		).exec()

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}
}
