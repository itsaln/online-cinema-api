import { Injectable, NotFoundException } from '@nestjs/common'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { MovieModel } from '@app/movie/movie.model'
import { UpdateMovieDto } from '@app/movie/dto/update-movie.dto'
import { TelegramService } from '@app/telegram/telegram.service'

@Injectable()
export class MovieService {
	constructor(
		@InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService
	) {}

	async findOne(_id: string) {
		const movie = await this.MovieModel.findById(_id)

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async findBySlug(slug: string) {
		const movie = await this.MovieModel.findOne({ slug })
			.populate('actors genres')
			.exec()

		if (!movie) throw new NotFoundException('Movie not found')

		return movie
	}

	async findByActor(actorId: Types.ObjectId) {
		const movies = await this.MovieModel.find({ actors: actorId }).exec()

		if (!movies) throw new NotFoundException('Movies not found')

		return movies
	}

	async findByGenres(genreIds: Types.ObjectId[]) {
		const movies = await this.MovieModel.find({
			genres: { $in: genreIds }
		}).exec()

		if (!movies) throw new NotFoundException('Movies not found')

		return movies
	}

	async findAll(searchTerm?: string) {
		let options = {}

		if (searchTerm) {
			options = {
				$or: [
					{
						title: new RegExp(searchTerm, 'i')
					}
				]
			}
		}

		return await this.MovieModel.find(options)
			.select('-updatedAt -__v')
			.sort({ createdAt: 'desc' })
			.populate('actors genres')
			.exec()
	}

	async getMostPopular() {
		return await this.MovieModel.find({ countOpened: { $gt: 0 } })
			.sort({ countOpened: -1 })
			.populate('genres')
			.exec()
	}

	async create() {
		const defaultValue: UpdateMovieDto = {
			bigPoster: '',
			actors: [],
			genres: [],
			poster: '',
			title: '',
			videoUrl: '',
			slug: ''
		}
		const movie = await this.MovieModel.create(defaultValue)
		return movie._id
	}

	async update(_id: string, dto: UpdateMovieDto) {
		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}

		const updateMovie = await this.MovieModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec()

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}

	async delete(_id: string) {
		const deleteMovie = await this.MovieModel.findByIdAndDelete(_id).exec()

		if (!deleteMovie) throw new NotFoundException('Movie not found')

		return deleteMovie
	}

	async updateCountOpened(slug: string) {
		const updateMovie = await this.MovieModel.findOneAndUpdate(
			{ slug },
			{
				$inc: { countOpened: 1 }
			},
			{ new: true }
		).exec()

		if (!updateMovie) throw new NotFoundException('Movie not found')

		return updateMovie
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.MovieModel.findByIdAndUpdate(
			id,
			{
				rating: newRating
			},
			{
				new: true
			}
		).exec()
	}

	async sendNotification(dto: UpdateMovieDto) {
		// if (process.env.NODE_ENV !== 'development') {
		// 	await this.telegramService.sendPhoto(dto.poster)
		// }
		await this.telegramService.sendPhoto('https://kinopoisk-ru.clstorage.net/Vr14W3240/042768uyN/6v3qY8G8ynIJaSpXhhn3s4SPHWkgdH4yAf31YlSrRpoNOSt7DUnjl5F5VfutBy4Urj0YVbTOFoYvyqVraW_JoNv0v2KIwedOMChSO-9MjsbM6igFPX1PE1jtgS8hxjomzZnj3sXRHzcRyNDirAdbYdtcGVzNpxP6Ts-goshrmWky7er_kfgLEh1dY1smQSsz9EahXYy1HiqRlNFK6MPq0uUJN4aFcY_33TSI7tC-g-230PX4YYtjU-pD4HKdD3lZcjkih6UkC3olET9n2i1_R6jGsXmUCaYCjXRd2jTHYpZx2T-2vU1_B4EMiOpI5vP9P6QBtHmzH-t-q5QKXcOxVY4VRh-JSFsaDf1jW05dFxuUyhlBsI0egqUc7Qpke_52lYU3SuXxnzPp1HievG4HfaOw6SjVn08fyicgbuXntXWirYYTLehfhv2987s-PdvLtGLpxajNmn7F7B1akEM23jlZ85YJeUvPObxc8iS6awm_XAkQ2SuDRzKjIAIlx1l9asXSl_0gQ8Jt2Qfzti3zL7yusc3gqdIqiTztDiybboIlRate7aHLr02kuKpk_i8Fm0x5GOXD4_vmE0T6FUvV2VqBWuOB_FtqsWV3BzbdW2N0WmmNCJXWYqV4Te6UcxKabbnDQmWle1fV1DjiPE4H3bMosdjR3_dL2hckSvXPFR3OFXYrHUgn-t2pf1fmjfcLzKZFcTy5SvohlPGCICNudp25B_pZRWvT5Qw8ekQGS0VfbLUYTdO7n_7vRGYxK5m1yp36O9FQF9q1Xas73l1XexgiEW2MNUom0YjN8jCXWlYlgcP6aVlTtx38vNp4AtsBwzBNLDGb_996QzAe5acZZU6NVgdVQNfqETH3-7r9f3_I3inN5KHOhtloFe7U-3YypRlHyuFRS_vR3KiW4ALv9cO0nZRl5zdLpqdseq1DlfHePYq_fWA3Ao3tuzNGWd9_mI4N7ZyRYoK5sFEG5E8iPvXda4aBfY-3mQxI6jB6013bQEXYxUP_fybjwPqhSxEN2k3KZ5WgA16hxcsv0gnnpwD-PbGIrY5yzTTpbuBzcpaJ2YP-9fULu1FoiK4wnt-dH4xpoG0_i0f6g_ySmXPBafIBDivhqLtC4W0HY6IRGzNcemVhiLlu9hn4aaaw92p24YEvYjF9E1dpJDiybBJbYU_YsRD5GxfzEpf4hnnz6XlC9dID3TCDdoXh_zMGkSvnhC6tmYBNChLxAOEeZIf2Fr2pWxphrb-rTWAMLpAyxwV7SIEIKTubW9JT5Mphx1WRWu3av53Ek-olVffnds2Tn6DaYXm4FQqa1chZ6viHtmotreMKITF_y13kjCpcYit5U8wNuP2f88_ii-gWqcMFtVopau91aCMKiUFjC05Vnw80Wgl1XIES6kFwydYYr-aemY3b5nkl64PluOzalB4DKUswccwhx1O3nsPgApHbjQHmgVo3TaDXxl2tz1dOCccflKbl7VwRCs5RnO1SKIPu5jW5b7Ih_etDZfBImtRK353HQE18SWvTn_qnxGoZD9n5Ph3CL8kUS_aB4SeralkfZzTKiZWU4Z5yITgdrmjPNroBMYOW_Y3zj5lYvDLkBmtxc1CdVC23f3fas7geuQPdBdohTp9xqD-GiW3v2y4hEze0IpGBBPFabilkGab8m3biib3_-hF5B3tReEDW4IIr-fPAoYzJz-__SsMkSo0_3b06aVa_kdwfBolNpzPCDde7tIaBSZQpmm6p8HHmmJfiPn11y0YlUV9LsQj08lBmu31bhIkkSasb-7YzKHLd9znhRjHWf_n4E0ZlVatLBjHrp1BmNRUQGUqSCbT96hCL0p5VuaNa8T2HcxlcULaY-mvF-zz9SBln7zPao0zSodOV9YYRvj-F3BuGCSlT_-q9y3OIjp3VlH0iih3wfZrgU-bWcd0D-q3Jh9spiFziYLKD-b9IifSp0_v_1hvUjiVf7aW2kfr_7bBP2vmpg7vavf_vDA7tOQCJ2oo9II0qaKsy6o2pX0Z5vbMfgTCo_qjyu-VnOI0Y0cfrQ1Jf8Pp9Kx21sgmuKwGw10ZtbTd3AiVD-6R2aZUcCd76BTjFYjhz_oadXa_CjY3_2yEgTGo8OnvZ51ipLPULOzeeOyxyHaNJYbYBdnN5_OcOkbX_d861A3dcirVF3PmKjh0cRXY4m1Zy0V33kqFBD9spvLTiQGZDCV8oMSghiztTHqfglvUvdXW--Va_EaiXEinZ22M6VUdvzFoVXaSRqkpRjIEKXIO-vpH1b175VcebQdyosnzqd41jJO2EWUtzv36bME4RS8FxTjGGU6FswwrVaSsvyqVbA6x2EdVgNSqqAZjt1qgztpp13V_2pcHzxzFcxFq0Htdp06C1wNVb84c-36zi7asZfTZt5iOR2BNabRnX3-4JHzvIvmn9fL3mllWodWIUo07KYUE_UhVhcyc53ECiPB6vAbdIvZA9G_cfYif88uFz3SHqrSoTicyzUi0RN-c2hUO_xK4RleA5RpYZkEl-pA8mQh3Nb8J1SRdDnTyI4lz2S1WXpDEEFa_vwzqLkM7xQ3UVhnVGpwHUx5btYW-_JkmXL4BSEV2U-XryoWDlcqArKrqdsd_2cc1HX91o7Hq8fvcNs2wtjEHrd9OeuxB6ZXNd8Xqpwr-VWKeShdkjR3oFZyu0poWRUP1OvoE0Yf5os3bSLUm_3onNg_eJdCCuRE7r8Vuw5UzZS0frSpssNmm3kXnK5TaT8aCX_m3Zo7d-JYcLDI554RSxKkoxYJna6LfuyjWhN2oNKd-DFVBweiju5-1XhAXALcd3n2ZnWHqNx0nthn3yFxHkw8Jp0Vf_Ti1T-7iy7TmosVrmmQgZgtAH2m553ddmlUGfK01UXIpIxnfZO-jltNGXt2s23yw2VTfZCSbtenMtkOf6efVHM6o9X8fM9im1eLGGZhm04VL8N74-ARnD0gmJR5s5UKxmME6nVXdsjfR9z0NPSqP4')

		const msg = `<b>${dto.title}</b>`

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: '🍿 Go to watch'
						}
					]
				]
			}
		})
	}
}
