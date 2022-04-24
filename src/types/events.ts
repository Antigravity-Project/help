import type { ClientEvents } from "discord.js";

export interface EventData {
	name: keyof ClientEvents;
	once?: boolean;
}

export abstract class BaseEvent {
	public data: EventData;

	public constructor(data: EventData) {
		this.data = data;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public abstract run(...args: any): Promise<void>;
}
