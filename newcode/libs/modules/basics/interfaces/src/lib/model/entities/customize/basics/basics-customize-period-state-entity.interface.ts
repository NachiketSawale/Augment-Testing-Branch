/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePeriodStateEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Isopen: boolean;
	Isaccountpayablesopen: boolean;
	Isaccountreceivablesopen: boolean;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Code: string;
}
