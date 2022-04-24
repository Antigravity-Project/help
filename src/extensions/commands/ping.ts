import type { CommandInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";

import { BaseCommand } from "types/command";

export class Command extends BaseCommand {
	public constructor() {
		super({
			name: "ping",
			description: "Veja a latência do bot",
		});
	}

	public async execute(interaction: CommandInteraction) {
		const embed = new MessageEmbed().setDescription(
			`🔌〡Latência da API: **${this.client.ws.ping}ms**`,
		);

		await interaction.reply({
			embeds: [embed],
		});
	}
}
