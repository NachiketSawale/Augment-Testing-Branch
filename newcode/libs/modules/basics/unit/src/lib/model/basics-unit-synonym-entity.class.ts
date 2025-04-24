import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsUnitSynonymEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
   public UnitFk!:number;
	public Synonym!:string;
	public Quantity!:number;
	public RoundingPrecision!:number;
	public Factor!:number;
	public CommentText!:string;
	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
