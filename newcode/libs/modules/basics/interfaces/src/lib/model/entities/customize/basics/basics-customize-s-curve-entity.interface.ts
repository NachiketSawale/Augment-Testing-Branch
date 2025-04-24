/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSCurveEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Paymentdelay: number;
	Totaltype: string;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
