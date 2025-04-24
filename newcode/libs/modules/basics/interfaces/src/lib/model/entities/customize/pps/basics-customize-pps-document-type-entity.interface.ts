/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePpsDocumentTypeEntity extends IEntityBase, IEntityIdentification {
	Icon: number;
	IsLive: boolean;
	IsDefault: boolean;
	Sorting: number;
	DescriptionInfo?: IDescriptionInfo;
}
