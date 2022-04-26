import { readdirSync } from "fs";
import { resolve } from "path";
import type { Bot } from "utils/bot";
import { Logger } from "utils/logger";

import type { Event } from "types/events";

export const registerEvents = async (client: Bot) => {
	const eventsPath = resolve(__dirname, "..", "extensions", "events");
	const logger = new Logger();

	const eventsDir = readdirSync(eventsPath);
	for (const eventPath of eventsDir) {
		try {
			// eslint-disable-next-line no-await-in-loop
			const event = (await import(resolve(eventsPath, eventPath))) as Event;

			const { data, handler } = event;
			const { name: eventName, once } = data;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const eventProcedure = (...args: Array<any>) => {
				handler(
					{
						client,
						logger,
					},
					...args,
				);
			};

			if (once) {
				client.once(eventName, eventProcedure);
			} else {
				client.on(eventName, eventProcedure);
			}
		} catch (error) {
			logger.error(error);
		}
	}
};
