/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizePlantAssemblyTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Isvariable: boolean;
	Isfix: boolean;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}
