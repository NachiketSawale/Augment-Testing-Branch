/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeWorkInProgressStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ReadOnly: boolean;
	IsOrdered01: boolean;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	IsProtected: boolean;
	IsAccrued: boolean;
	IsCanceled: boolean;
	Code: string;
	Isaccepted: boolean;
	AccessrightDescriptorFk: number;
	IsRevenueRecognition: boolean;
	RubricCategoryFk: number;
}
