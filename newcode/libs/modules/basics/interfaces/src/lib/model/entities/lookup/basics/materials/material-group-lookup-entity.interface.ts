/*
 * Copyright(c) RIB Software GmbH
 */

import {IDescriptionInfo, IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * Material group lookup entity
 */
export interface IMaterialGroupLookupEntity extends IEntityBase, IEntityIdentification {
	Code: string;
	MdcContextFk: number;
	Islive: boolean;
	MaterialCatalogFk: number;
	MaterialGroupFk?: number | null;
	DescriptionInfo: IDescriptionInfo;
	PrcStructureFk?: number | null;
	ChildItems: IMaterialGroupLookupEntity[];
	HasChildren: boolean;
}