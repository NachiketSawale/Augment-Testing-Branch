/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProcurementItemStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Isdelivered: boolean;
	Ispartdelivered: boolean;
	Iscanceled: boolean;
	Isaccepted: boolean;
	Ispartaccepted: boolean;
	Isrejected: boolean;
	Icon: number;
	IsLive: boolean;
	Code: string;
}
