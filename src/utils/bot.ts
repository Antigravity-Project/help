import "dotenv/config";
import { getGlobalConnection } from "@techmmunity/symbiosis";
import type { Connection } from "@techmmunity/symbiosis-mongodb";
import { Rest } from "api/rest";
import { connectToMongo } from "database/connection";
import { GiveawaysEntity } from "database/entities/giveaways.entity";
import { UsersEntity } from "database/entities/users.entity";
import { Client, Collection } from "discord.js";
import {
	handleGiveaways,
	HANDLE_GIVEAWAYS_MS,
} from "extensions/tasks/handle-giveaways";
import { getSlashCommands } from "handlers/commands";
import { registerEvents } from "handlers/events";

import { Logger } from "./logger";

import type { CommandCollection } from "types/command";
import { IntentsEnum } from "types/intents";

export class Bot extends Client<true> {
	private readonly logger: Logger;

	public commands: CommandCollection;

	public giveaways: Array<GiveawaysEntity>;

	public constructor() {
		super({
			intents: IntentsEnum.ALL,
			partials: ["CHANNEL"],
		});

		this.logger = new Logger();
		this.commands = new Collection();
		this.giveaways = [];
	}

	public async run() {
		await registerEvents(this);
		this.logger.info("Events were registered");

		this.commands = await getSlashCommands();
		this.logger.info("Slash commands were registered");

		await connectToMongo();
		this.logger.info("Connected to the database");

		const connection = getGlobalConnection<Connection>();

		const giveawaysRepository =
			connection.getRepository<GiveawaysEntity>(GiveawaysEntity);

		this.giveaways = (await giveawaysRepository.find({})).data;
		this.logger.info("Giveaways were cached");

		try {
			await this.login(process.env.BOT_TOKEN);

			try {
				await new Rest(this.commands).registerSlashCommands();
			} catch (error) {
				this.logger.error(error);
			}

			this.logger.info("Bot ready");

			const usersRepository =
				connection.getRepository<UsersEntity>(UsersEntity);

			setInterval(
				handleGiveaways,
				HANDLE_GIVEAWAYS_MS,
				this,
				giveawaysRepository,
				usersRepository,
			);
		} catch (error) {
			this.logger.error(error);
		}
	}
}
