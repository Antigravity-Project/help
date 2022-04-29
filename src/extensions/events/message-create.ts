import { getGlobalConnection } from "@techmmunity/symbiosis";
import type { Connection } from "@techmmunity/symbiosis-mongodb";
import { ThreadsEntity } from "database/entities/threads.entity";
import type { Message, TextChannel } from "discord.js";
import { appendFile, unlink } from "fs/promises";
import { resolve } from "path";
import { getOrFetchChannel } from "utils/channels";

import type { EventData, EventHandler } from "types/events";

export const handler: EventHandler = async ({ client }, message: Message) => {
	if (
		message.author.bot ||
		message.channel.type !== "GUILD_TEXT" ||
		message.channel.parentId !== process.env.SUPPORT_CATEGORY_ID
	) return; // eslint-disable-line prettier/prettier

	const threadsRepository =
		getGlobalConnection<Connection>().getRepository<ThreadsEntity>(
			ThreadsEntity,
		);

	const keywordsToFinishSupport = ["encerrar", "apagar", "close"];
	if (keywordsToFinishSupport.includes(message.content)) {
		const filePath = resolve(
			__dirname,
			"..",
			"..",
			"data",
			`${message.author.id}.txt`,
		);
		let logs = "";
		message.channel.messages.cache.forEach(channelMessage => {
			logs += `[ ${channelMessage.createdAt} ] ${channelMessage.author.tag}: ${channelMessage.content}\n`;
		});

		appendFile(filePath, logs, {
			encoding: "utf-8",
		});

		const supportLogsChannel = (await getOrFetchChannel(
			client,
			process.env.SUPPORT_LOGS_CHANNEL_ID,
		)) as TextChannel;

		await supportLogsChannel.send({
			files: [filePath],
		});
		unlink(filePath);

		await threadsRepository.delete({
			authorId: message.channel.name,
		});
		await message.channel.delete("Support finished");
	}
};

export const data: EventData = {
	name: "messageCreate",
};
