import type {
	Collection,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";
import type { Bot } from "utils/bot";

import type { OptionTypeEnum } from "enums/option";

export type CommandPermissions = Array<PermissionResolvable>;

export type CommandCollection = Collection<string, Command>;

export type CommandHandler = (params: CommandParams) => Promise<void>;

export interface CommandOptions {
	name: string;
	description: string;
	type: OptionTypeEnum;
	required?: boolean;
	options?: Array<CommandOptions>;
	choices?: Record<string, string>;
}

export interface CommandData {
	name: string;
	description: string;
	options?: Array<CommandOptions>;
	defaultPermissions?: boolean;
	permissions?: CommandPermissions;
	type?: OptionTypeEnum;
}

export interface CommandParams {
	client: Bot;
	interaction: CommandInteraction;
}

export interface Command {
	data: CommandData;
	handler: CommandHandler;
}
