import { Column, Entity, PrimaryColumn } from "@techmmunity/symbiosis";

@Entity("threads")
export class ThreadsEntity {
	@PrimaryColumn({
		name: "_id",
	})
	public authorId: string;

	@Column()
	public supportChannelId: string;
}
