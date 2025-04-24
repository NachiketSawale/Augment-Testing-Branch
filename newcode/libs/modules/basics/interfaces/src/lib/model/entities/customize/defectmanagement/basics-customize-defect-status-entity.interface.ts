/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeDefectStatusEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Isadvised: boolean;
	Isfixed: boolean;
	Isrejected: boolean;
	Iscanceled: boolean;
	IsReadOnly: boolean;
	IsDefault: boolean;
	Sorting: number;
	Icon: number;
	IsLive: boolean;
	Accessrightdescriptor: number;
	Code: string;
	RubricCategoryFk: number;
	AccessRightDescriptor1Fk: number;
}
