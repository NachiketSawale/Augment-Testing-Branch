/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeJobCardStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsCharged: boolean;
	IsStockRelevant: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	IsReadyForDispatching: boolean;
	IsDispatched: boolean;
	Code: string;
	IsReadOnly: boolean;
	RubricCategoryFk: number;
}
