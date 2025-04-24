import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsUnitEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public UnitInfo!:string;
	public RoundingPrecision! : number;
	public UomTypeFk! : number;
	public IsLive! : boolean;
	public LengthDimension! : number;
	public MassDimension! : number;
	public TimeDimension!: number;
	public IsBase!: boolean;
   public Factor! : number;
	public Sorting! : number;
	public Fallback!:number;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
