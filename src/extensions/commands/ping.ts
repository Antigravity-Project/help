import type { CommandInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { Bot } from "utils/bot";

import { BaseCommand } from "types/command";

export class Command extends BaseCommand {
	public constructor(public client: Bot) {
		super({
			name: "ping",
			description: "Veja a latência do bot",
		});
	}

	public async execute(interaction: CommandInteraction) {
		const embed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription(`🔌〡Latência da API: **${this.client.ws.ping}ms**`);

		await interaction.reply({
			embeds: [embed],
		});
	}
}
