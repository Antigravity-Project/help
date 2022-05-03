import type { ClientEvents } from "discord.js";
import type { Bot } from "utils/bot";
import type { Logger } from "utils/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventHandler = (params: EventParams, ...args: any) => Promise<void>;

export interface EventData {
	name: keyof ClientEvents;
	once?: boolean;
}

export interface EventParams {
	client: Bot;
	logger: Logger;
}

export interface Event {
	data: EventData;
	handler: EventHandler;
}

export abstract class BaseEvent {
	public client: Bot;

	public constructor(client: Bot) {
		this.client = client;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any): Promise<void>;
}
