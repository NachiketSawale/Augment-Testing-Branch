/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceCatalogEntity extends IEntityBase, IEntityIdentification {
	EquipmentContextFk: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	CurrencyFk: number;
	BaseYear?: number;
	CatalogTypeFk: number;
}
