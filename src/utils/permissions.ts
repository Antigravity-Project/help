import type { GuildMember } from "discord.js";
import type { Command } from "extensions/commands/ping";

export const hasPermission = (
	{ permissions: memberPermissions }: GuildMember,
	{ permissions }: Command,
): boolean => {
	Object.entries(permissions).forEach(([_name, permission]) => {
		if (!memberPermissions.has(permission)) {
			return false;
		}
	});

	return true;
};
