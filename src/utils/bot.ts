import "dotenv/config";
import { Rest } from "api/rest";
import { connectToMongo } from "database/connection";
import type { GuildMember } from "discord.js";
import { Client, Collection, MessageEmbed } from "discord.js";
import { getSlashCommands } from "handlers/commands";

import { Logger } from "./logger";
import { hasPermission } from "./permissions";

import type { CommandCollection } from "types/command";

export class Bot extends Client<true> {
	private readonly logger: Logger;

	public commands: CommandCollection;

	public constructor() {
		super({
			intents: [],
		});

		this.logger = new Logger();
		this.commands = new Collection();
	}

	public async run() {
		this.commands = await getSlashCommands(this);
		this.logger.info("Slash commands were registered");

		await connectToMongo();
		this.logger.info("Connected to the database");

		this.on("interactionCreate", async interaction => {
			if (!interaction.isCommand() || interaction.channel?.type === "DM") return; // eslint-disable-line prettier/prettier

			const command = this.commands.get(interaction.commandName);
			if (!hasPermission(interaction.member as GuildMember, command)) {
				const permissionErrorEmbed = new MessageEmbed()
					.setColor("RED")
					.setDescription("Você não tem permissão para usar este comando!");

				await interaction.reply({
					ephemeral: true,
					embeds: [permissionErrorEmbed],
				});
			}

			try {
				await command.execute(interaction);
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
				this.logger.error(error);
			}
		});

		try {
			await this.login(process.env.BOT_TOKEN);

			try {
				await new Rest(this.commands).registerSlashCommands();
			} catch (error) {
				this.logger.error(error);
			}

			this.logger.info("Bot ready");
		} catch (error) {
			this.logger.error(error);
		}
	}
}
