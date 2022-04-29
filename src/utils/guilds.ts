import type { Bot } from "./bot";

export const getOrFetchGuild = async (client: Bot, guildId: string) => {
	const cachedGuild = client.guilds.cache.get(guildId);
	if (!cachedGuild) {
		const fetchedGuild = await client.guilds.fetch(guildId);

		return fetchedGuild;
	}

	return cachedGuild;
};
