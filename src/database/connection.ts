import { setGlobalConnection } from "@techmmunity/symbiosis";
import { Connection } from "@techmmunity/symbiosis-mongodb";

import { ThreadsEntity } from "./entities/threads.entity";
import { UsersEntity } from "./entities/users.entity";

export const connectToMongo = async () => {
	const connection = await new Connection({
		databaseConfig: {
			databaseName: process.env.DATABASE_NAME,
			url: process.env.DATABASE_URL,
		},
		entities: [UsersEntity, ThreadsEntity],
	}).load();

	await connection.connect();
	setGlobalConnection<Connection>(connection);
};
