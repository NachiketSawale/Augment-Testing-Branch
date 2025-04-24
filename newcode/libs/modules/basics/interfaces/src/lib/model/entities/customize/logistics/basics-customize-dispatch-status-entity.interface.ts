/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsPlanned: boolean;
	IsStarted: boolean;
	IsFinished: boolean;
	IsStockPosted: boolean;
	IsInvoiced: boolean;
	IsReadOnly: boolean;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	RubricCategoryFk: number;
	IsReadyForSettlement: boolean;
	Code: string;
	IsValidatingPerformingJob: boolean;
	Ispicking: boolean;
}
