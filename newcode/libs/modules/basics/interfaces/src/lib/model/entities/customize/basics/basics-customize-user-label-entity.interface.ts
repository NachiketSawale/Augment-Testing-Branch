/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeUserLabelEntity extends IEntityBase, IEntityIdentification {
	Code: number;
	DescriptionInfo?: IDescriptionInfo;
	KeyWords: string;
	IsLive: boolean;
	Sorting: number;
}
