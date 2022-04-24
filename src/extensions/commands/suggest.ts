import type { CommandInteraction, TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import type { Bot } from "utils/bot";
import { getOrFetchChannel, getOrFetchLastMessage } from "utils/channels";
import { formatTime } from "utils/time";

import { OptionTypeEnum } from "enums/option";
import { BaseCommand } from "types/command";

export class Command extends BaseCommand {
	public client: Bot;

	public constructor(client: Bot) {
		super({
			name: "sugerir",
			description: "Faça uma sugestão para o bot ou servidor de suporte",
			options: [
				{
					name: "conteúdo",
					description: "O conteúdo da sugestão",
					required: true,
					type: OptionTypeEnum.STRING,
				},
			],
		});

		this.client = client;
	}

	public async execute(interaction: CommandInteraction) {
		const suggestionContent = interaction.options.get("conteúdo")
			.value as string;

		const suggestionChannel = (await getOrFetchChannel(
			this.client,
			process.env.SUGGESTION_CHANNEL_ID,
		)) as TextChannel;

		const lastMessageTimestamp = (
			await getOrFetchLastMessage(suggestionChannel)
		).createdTimestamp;
		const lastMessageAfterFiveMinutes = lastMessageTimestamp + ms("5m");

		if (lastMessageAfterFiveMinutes >= Date.now()) {
			const date = new Date(lastMessageAfterFiveMinutes - Date.now());
			const minutes = date.getUTCMinutes();
			const seconds = date.getUTCSeconds();

			const rateLimitEmbed = new MessageEmbed().setColor("RED").setDescription(
				`Uma sugestão só pode ser dada a cada 5 minutos. Espere mais **${formatTime(
					[
						["minuto", minutes],
						["segundo", seconds],
					],
				)}** para sugerir algo.`,
			);

			await interaction.reply({
				ephemeral: true,
				embeds: [rateLimitEmbed],
			});

			return;
		}

		const suggestionEmbed = new MessageEmbed()
			.setColor("YELLOW")
			.setAuthor({
				name: `Sugestão de ${interaction.user.username}`,
				iconURL: interaction.user.avatarURL({
					dynamic: true,
				}),
			})
			.setDescription(suggestionContent);

		const newSuggestion = await suggestionChannel.send({
			embeds: [suggestionEmbed],
		});
		await newSuggestion.react("✅");
		await newSuggestion.react("❌");

		await suggestionChannel.threads.create({
			name: "Discussão",
			invitable: false,
			startMessage: newSuggestion,
		});

		const suggestionSuccessfullySentEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription("Sugestão enviada com sucesso!");

		await interaction.reply({
			ephemeral: true,
			embeds: [suggestionSuccessfullySentEmbed],
		});
	}
}
