/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export class BasicsSiteGridEntity implements IEntityIdentification {
	public Id!: number;
	public DescriptionInfo!: IDescriptionInfo;
	public ChildItems!: BasicsSiteGridEntity[];
	public Code!: number;
	public AddressFk!: string;
	public SiteTypeFk!: string;
	public SiteFk!: number;
	public ClerkMgrFk!: string;
	public ClerkVicemgrFk!: string;
	public ResourceFk!: string;
	public ResourceContextFk!: number;
	public AccessRightDescriptorFk!: string;
	public Remark!: string;
	public IsLive!: boolean;
	public LgmJobProdAreaFk!: string;
	public Isdisp!: boolean;
	public ProjectAdmFk!: string;
	public LgmJobAdrFk!: string;
	public BasSiteStockFk!: string;
	public Userdefined1!: string;
	public Userdefined2!: string;
	public Userdefined3!: string;
	public Userdefined4!: string;
	public Userdefined5!: string;
	public Sorting!: number;

	public InsertedAt!: Date;
	public InsertedBy!: number;
	public UpdatedAt?: Date;
	public UpdatedBy?: number;
	public Version!: number;
}
