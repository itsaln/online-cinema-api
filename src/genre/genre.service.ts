import { Injectable, NotFoundException } from '@nestjs/common'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types'
import { GenreModel } from '@app/genre/genre.model'
import { CreateGenreDto } from '@app/genre/dto/create-genre.dto'
import { MovieService } from '@app/movie/movie.service'
import { ICollection } from '@app/genre/genre.interface'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService
	) {}

	async findAll(searchTerm?: string): Promise<DocumentType<GenreModel>[]> {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					},
					{
						slug: new RegExp(searchTerm, 'i')
					},
					{
						description: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return await this.GenreModel
			.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async findBySlug(slug: string): Promise<DocumentType<GenreModel>> {
		const genre = await this.GenreModel.findOne({ slug }).exec()

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async getPopular(): Promise<DocumentType<GenreModel>[]> {
		return this.GenreModel
			.find()
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.exec()
	}

	async getCollections(): Promise<ICollection[]> {
		const genres = await this.findAll()

		const collections = await Promise.all(
			genres.map(async genre => {
				const moviesByGenre = await this.movieService.findByGenres([genre._id])

				const result: ICollection = {
					_id: String(genre._id),
					title: genre.name,
					slug: genre.slug,
					image: moviesByGenre[0]?.bigPoster
				}

				return result
			})
		)

		return collections
	}

	async findOne(_id: string): Promise<DocumentType<GenreModel>> {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async create(): Promise<Types.ObjectId> {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: ''
		}
		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async update(_id: string, dto: CreateGenreDto): Promise<DocumentType<GenreModel> | null> {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateGenre) throw new NotFoundException('Genre not found')

		return updateGenre
	}

	async delete(_id: string): Promise<DocumentType<GenreModel> | null> {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(_id).exec()

		if (!deleteGenre) throw new NotFoundException('Genre not found')

		return deleteGenre
	}
}
