/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { IResourceCatalogPriceIndexEntity } from '@libs/resource/interfaces';
import { IResourceCatalogRecordEntity } from '@libs/resource/interfaces';

export interface ResourceCatalogComplete extends CompleteIdentification<IResourceCatalogEntity>{

	CatalogId: number;
	Catalogs: IResourceCatalogEntity[] | null;

	RecordsToSave: IResourceCatalogRecordEntity[] | null;
	RecordsToDelete: IResourceCatalogRecordEntity[] | null;

	PriceIndicesToSave: IResourceCatalogPriceIndexEntity[] | null;
	PriceIndicesToDelete: IResourceCatalogPriceIndexEntity[] | null;
}
