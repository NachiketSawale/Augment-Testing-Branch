/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBidStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ReadOnly: boolean;
	Isquoted: boolean;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	Code: string;
	AccessrightDescriptorFk: number;
	RubricCategoryFk: number;
}
