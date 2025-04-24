/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeActivityStateEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	IsLive: boolean;
	Isautomatic: boolean;
	Isstarted: boolean;
	Isdelayed: boolean;
	Isahead: boolean;
	Isfinished: boolean;
	Isfinisheddelayed: boolean;
	Sorting: number;
	IsDefault: boolean;
	Isplanningfinished: boolean;
	RubricCategoryFk: number;
	Code: string;
	IsReadOnly: boolean;
}
