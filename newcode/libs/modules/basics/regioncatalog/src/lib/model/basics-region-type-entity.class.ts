import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsRegionTypeEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;

	public InsertedAt!: Date;
	public UpdatedAt?: Date;
	public Version!: number;
}
