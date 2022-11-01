import { Types } from 'mongoose'
import { IsNotEmpty, MinLength } from 'class-validator'

export class GenreIdsDto {
	@IsNotEmpty()
	@MinLength(24, { each: true })
	genreIds: Types.ObjectId[]
}
