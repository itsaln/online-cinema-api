import { Telegram } from '@app/telegram/telegram.interface'

export const getTelegramConfig = (): Telegram => ({
	// https://api.telegram.org/bot212141231321:token/getUpdates
	chatId: '-1002068487280',
	token: '5674967151:AAHhOBAN-JW5IZR0OQjAhREBGXI29w7cZuQ'
})
