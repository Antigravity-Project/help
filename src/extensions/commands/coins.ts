import { getGlobalConnection } from "@techmmunity/symbiosis";
import type { Connection } from "@techmmunity/symbiosis-mongodb";
import { UsersEntity } from "database/entities/users.entity";
import type { CommandInteraction } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { Bot } from "utils/bot";

import { OptionTypeEnum } from "enums/option";
import { BaseCommand } from "types/command";

export class Command extends BaseCommand {
	public client: Bot;

	public constructor(client: Bot) {
		super({
			name: "coins",
			description: "Remove/adiciona GC$ a um usuário",
			options: [
				{
					name: "target",
					description: "Id do alvo",
					required: true,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "quantity",
					description: "Quantidade de coins",
					required: true,
					type: OptionTypeEnum.INTEGER,
				},
			],
		});

		this.permissions = ["ADMINISTRATOR"];
		this.client = client;
	}

	public async execute(interaction: CommandInteraction) {
		const connection = getGlobalConnection<Connection>();
		const usersRepository = connection.getRepository<UsersEntity>(UsersEntity);
		const quantityOfCoins = interaction.options.get("quantity").value as number;
		const targetId = interaction.options.get("target").value as number;

		const { data: target } = await usersRepository.findOne({
			where: {
				id: targetId.toString(),
			},
		});

		if (!target) {
			const userNotFoundEmbed = new MessageEmbed()
				.setColor("RED")
				.setDescription("Não pude encontrar este usuário.");

			await interaction.reply({
				ephemeral: true,
				embeds: [userNotFoundEmbed],
			});

			return;
		}

		target.coin += quantityOfCoins;
		const { data: updatedTarget } = await usersRepository.save(target);
		const { coin: coinsFromUpdatedTarget } = updatedTarget;

		const successfullyUpdatedEmbed = new MessageEmbed()
			.setColor("GREEN")
			.setDescription(
				`A quantidade de coins foi alterada com sucesso! Agora o usuário possui **${coinsFromUpdatedTarget}** GC$.`,
			);

		await interaction.reply({
			embeds: [successfullyUpdatedEmbed],
		});
	}
}
