/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeSelfbillingStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	ReadOnly: boolean;
	Isbilled: boolean;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	Code: string;
}
