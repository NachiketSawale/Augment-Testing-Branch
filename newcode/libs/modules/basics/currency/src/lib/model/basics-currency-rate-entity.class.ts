import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsCurrencyRateEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public CurrencyRateTypeFk! : number;
	public CurrencyConversionFk!:number;
	public CurrencyHomeFk!:number;
	public CurrencyForeignFk!:number;
	public RateDate!:Date;
	public Rate!:number;
	public CommentText!:string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
