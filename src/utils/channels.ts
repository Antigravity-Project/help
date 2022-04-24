import type { TextChannel } from "discord.js";

import type { Bot } from "./bot";

export const getOrFetchChannel = async (client: Bot, channelId: string) => {
	const cachedChannel = client.channels.cache.get(channelId);
	if (!cachedChannel) {
		const fetchedChannel = await client.channels.fetch(channelId);

		return fetchedChannel;
	}

	return cachedChannel;
};

export const getOrFetchLastMessage = async (channel: TextChannel) => {
	const lastMessageId = channel.lastMessageId;

	const cachedLastMessage = channel.messages.cache.get(lastMessageId);
	if (!cachedLastMessage) {
		const fetchedLastMessage = await channel.messages.fetch(lastMessageId);

		return fetchedLastMessage;
	}

	return cachedLastMessage;
};
