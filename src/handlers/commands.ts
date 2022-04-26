import { Collection } from "discord.js";
import { readdirSync } from "fs";
import { resolve } from "path";

import type { Command } from "types/command";

export const getSlashCommands = async () => {
	const commandsPath = resolve(__dirname, "..", "extensions", "commands");
	const commands = new Collection<string, Command>();

	const commandsDir = readdirSync(commandsPath);
	for (const commandPath of commandsDir) {
		// eslint-disable-next-line no-await-in-loop
		const command = (await import(
			resolve(commandsPath, commandPath)
		)) as Command;

		const { data, handler } = command;
		const { name: commandName } = data;
		const commandInstance: Command = {
			data,
			handler,
		};

		commands.set(commandName, commandInstance);
	}

	return commands;
};
