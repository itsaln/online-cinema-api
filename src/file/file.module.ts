import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { FileController } from '@app/file/file.controller'
import { FileService } from '@app/file/file.service'

@Module({
	controllers: [FileController],
	providers: [FileService],
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		})
	]
})
export class FileModule {}
