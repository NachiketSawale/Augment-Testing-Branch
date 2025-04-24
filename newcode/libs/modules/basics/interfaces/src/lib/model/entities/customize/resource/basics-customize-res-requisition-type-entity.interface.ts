/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResRequisitionTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	DispatcherGroupFk: number;
	Icon: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
