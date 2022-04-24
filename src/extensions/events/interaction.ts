import type { GuildMember, Interaction } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { Bot } from "utils/bot";
import { Logger } from "utils/logger";
import { hasPermission } from "utils/permissions";

import { BaseEvent } from "types/events";

export class Event extends BaseEvent {
	private readonly logger: Logger;

	public constructor(public client: Bot) {
		super({
			name: "interactionCreate",
		});

		this.logger = new Logger();
	}

	public async run(interaction: Interaction): Promise<void> {
		if (!interaction.isCommand() || interaction.channel?.type === "DM") return;

		const command = this.client.commands.get(interaction.commandName);
		if (!hasPermission(interaction.member as GuildMember, command)) {
			const missingPermissionEmbed = new MessageEmbed()
				.setColor("RED")
				.setDescription("Você não tem permissão para usar este comando.");

			await interaction.reply({
				embeds: [missingPermissionEmbed],
			});

			return;
		}

		await command.execute(interaction);
	}
}
