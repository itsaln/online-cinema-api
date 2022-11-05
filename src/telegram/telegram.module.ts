import { Module } from '@nestjs/common'
import { TelegramService } from '@app/telegram/telegram.service'

@Module({
	providers: [TelegramService],
	exports: [TelegramService]
})
export class TelegramModule {}
