/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeTransportBundleStatusEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	IsLive: boolean;
	Sorting: number;
	Icon: number;
	Dispatchable: boolean;
	Userflag1: boolean;
	Userflag2: boolean;
	IsDefault: boolean;
	IsDone: boolean;
}
