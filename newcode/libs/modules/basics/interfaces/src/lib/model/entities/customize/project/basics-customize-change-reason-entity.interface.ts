/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeChangeReasonEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
