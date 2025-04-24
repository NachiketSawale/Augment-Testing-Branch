/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeChangeTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	RubricCategoryFk: number;
	IsChangeOrder: boolean;
	IsProcurement: boolean;
	IsSales: boolean;
	IsProjectChange: boolean;
}
