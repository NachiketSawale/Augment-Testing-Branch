/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantKindEntity extends IEntityBase, IEntityIdentification {
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	DescriptionInfo?: IDescriptionInfo;
}
