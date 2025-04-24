/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeOrderPaymentSchedulesStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	IsAgreed: boolean;
	IsIssued: boolean;
	Code: string;
	IsReadOnly: boolean;
}
