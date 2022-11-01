import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { JwtModule } from '@nestjs/jwt'
import { getJWTConfig } from '@app/config/jwt.config'
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy'
import { AuthController } from '@app/auth/auth.controller'
import { AuthService } from '@app/auth/auth.service'
import { UserModel } from '@app/user/user.model'

@Module({
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'User'
				}
			}
		]),
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJWTConfig
		})
	]
})
export class AuthModule {}
