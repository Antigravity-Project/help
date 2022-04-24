import {
	SubEntity,
	Column,
	Entity,
	PrimaryColumn,
} from "@techmmunity/symbiosis";

@SubEntity()
export class Engines {
	@Column()
	public duration: number;

	@Column()
	public id: string;
}

@SubEntity()
export class BlockList {
	@Column()
	public isBlockListed: boolean;

	@Column()
	public isPermanent: boolean;

	@Column()
	public expiresAt?: number;

	@Column()
	public reason?: string;
}

@SubEntity()
export class Profile {
	@Column({
		type: String,
		defaultValue: [],
	})
	public backgrounds: Array<string>;

	@Column({
		defaultValue: "Defina uma mensagem utilizando o comando sobremim",
		type: String,
	})
	public aboutMe: string;
}

@Entity("users")
export class UsersEntity {
	@PrimaryColumn({
		name: "_id",
	})
	public id: string;

	@Column(BlockList)
	public blockList: BlockList;

	@Column({
		defaultValue: 0,
	})
	public coin: number;

	@Column({
		type: Number,
		defaultValue: 0,
	})
	public dailyCooldown: number;

	@Column()
	public profile: Profile;

	@Column({
		type: Engines,
		defaultValue: [],
	})
	public engines?: Engines;

	@Column()
	public globalBan: boolean;
}
