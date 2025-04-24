/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePaperSizeEntity extends IEntityBase, IEntityIdentification {
	NameInfo?: IDescriptionInfo;
	DescriptionInfo?: IDescriptionInfo;
	Height: number;
	Width: number;
	IsDefault: boolean;
	IsLive: boolean;
	Sorting: number;
}
