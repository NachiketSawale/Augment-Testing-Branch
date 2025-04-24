import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsRegionCatalogEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public ChildItems!: BasicsRegionCatalogEntity[];
	public RegionCatalogFk?: number;
	public RegionTypeFk?: number;
	public UoMFk?: number;
	public CommentTextInfo!: IDescriptionInfo;
	public OrgCode!: string;
	public Sorting!: number;
	public IsDefault!: boolean;
	public IsLive!: boolean;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
