/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOrderTypeEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsMain: boolean;
	IsChange: boolean;
	IsSide: boolean;
	IsFrameworkCallOff: boolean;
}
