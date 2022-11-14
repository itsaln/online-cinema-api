import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { getTelegramConfig } from '@app/config/telegram.config'
import { Telegram } from '@app/telegram/telegram.interface'

@Injectable()
export class TelegramService {
	bot: Telegraf
	options: Telegram

	constructor() {
		this.options = getTelegramConfig()
		this.bot = new Telegraf(this.options.token)
	}

	async sendMessage(
		msg: string,
		options?: ExtraReplyMessage,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendMessage(chatId, msg, {
			parse_mode: 'HTML',
			...options
		})
	}

	async sendPhoto(
		photo: string,
		msg?: string,
		chatId: string = this.options.chatId
	) {
		await this.bot.telegram.sendPhoto(
			chatId,
			photo,
			msg
				? {
						caption: msg
				  }
				: {}
		)
	}
}
