/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IResourceCatalogPriceIndexEntity } from '@libs/resource/interfaces';
import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN } from './resource-catalog-price-index-validation.service';

export const RESOURCE_CATALOG_PRICEINDEN_NEWENTITYVALIDATION_TOKEN = new InjectionToken<ResourceCatalogPriceIndexNewEntityValidationProcessor>('resourceCatalogPriceIndexNewEntityValidationProcessor');

export class ResourceCatalogPriceIndexNewEntityValidationProcessor extends NewEntityValidationProcessor<IResourceCatalogPriceIndexEntity> {
	protected override getValidator() : IValidationService<IResourceCatalogPriceIndexEntity> | null {
		return inject(RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IResourceCatalogPriceIndexEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceCatalogPriceIndexEntity>> = PlatformSchemaService<IResourceCatalogPriceIndexEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Resource.Catalog', typeName: 'CatalogPriceIndexDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}