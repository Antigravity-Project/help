import type { CommandInteraction, CacheType } from "discord.js";
import type { Bot } from "utils/bot";

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
		const suggestionContent = interaction.options.get("conteúdo");
		console.log(suggestionContent);

		await interaction.reply({
			content: "Check the terminal",
		});
	}
}
