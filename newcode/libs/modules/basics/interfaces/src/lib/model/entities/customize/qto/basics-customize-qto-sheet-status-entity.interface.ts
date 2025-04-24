/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeQtoSheetStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsReadOnly: boolean;
	IsDefault: boolean;
	IsDefaultExt: boolean;
	IsCoreData: boolean;
	IsCoreDataExt: boolean;
	IsLive: boolean;
	IsDisable: boolean;
	Icon: number;
	Code: string;
	AccessrightDescriptorFk: number;
}
