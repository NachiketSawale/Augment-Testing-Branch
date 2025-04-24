/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementPaymentScheduleStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	IsDefault: boolean;
	IsReadOnly: boolean;
	IsAgreed: boolean;
	IsIssued: boolean;
}
