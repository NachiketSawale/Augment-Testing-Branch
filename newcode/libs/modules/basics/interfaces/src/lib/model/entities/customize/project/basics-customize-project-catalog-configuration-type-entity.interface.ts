/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectCatalogConfigurationTypeEntity extends IEntityBase, IEntityIdentification {
	CatConfigFk: number;
	LineitemcontextFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsProject: boolean;
	IsConstructionSystem: boolean;
	IsMaterial: boolean;
	IsActivityCriteria: boolean;
	IsEmployee: boolean;
	IsAssembly: boolean;
	IsWorkItemCatalog: boolean;
}
