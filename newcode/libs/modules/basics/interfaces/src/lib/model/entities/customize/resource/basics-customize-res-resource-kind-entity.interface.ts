/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeResResourceKindEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	ShortKeyInfo?: IDescriptionInfo;
	RubricCategoryFk: number;
	Icon: number;
	Ispoolresource: boolean;
	IsDefault: boolean;
	Sorting: number;
	IsLive: boolean;
	IsHired: boolean;
}
