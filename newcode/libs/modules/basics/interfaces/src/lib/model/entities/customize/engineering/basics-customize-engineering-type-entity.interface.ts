/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEngineeringTypeEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
