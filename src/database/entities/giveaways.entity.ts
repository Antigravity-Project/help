import { Column, Entity, PrimaryColumn } from "@techmmunity/symbiosis";

@Entity("giveaways")
export class GiveawaysEntity {
	@PrimaryColumn({
		name: "_id",
	})
	public messageId: string;

	@Column()
	public authorId: string;

	@Column()
	public title: string;

	@Column()
	public description: string;

	@Column()
	public endsAt: number;

	@Column()
	public coins: number;

	@Column()
	public amountOfWinners: number;
}
