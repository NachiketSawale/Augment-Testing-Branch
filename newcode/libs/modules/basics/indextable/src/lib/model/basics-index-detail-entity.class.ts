import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsIndexDetailEntity implements IEntityIdentification {
	public Id!: number;
	public BasIndexHeaderFk!: number;
	public DescriptionInfo!: IDescriptionInfo;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
