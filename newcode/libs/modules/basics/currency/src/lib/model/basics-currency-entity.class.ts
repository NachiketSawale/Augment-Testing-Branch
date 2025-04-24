import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsCurrencyEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Currency!:string;
	public SortBy!:number;
	public IsDefault!: boolean;
	public  ConversionPrecision!:number;
	public DisplayPrecision!: number;
	public RoundlogicTypeFk!:number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
