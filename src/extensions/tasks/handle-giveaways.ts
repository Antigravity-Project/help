import { Plus } from "@techmmunity/symbiosis";
import type { Repository } from "@techmmunity/symbiosis-mongodb";
import type { GiveawaysEntity } from "database/entities/giveaways.entity";
import type { UsersEntity } from "database/entities/users.entity";
import type { TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";
import type { Bot } from "utils/bot";
import { getOrFetchChannel, getOrFetchMessage } from "utils/channels";
import { getPlural } from "utils/string";

export const handleGiveaways = (
	client: Bot,
	giveawaysRepository: Repository<GiveawaysEntity>,
	usersRepository: Repository<UsersEntity>,
) => {
	client.giveaways.forEach(async giveaway => {
		if (Date.now() >= giveaway.endsAt) {
			const giveawaysChannel = (await getOrFetchChannel(
				client,
				process.env.GIVEAWAYS_CHANNEL_ID,
			)) as TextChannel;
			const giveawayMessage = await getOrFetchMessage(
				giveawaysChannel,
				giveaway.messageId,
			);

			const giveawayParticipants = (
				await giveawayMessage.reactions.cache
					.filter(reaction => reaction.emoji.name === "✅")
					.first()
					.users.fetch()
			).filter(user => !user.bot);

			const giveawayWinners = giveawayParticipants.random(
				giveaway.amountOfWinners,
			);

			giveawayWinners.forEach(async winner => {
				await usersRepository.save({
					id: winner.id,
					coin: Plus(giveaway.coins),
				});
			});

			const notifyWinnersEmbed = new MessageEmbed()
				.setColor("GREEN")
				.setDescription(
					`${giveawayWinners.join(",")} ${getPlural(
						"ganhou",
						"ganharam",
						giveawayWinners.length,
					)} o sorteio! Parabéns!`,
				);
			await giveawaysChannel.send({
				embeds: [notifyWinnersEmbed],
			});

			await giveawaysRepository.delete({
				messageId: giveaway.messageId,
			});
		}
	});
};

export const HANDLE_GIVEAWAYS_MS = 10000;
