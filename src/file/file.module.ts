import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { FileService } from '@app/file/file.service'
import { FileController } from '@app/file/file.controller'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	],
	controllers: [FileController],
	providers: [FileService]
})
export class FileModule {}
