import { readdirSync } from "fs";
import { resolve } from "path";
import type { Bot } from "utils/bot";

import type { BaseEvent } from "types/events";

export const registerEvents = async (client: Bot) => {
	const eventsPath = resolve(__dirname, "..", "extensions", "events");
	const eventsDir = readdirSync(eventsPath);

	for (const eventPath of eventsDir) {
		// eslint-disable-next-line no-await-in-loop
		const event = await import(resolve(eventsPath, eventPath));

		const { data, run } = new event.Event() as BaseEvent;
		const { name, once } = data;
		if (once) {
			client.once(name, (...args) => {
				run(...args);
			});
		} else {
			client.on(name, (...args) => {
				run(...args);
			});
		}
	}
};
