import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";
import type { Bot } from "utils/bot";

import type { BaseCommand } from "types/command";

export const getSlashCommands = async (client: Bot) => {
	const commandsPath = resolve(__dirname, "..", "extensions", "commands");
	const commands = new Collection<string, BaseCommand>();

	const commandsDir = readdirSync(commandsPath);
	for (const commandPath of commandsDir) {
		// eslint-disable-next-line no-await-in-loop
		const command = await import(resolve(commandsPath, commandPath));

		const commandInstance = new command.Command(client) as BaseCommand;

		const { data } = commandInstance;

		commands.set(data.name, commandInstance);
	}

	return commands;
};
