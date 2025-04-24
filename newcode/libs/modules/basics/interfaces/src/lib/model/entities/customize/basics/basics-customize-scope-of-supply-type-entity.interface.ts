/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeScopeOfSupplyTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Ispricecomponent: boolean;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
