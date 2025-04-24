import { IDescriptionInfo, IEntityIdentification } from '@libs/platform/common';

export interface ProjectMainCostGroupCatalogEntity extends IEntityIdentification {

	 Id: number;
	 DescriptionInfo: IDescriptionInfo;
	 LineItemContextFk?: number;
	 ProjectFk?: number;
	 Code?: string;
	 IsLive?: boolean;

}