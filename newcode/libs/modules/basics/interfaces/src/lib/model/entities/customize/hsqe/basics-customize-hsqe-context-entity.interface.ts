/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeHsqeContextEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
