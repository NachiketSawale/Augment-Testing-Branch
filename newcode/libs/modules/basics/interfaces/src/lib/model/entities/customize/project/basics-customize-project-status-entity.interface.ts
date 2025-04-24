/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeProjectStatusEntity extends IEntityBase, IEntityIdentification {
	RubricCategoryFk: number;
	DescriptionInfo?: IDescriptionInfo;
	Sorting: number;
	IsoptionalDownwards: boolean;
	IsoptionalUpwards: boolean;
	Isbid: boolean;
	Isexecution: boolean;
	Iscontract: boolean;
	Iswarranty: boolean;
	MessageInfo?: IDescriptionInfo;
	IsDefault: boolean;
	Icon: number;
	IsLive: boolean;
	Code: string;
	AccessrightDescriptorFk: number;
	IsReadOnly: boolean;
}
