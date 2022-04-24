import type { Bot } from "./bot";

export const getOrFetchChannel = async (client: Bot, channelId: string) => {
	const cachedChannel = client.channels.cache.get(channelId);
	if (!cachedChannel) {
		const fetchedChannel = await client.channels.fetch(channelId);

		return fetchedChannel;
	}

	return cachedChannel;
};
