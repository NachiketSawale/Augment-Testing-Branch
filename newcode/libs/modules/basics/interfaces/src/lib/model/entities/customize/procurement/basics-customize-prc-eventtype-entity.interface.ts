/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePrcEventtypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	Ismainevent: boolean;
	Hasstartdate: boolean;
	EventtypeFk: number;
	SystemeventtypeStartFk: number;
	SystemeventtypeEndFk: number;
	IsLive: boolean;
}
