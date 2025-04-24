/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceCatalogPriceIndexEntity extends IEntityBase, IEntityIdentification {
	CatalogFk: number;
	IndexYear: number;
	PriceIndex: number;
	Comment: string;
}
