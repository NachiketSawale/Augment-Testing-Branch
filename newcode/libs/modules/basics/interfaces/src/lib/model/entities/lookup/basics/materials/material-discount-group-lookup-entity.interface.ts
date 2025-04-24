/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * Material discount group lookup entity
 */
export interface IMaterialDiscountGroupLookupEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	MdcContextFk: number;
	DescriptionInfo: IDescriptionInfo;
	Islive: boolean;
	MaterialDiscountGroupFk?: number | null;
	MaterialCatalogFk: number;
	ChildItems: IMaterialDiscountGroupLookupEntity[];
	HasChildren: boolean;
}