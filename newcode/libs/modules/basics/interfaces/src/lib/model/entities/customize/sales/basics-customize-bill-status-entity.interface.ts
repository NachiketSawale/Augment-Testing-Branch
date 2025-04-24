/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeBillStatusEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ReadOnly: boolean;
	Isbilled: boolean;
	IsDefault: boolean;
	Icon: number;
	Isstorno: boolean;
	Isarchived: boolean;
	Isonlyfwd: boolean;
	Isbtrequired: boolean;
	IsLive: boolean;
	Code: string;
	IsPosted: boolean;
	AccessrightDescriptorFk: number;
	IsRevenueRecognition: boolean;
}
