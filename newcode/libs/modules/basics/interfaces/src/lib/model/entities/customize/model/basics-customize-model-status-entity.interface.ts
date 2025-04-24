/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeModelStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	IsReadOnly: boolean;
	Sorting: number;
	IsDefault: boolean;
	IsPublicOpen: boolean;
	IsLive: boolean;
	Code: string;
	Icon: number;
}
