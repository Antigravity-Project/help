import type { Message, User } from "discord.js";

export const getLastMessageFromTheUser = (
	author: User,
	messages: Array<Message>,
) => {
	const LAST_MESSAGE_INDEX = -1;

	const messagesSentByTheUser = messages.filter((message: Message) => {
		return message.author.id === author.id;
	});
	const lastMessageSentByTheUser = messagesSentByTheUser[LAST_MESSAGE_INDEX];

	return lastMessageSentByTheUser;
};
