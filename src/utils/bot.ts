import "dotenv/config";
import { Rest } from "api/rest";
import { connectToMongo } from "database/connection";
import { Client, Collection } from "discord.js";
import { getSlashCommands } from "handlers/commands";
import { registerEvents } from "handlers/events";

import { Logger } from "./logger";

import type { CommandCollection } from "types/command";
import { IntentsEnum } from "types/intents";

export class Bot extends Client<true> {
	private readonly logger: Logger;

	public commands: CommandCollection;

	public constructor() {
		super({
			intents: IntentsEnum.ALL,
		});

		this.logger = new Logger();
		this.commands = new Collection();
	}

	public async run() {
		await registerEvents(this);
		this.logger.info("Events were registered");

		this.commands = await getSlashCommands();
		this.logger.info("Slash commands were registered");

		await connectToMongo();
		this.logger.info("Connected to the database");

		try {
			await this.login(process.env.BOT_TOKEN);

			try {
				await new Rest(this.commands).registerSlashCommands();
			} catch (error) {
				this.logger.error(error);
			}

			this.logger.info("Bot ready");
		} catch (error) {
			this.logger.error(error);
		}
	}
}
