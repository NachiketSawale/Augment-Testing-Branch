/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOrderStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ReadOnly: boolean;
	IsOrdered: boolean;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	Code: string;
	IsCanceled: boolean;
	AccessrightDescriptorFk: number;
	IsFinallyBilled: boolean;
	RubricCategoryFk: number;
}
