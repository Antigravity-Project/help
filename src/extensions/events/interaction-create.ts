import type { GuildMember } from "discord.js";
import { MessageEmbed } from "discord.js";
import { hasPermission } from "utils/permissions";

import type { EventData, EventHandler } from "types/events";

export const handler: EventHandler = async (
	{ client, logger },
	interaction,
) => {
	if (!interaction.isCommand()) return; // eslint-disable-line prettier/prettier

	const command = client.commands.get(interaction.commandName);
	const interactionMember = interaction.member as GuildMember;
	const hasPermissions = hasPermission(interactionMember, command);

	if (!hasPermissions) {
		const permissionErrorEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("Você não tem permissão para usar este comando!");

		await interaction.reply({
			ephemeral: true,
			embeds: [permissionErrorEmbed],
		});
	}

	try {
		await command.handler({
			client,
			interaction,
		});
	} catch (error) {
		const genericErrorEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription(
				"Ocorreu um erro ao executar este comando. Perdão pela inconveniência!",
			);

		await interaction.reply({
			embeds: [genericErrorEmbed],
			ephemeral: true,
		});
		logger.error(error);
	}
};

export const data: EventData = {
	name: "interactionCreate",
};
