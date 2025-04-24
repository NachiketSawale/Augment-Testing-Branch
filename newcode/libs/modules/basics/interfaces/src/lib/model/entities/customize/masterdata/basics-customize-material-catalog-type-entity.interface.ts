/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IBasicsCustomizeMaterialCatalogTypeEntity extends IEntityBase, IEntityIdentification {
	DescriptionInfo?: IDescriptionInfo;
	Issupplier: boolean;
	Location: number;
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsFramework: boolean;
}
