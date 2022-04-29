import { getGlobalConnection } from "@techmmunity/symbiosis";
import type { Connection } from "@techmmunity/symbiosis-mongodb";
import { ThreadsEntity } from "database/entities/threads.entity";
import type { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import { mentionChannel } from "utils/channels";

import type { CommandData, CommandHandler } from "types/command";

export const handler: CommandHandler = async ({ interaction }) => {
	const threadsRepository =
		getGlobalConnection<Connection>().getRepository<ThreadsEntity>(
			ThreadsEntity,
		);

	const supportChannel = (await interaction.guild.channels.create(
		interaction.user.id,
		{
			permissionOverwrites: [
				{
					id: interaction.guild.roles.everyone.id,
					deny: ["VIEW_CHANNEL"],
				},
				{
					id: interaction.user.id,
					allow: ["SEND_MESSAGES"],
				},
			],
			parent: process.env.SUPPORT_CATEGORY_ID,
		},
	)) as TextChannel;

	await threadsRepository.save({
		authorId: interaction.user.id,
		supportChannelId: supportChannel.id,
	});

	const notifySupportRequestEmbed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription(
			`Seu suporte foi solicitado com sucesso. Acesse seu chat de suporte em ${mentionChannel(
				supportChannel,
			)}`,
		);

	await interaction.reply({
		ephemeral: true,
		embeds: [notifySupportRequestEmbed],
	});
};

export const data: CommandData = {
	name: "suporte",
	description: "Solicita uma sessão de suporte",
};
