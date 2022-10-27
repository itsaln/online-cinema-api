import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { GenreModel } from '@app/genre/genre.model'
import { CreateGenreDto } from '@app/genre/dto/create-genre.dto'

@Injectable()
export class GenreService {
	constructor(
		@InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>
	) {}

	async findOne(_id: string) {
		const genre = await this.GenreModel.findById(_id)

		if (!genre) throw new NotFoundException('Genre not found')

		return genre
	}

	async findBySlug(slug: string) {
		return await this.GenreModel.findOne({ slug }).exec()
	}

	async findAll(searchTerm?: string) {
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

		return this.GenreModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc'
			})
			.exec()
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: ''
		}
		const genre = await this.GenreModel.create(defaultValue)
		return genre._id
	}

	async update(_id: string, dto: CreateGenreDto) {
		const updateGenre = await this.GenreModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateGenre) throw new NotFoundException('Genre not found')

		return updateGenre
	}

	async delete(_id: string) {
		const deleteGenre = await this.GenreModel.findByIdAndDelete(_id).exec()

		if (!deleteGenre) throw new NotFoundException('Genre not found')

		return deleteGenre
	}

	async getCollections() {
		const genres = await this.findAll()
		const collections = genres
		// Need will write
		return collections
	}
}
