/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeEstAssemblyTypeEntity extends IEntityBase, IEntityIdentification {
	AssemblytypeLogicFk: number;
	DescriptionInfo?: IDescriptionInfo;
	IsDefault: boolean;
	IsLive: boolean;
	ShortKeyInfo?: IDescriptionInfo;
	Sorting: number;
}
