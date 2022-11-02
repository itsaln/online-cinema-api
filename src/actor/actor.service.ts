import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { ActorModel } from '@app/actor/actor.model'
import { ActorDto } from '@app/actor/actor.dto'

@Injectable()
export class ActorService {
	constructor(
		@InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>
	) {}

	async findOne(_id: string) {
		const actor = await this.ActorModel.findById(_id)

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
	}

	async findBySlug(slug: string) {
		const actor = await this.ActorModel.findOne({ slug }).exec()

		if (!actor) throw new NotFoundException('Actor not found')

		return actor
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
					}
				]
			}
		}

		return await this.ActorModel.aggregate()
			.match(options)
			.lookup({
				from: 'Movie',
				foreignField: 'actors',
				localField: '_id',
				as: 'movies'
			})
			.addFields({
				countMovies: {
					$size: '$movies'
				}
			})
			.project({ __v: 0, updatedAt: 0, movies: 0 })
			.sort({
				createdAt: -1
			})
			.exec()
	}

	async create() {
		const defaultValue: ActorDto = {
			name: '',
			slug: '',
			photo: ''
		}
		const actor = await this.ActorModel.create(defaultValue)
		return actor._id
	}

	async update(_id: string, dto: ActorDto) {
		const updateActor = await this.ActorModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateActor) throw new NotFoundException('Actor not found')

		return updateActor
	}

	async delete(_id: string) {
		const deleteActor = await this.ActorModel.findByIdAndDelete(_id).exec()

		if (!deleteActor) throw new NotFoundException('Actor not found')

		return deleteActor
	}
}
