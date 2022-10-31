import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export interface ActorModel extends Base {}

export class ActorModel extends TimeStamps {
	@prop()
	name: string

	@prop({unique: true})
	slug: string

	@prop()
	photo: string
}
