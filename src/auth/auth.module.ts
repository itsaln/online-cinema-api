import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { AuthController } from '@app/auth/auth.controller'
import { AuthService } from '@app/auth/auth.service'
import { UserModel } from '@app/user/user.model'

@Module({
	controllers: [AuthController],
	providers: [AuthService],
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
export class AuthModule {}
