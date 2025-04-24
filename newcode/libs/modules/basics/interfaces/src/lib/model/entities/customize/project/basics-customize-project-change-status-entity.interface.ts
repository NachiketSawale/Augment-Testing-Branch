/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectChangeStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsAccepted: boolean;
	IsRejected: boolean;
	Icon: number;
	IsLive: boolean;
	IsIdentified: boolean;
	IsAnnounced: boolean;
	IsSubmitted: boolean;
	IsWithDrawn: boolean;
	IsRejectedWithProtest: boolean;
	IsAcceptedInPrinciple: boolean;
	FactorByReason: number;
	FactorByAmount: number;
	IsAllowedQtoForSales: boolean;
	IsAllowedQtoForProc: boolean;
	Code: string;
	IsReadOnly: boolean;
	AccessrightDescriptorFk: number;
	RubricCategoryFk: number;
}
