import type { GuildMember } from "discord.js";
import type { Command } from "extensions/commands/ping";

export const hasPermission = (
	member: GuildMember,
	{ permissions }: Command,
) => {
	if (permissions) {
		for (const commandPermission of Object.values(permissions)) {
			if (!member.permissions.has(commandPermission)) {
				return false;
			}
		}
	}

	return true;
};
