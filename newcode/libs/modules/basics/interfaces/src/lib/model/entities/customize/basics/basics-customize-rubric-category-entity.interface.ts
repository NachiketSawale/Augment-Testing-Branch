/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRubricCategoryEntity extends IEntityBase, IEntityIdentification {
	RubricFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	DescriptionShortInfo?: IDescriptionInfo;
	IsLive: boolean;
	IsHiddenInPublicApi: boolean;
}
