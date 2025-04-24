/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeRevenueRecognitionStatusEntity extends IEntityBase, IEntityIdentification {
	Code: number;
	DescriptionInfo?: IDescriptionInfo;
	IsReadOnly: boolean;
	Isreported: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
}
