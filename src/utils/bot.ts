import "dotenv/config";
import { Client } from "discord.js";

import { Logger } from "./logger";

export class Bot extends Client<true> {
	public logger: Logger;

	public constructor() {
		super({
			intents: [],
		});

		this.logger = new Logger();
	}

	public async run() {
		try {
			await this.login(process.env.BOT_TOKEN);
			this.logger.info("Bot ready");
		} catch (error) {
			this.logger.error(error);
		}
	}
}
