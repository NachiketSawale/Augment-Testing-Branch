import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsCurrencyConversionEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public CurrencyForeignFk!: number;
	public CurrencyHomeFk!: number;
	public Basis!: number;
	public Comment!: IDescriptionInfo;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
