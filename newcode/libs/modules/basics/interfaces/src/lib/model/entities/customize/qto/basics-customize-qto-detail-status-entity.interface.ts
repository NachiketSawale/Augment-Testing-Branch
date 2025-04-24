/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoDetailStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsReadOnly: boolean;
	IsDefault: boolean;
	IsDefaulExt: boolean;
	IsCoreData: boolean;
	IsCoreDataExt: boolean;
	IsLive: boolean;
	IsDisable: boolean;
	IsOk: boolean;
	Icon: number;
	Code: string;
}
