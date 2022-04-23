/* eslint-disable no-console */

import { green, red, yellow } from "colors";

export class Logger {
	public info(message: string) {
		console.log(`${yellow("[ INFO ]")} ${green(message)}`);
	}

	public error(message: string) {
		console.log(red(message));
	}
}
