import { IEntityIdentification } from '@libs/platform/common';

export class BasicsCountryStateEntity implements IEntityIdentification {
	public Id!: number;
	public Description!: string;
	public CountryFk!: number;
	public State?: string;
	public Sorting!: number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
