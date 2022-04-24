import type {
	Collection,
	CommandInteraction,
	PermissionResolvable,
} from "discord.js";
import type { Bot } from "utils/bot";

import type { OptionTypeEnum } from "enums/option";

export type CommandPermissions = Record<string, PermissionResolvable>;

export type CommandCollection = Collection<string, BaseCommand>;

export interface CommandOptions {
	name: string;
	description: string;
	type: OptionTypeEnum;
	required: boolean;
	options?: Array<CommandOptions>;
}

export interface CommandData {
	name: string;
	description: string;
	options?: Array<CommandOptions>;
	defaultPermissions?: boolean;
	type?: OptionTypeEnum;
}

export abstract class BaseCommand {
	public client: Bot;

	public permissions: CommandPermissions;

	public data: CommandData;

	public constructor(data: CommandData) {
		this.data = data;
	}

	public abstract execute(interaction: CommandInteraction): Promise<void>;
}
