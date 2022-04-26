import type { Message } from "discord.js";

import type { EventData, EventHandler } from "types/events";

export const handler: EventHandler = async (_params, message: Message) => {
	if (message.author.bot) return;
	console.log(message.content);
};

export const data: EventData = {
	name: "messageCreate",
};
