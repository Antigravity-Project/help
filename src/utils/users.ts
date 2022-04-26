import type { User } from "discord.js";

import type { Bot } from "./bot";

export const formatUsername = (user: User) => {
	return `${user.username}#${user.discriminator}`;
};

export const getOrFetchUser = async (client: Bot, userId: string) => {
	const cachedUser = client.users.cache.get(userId);
	if (!cachedUser) {
		const fetchedUser = await client.users.fetch(userId);

		return fetchedUser;
	}

	return cachedUser;
};
