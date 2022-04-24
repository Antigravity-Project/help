import type { CommandInteraction, TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { Bot } from "utils/bot";
import { getOrFetchChannel } from "utils/channels";

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

		const suggestionEmbed = new MessageEmbed()
			.setColor("YELLOW")
			.setAuthor({
				name: `Sugestão de ${interaction.user.username}`,
				iconURL: interaction.user.avatarURL({
					dynamic: true,
				}),
			})
			.setDescription(suggestionContent);

		await suggestionChannel.send({
			embeds: [suggestionEmbed],
		});

		const suggestionSuccessfullySentEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription("Sugestão enviada com sucesso!");

		await interaction.reply({
			embeds: [suggestionSuccessfullySentEmbed],
		});
	}
}
