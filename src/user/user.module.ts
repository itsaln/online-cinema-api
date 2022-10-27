import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserController } from '@app/user/user.controller'
import { UserService } from '@app/user/user.service'
import { UserModel } from '@app/user/user.model'

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		ConfigModule
	]
})
export class UserModule {}
