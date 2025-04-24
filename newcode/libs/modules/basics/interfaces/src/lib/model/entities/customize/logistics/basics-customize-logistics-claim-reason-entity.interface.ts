/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLogisticsClaimReasonEntity extends IEntityBase, IEntityIdentification {
	DateRequested: boolean;
	QuantityRequested: boolean;
	WotRequested: boolean;
	UomRequested: boolean;
	DescriptionInfo?: IDescriptionInfo;
	Description2Info?: IDescriptionInfo;
}
