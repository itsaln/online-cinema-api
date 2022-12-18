import { NestFactory } from '@nestjs/core'
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from '@app/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true })

	// const config = new DocumentBuilder()
	// 	.setTitle('Online Cinema API')
	// 	.setDescription('Online cinema application for watching movies')
	// 	.setVersion('1.0')
	// 	.build()

	// const document = SwaggerModule.createDocument(app, config)
	// SwaggerModule.setup('api', app, document)

	app.setGlobalPrefix('api')
	await app.listen(process.env.port || 5000)
	console.log(`Application is running on: ${await app.getUrl()}`)
}

let ignore = bootstrap()
