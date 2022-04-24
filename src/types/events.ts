import type { ClientEvents } from "discord.js";
import type { Bot } from "utils/bot";

export interface EventData {
	name: keyof ClientEvents;
	once?: boolean;
}

export abstract class BaseEvent {
	public client: Bot;

	public data: EventData;

	public constructor(client: Bot, data: EventData) {
		this.data = data;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any): Promise<void>;
}
