/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDispatchRecordStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsPicked: boolean;
	IsDelivered: boolean;
	IsInvoiced: boolean;
	IsCanceled: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	Code: string;
}
