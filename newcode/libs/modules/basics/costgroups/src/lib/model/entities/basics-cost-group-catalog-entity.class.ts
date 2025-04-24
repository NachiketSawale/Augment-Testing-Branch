import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsCostGroupCatalogEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public Code!: string;
	public IsLive!: boolean;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;

	public LicCostGroupCats: BasicsCostGroupCatalogEntity[] = [];
	public PrjCostGroupCats: BasicsCostGroupCatalogEntity[] = [];
}
