/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeLineItemContextEntity extends IEntityBase, IEntityIdentification {
	ContextFk: number;
	HeaderFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	HeaderPlantFk: number;
}
