import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Logger } from "utils/logger";

import type { CommandCollection } from "types/command";

export class Rest {
	private readonly rest: REST;

	private readonly commands: CommandCollection;

	private readonly logger: Logger;

	public constructor(commands: CommandCollection) {
		this.rest = new REST().setToken(process.env.BOT_TOKEN);
		this.logger = new Logger();
		this.commands = commands;
	}

	public async registerSlashCommands() {
		try {
			if (process.env.NODE_ENV === "production") {
				await this.rest.put(Routes.applicationCommands(process.env.BOT_ID), {
					body: this.commands.map(({ data }) => data),
				});
			} else {
				await this.rest.put(
					Routes.applicationGuildCommands(
						process.env.BOT_ID,
						process.env.DEVELOPMENT_GUILD_ID,
					),
					{
						body: this.commands.map(({ data }) => data),
					},
				);
			}
		} catch (error) {
			this.logger.error(error as string);
		}
	}
}
