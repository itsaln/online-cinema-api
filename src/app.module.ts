import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypegooseModule } from 'nestjs-typegoose'
import { getMongoConfig } from '@app/config/mongo.config'
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import { AuthModule } from '@app/auth/auth.module'
import { UserModule } from '@app/user/user.module'
import { GenreModule } from '@app/genre/genre.module'
import { FileModule } from '@app/file/file.module'
import { ActorModule } from '@app/actor/actor.module'
import { MovieModule } from '@app/movie/movie.module'
import { RatingModule } from '@app/rating/rating.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig
		}),
		AuthModule,
		UserModule,
		GenreModule,
		FileModule,
		ActorModule,
		MovieModule,
		RatingModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
