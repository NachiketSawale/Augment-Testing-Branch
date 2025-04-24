/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionResDateEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Backgroundcolor: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	Isreserved: boolean;
	Delaylessthan: number;
}
