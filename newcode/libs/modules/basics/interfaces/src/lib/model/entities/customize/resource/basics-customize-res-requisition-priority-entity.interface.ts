/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionPriorityEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	DispatcherGroupFk: number;
	Icon: number;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
