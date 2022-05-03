import { getGlobalConnection } from "@techmmunity/symbiosis";
import type { Connection, Repository } from "@techmmunity/symbiosis-mongodb";
import { GiveawaysEntity } from "database/entities/giveaways.entity";
import type { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import { getOrFetchChannel, getOrFetchMessage } from "utils/channels";
import { formatTime } from "utils/time";
import { formatUsername, getOrFetchUser } from "utils/users";

import { OptionTypeEnum } from "enums/option";
import type { CommandData, CommandHandler, CommandParams } from "types/command";

const addGiveaway = async (
	{ client, interaction }: CommandParams,
	giveawaysRepository: Repository<GiveawaysEntity>,
) => {
	const DEFAULT_COINS = 0;
	const REGEX_FOR_VALID_MS_STRING =
		/^(\d+d\s?)?(\d{1,2}h\s?)?(\d{1,2}m)?(\s{1,2}m)?$/;
	const HOURS_PER_DAY = 24;
	const MIN_AMOUNT_OF_WINNERS = 1;

	const title = interaction.options.getString("title");
	const description = interaction.options.getString("description");
	const coins = interaction.options.getNumber("coins") || DEFAULT_COINS;
	const author = interaction.options.getUser("author") || interaction.user;
	const endsAt = interaction.options.getString("timestamp");
	const amountOfWinners = interaction.options.getInteger("amount");
	if (amountOfWinners < MIN_AMOUNT_OF_WINNERS) {
		const invalidAmountOfWinnersEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("A quantidade de ganhadores deve ser maior ou igual a 1");

		await interaction.reply({
			embeds: [invalidAmountOfWinnersEmbed],
		});

		return;
	}

	if (!REGEX_FOR_VALID_MS_STRING.exec(endsAt)) {
		const invalidTimestampEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("Timestamp inválido");

		await interaction.reply({
			ephemeral: true,
			embeds: [invalidTimestampEmbed],
		});

		return;
	}

	const endsAtDate = new Date(ms(endsAt));
	const hours = endsAtDate.getUTCHours();
	const minutes = endsAtDate.getUTCMinutes();
	const seconds = endsAtDate.getUTCSeconds();

	const giveawaysChannel = (await getOrFetchChannel(
		client,
		process.env.GIVEAWAYS_CHANNEL_ID,
	)) as TextChannel;

	const newGiveawayEmbed = new MessageEmbed()
		.setColor("BLURPLE")
		.setTitle(title)
		.setDescription(description)
		.setAuthor({
			name: `Sorteio de ${formatUsername(author)}`,
			iconURL: author.displayAvatarURL({
				dynamic: true,
			}),
		})
		.setFooter({
			text: `Termina em**${formatTime([
				["dia", Number(hours / HOURS_PER_DAY)],
				["hora", hours],
				["minuto", minutes],
				["segundo", seconds],
			])}**`,
		});

	const giveawayMessage = await giveawaysChannel.send({
		embeds: [newGiveawayEmbed],
	});
	await giveawayMessage.react("✅");
	await giveawayMessage.react("❌");

	const { data: newGiveaway } = await giveawaysRepository.save({
		authorId: author.id,
		messageId: giveawayMessage.id,
		endsAt: Date.now() + ms(endsAt),
		title,
		description,
		coins,
	});
	client.giveaways.push(newGiveaway);

	const giveawayCreatedSuccessfullyEmbed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription("O sorteio foi criado com sucesso!");

	await interaction.reply({
		ephemeral: true,
		embeds: [giveawayCreatedSuccessfullyEmbed],
	});
};

const editGiveaway = async (
	{ client, interaction }: CommandParams,
	giveawaysRepository: Repository<GiveawaysEntity>,
) => {
	const giveawayMessageId = interaction.options.getString("id");
	const { data: currentGiveawayData } = await giveawaysRepository.findOne({
		where: {
			messageId: giveawayMessageId,
		},
	});
	if (!currentGiveawayData) {
		const giveawayNotFoundEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("Este sorteio não foi encontrado!");

		await interaction.reply({
			ephemeral: true,
			embeds: [giveawayNotFoundEmbed],
		});

		return;
	}

	const {
		title: currentTitle,
		description: currentDescription,
		coins: currentCoins,
		authorId,
	} = currentGiveawayData;

	if (!currentCoins && !currentDescription && !currentCoins) {
		const nonEditedComponentsEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("Nenhum componente do sorteio foi editado!");

		await interaction.reply({
			ephemeral: true,
			embeds: [nonEditedComponentsEmbed],
		});

		return;
	}

	const newTitle = interaction.options.getString("title") || currentTitle;
	const newDescription =
		interaction.options.getString("description") || currentDescription;
	const newCoins = interaction.options.getInteger("coins") || currentCoins;

	if (currentTitle || currentDescription) {
		const giveawaysChannel = (await getOrFetchChannel(
			client,
			process.env.GIVEAWAYS_CHANNEL_ID,
		)) as TextChannel;
		const giveawayMessage = giveawaysChannel.messages.cache.find(
			message => message.id === giveawayMessageId,
		);

		const giveawayAuthor = await getOrFetchUser(client, authorId);

		const editedGiveawayMessageEmbed = new MessageEmbed()
			.setColor("BLURPLE")
			.setTitle(newTitle)
			.setDescription(newDescription)
			.setAuthor({
				name: `Sorteio de ${formatUsername(giveawayAuthor)}`,
				iconURL: giveawayAuthor.displayAvatarURL({
					dynamic: true,
				}),
			});

		await giveawayMessage.edit({
			embeds: [editedGiveawayMessageEmbed],
		});
	}

	const { data: editedGiveaway } = await giveawaysRepository.save({
		messageId: giveawayMessageId,
		authorId,
		title: newTitle,
		description: newDescription,
		coins: newCoins,
	});
	client.giveaways.push(editedGiveaway);

	const successfullyEditedGiveawayEmbed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription("Sorteio editado com sucesso!");

	await interaction.reply({
		ephemeral: true,
		embeds: [successfullyEditedGiveawayEmbed],
	});
};

const removeGiveaway = async (
	{ client, interaction }: CommandParams,
	giveawaysRepository: Repository<GiveawaysEntity>,
) => {
	const giveawayMessageId = interaction.options.getString("id");
	const { data: isGiveawayDeleted } = await giveawaysRepository.delete({
		messageId: giveawayMessageId,
	});

	client.giveaways = client.giveaways.filter(
		giveaway => giveaway.messageId !== giveawayMessageId,
	);

	if (!isGiveawayDeleted) {
		const giveawayNotFoundEmbed = new MessageEmbed()
			.setColor("RED")
			.setDescription("Este sorteio não foi encontrado!");

		await interaction.reply({
			ephemeral: true,
			embeds: [giveawayNotFoundEmbed],
		});

		return;
	}

	const giveawaysChannel = (await getOrFetchChannel(
		client,
		process.env.GIVEAWAYS_CHANNEL_ID,
	)) as TextChannel;
	const giveawayMessage = await getOrFetchMessage(
		giveawaysChannel,
		giveawayMessageId,
	);

	await giveawayMessage.delete();

	const successfullyDeletedGiveawayEmbed = new MessageEmbed()
		.setColor("GREEN")
		.setDescription("Sorteio deletado com sucesso!");

	await interaction.reply({
		ephemeral: true,
		embeds: [successfullyDeletedGiveawayEmbed],
	});
};

export const handler: CommandHandler = async ({ client, interaction }) => {
	const giveawaysRepository =
		getGlobalConnection<Connection>().getRepository<GiveawaysEntity>(
			GiveawaysEntity,
		);

	switch (interaction.options.getSubcommand(false)) {
		case "add":
			await addGiveaway({ client, interaction }, giveawaysRepository);
			break;
		case "edit":
			await editGiveaway({ client, interaction }, giveawaysRepository);
			break;
		case "remove":
			await removeGiveaway({ client, interaction }, giveawaysRepository);
			break;
		default:
			return;
	}
};

export const data: CommandData = {
	name: "giveaway",
	description: "Ações relacionadas a sorteio",
	permissions: ["ADMINISTRATOR"],
	options: [
		{
			name: "add",
			description: "Inicia um sorteio",
			type: OptionTypeEnum.SUB_COMMAND,
			options: [
				{
					name: "title",
					description: "Título",
					required: true,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "description",
					description: "Descrição",
					required: true,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "timestamp",
					description: "O tempo disponível para entrar no sorteio",
					required: true,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "coins",
					description: "A quantidade de moedas que será ganha no sorteio",
					required: false,
					type: OptionTypeEnum.INTEGER,
				},
				{
					name: "author",
					description: "O autor do sorteio",
					required: false,
					type: OptionTypeEnum.USER,
				},
				{
					name: "amount",
					description: "Quantidade de ganhadores",
					required: false,
					type: OptionTypeEnum.INTEGER,
				},
			],
		},
		{
			name: "edit",
			description: "Inicia um sorteio",
			type: OptionTypeEnum.SUB_COMMAND,
			options: [
				{
					name: "id",
					description: "Id da mensagem do sorteio",
					required: true,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "title",
					description: "Novo título",
					required: false,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "description",
					description: "Nova descrição",
					required: false,
					type: OptionTypeEnum.STRING,
				},
				{
					name: "coins",
					description: "Nova quantidade de moedas que será ganha no sorteio",
					required: false,
					type: OptionTypeEnum.INTEGER,
				},
			],
		},
		{
			name: "remove",
			description: "Remove um sorteio",
			type: OptionTypeEnum.SUB_COMMAND,
			options: [
				{
					name: "id",
					description: "Id da mensagem do sorteio",
					required: true,
					type: OptionTypeEnum.STRING,
				},
			],
		},
	],
};
