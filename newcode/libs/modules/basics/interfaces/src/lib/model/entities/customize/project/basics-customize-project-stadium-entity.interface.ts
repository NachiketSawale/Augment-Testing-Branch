/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStadiumEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
