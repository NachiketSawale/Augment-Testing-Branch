/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsProductPlaceTypeEntity extends IEntityBase, IEntityIdentification {
	IsDefault: boolean;
	IsFixed: boolean;
	CanHaveChildren: boolean;
	IsManual: boolean;
	IsLive: boolean;
	Sorting: number;
	Color: number;
	Icon: number;
	DescriptionInfo?: IDescriptionInfo;
}
