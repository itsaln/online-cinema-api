import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { ActorController } from '@app/actor/actor.controller'
import { ActorService } from '@app/actor/actor.service'
import { ActorModel } from '@app/actor/actor.model'

@Module({
	controllers: [ActorController],
	providers: [ActorService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: ActorModel,
				schemaOptions: {
					collection: 'Actor'
				}
			}
		]),
		ConfigModule
	]
})
export class ActorModule {}
