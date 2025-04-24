/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStockTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	Comment: string;
	AllowProcurement: boolean;
	AllowDispatching: boolean;
	AllowWorkspace: boolean;
	AllowResourceRequisition: boolean;
	AllowApprovedMaterial: boolean;
}
