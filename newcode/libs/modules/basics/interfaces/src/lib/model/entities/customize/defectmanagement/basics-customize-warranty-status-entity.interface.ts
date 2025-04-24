/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeWarrantyStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Iscovered: boolean;
	Islimitedcovered: boolean;
	Isexpired: boolean;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
}
