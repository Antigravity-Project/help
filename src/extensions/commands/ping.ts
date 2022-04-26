import { MessageEmbed } from "discord.js";

import type { CommandData, CommandHandler } from "types/command";

export const handler: CommandHandler = async ({ client, interaction }) => {
	const embed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription(`🔌〡Latência da API: **${client.ws.ping}ms**`);

	await interaction.reply({
		embeds: [embed],
	});
};

export const data: CommandData = {
	name: "ping",
	description: "Veja a latência do bot",
};
