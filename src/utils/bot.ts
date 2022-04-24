import "dotenv/config";
import { Rest } from "api/rest";
import { Client, Collection } from "discord.js";
import { getSlashCommands } from "handlers/commands";
import { registerEvents } from "handlers/events";

import { Logger } from "./logger";

import type { CommandCollection } from "types/command";

export class Bot extends Client<true> {
	private readonly logger: Logger;

	public commands: CommandCollection;

	public constructor() {
		super({
			intents: [],
		});

		this.logger = new Logger();
		this.commands = new Collection();
		registerEvents(this);
	}

	public async run() {
		this.commands = await getSlashCommands(this);
		this.logger.info("Slash commands were registered");

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
