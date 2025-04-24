/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
	PlatformSchemaService, ValidationServiceFactory
} from '@libs/platform/data-access';
import { inject, InjectionToken, ProviderToken } from '@angular/core';

import { RESOURCE_CATALOG_PRICEINDEX_DATA_TOKEN } from './resource-catalog-price-index-data.service';
import { IResourceCatalogPriceIndexEntity } from '@libs/resource/interfaces';


export const RESOURCE_CATALOG_PRICEINDEX_VALIDATION_TOKEN = new InjectionToken<ResourceCatalogPriceIndexValidationService>('resourceCatalogPriceIndexValidationProcessor');

export class ResourceCatalogPriceIndexValidationService extends BaseValidationService<IResourceCatalogPriceIndexEntity> {
	private catalogValidators: IValidationFunctions<IResourceCatalogPriceIndexEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceCatalogPriceIndexEntity>> = PlatformSchemaService<IResourceCatalogPriceIndexEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Catalog', typeName: 'CatalogPriceIndexDto'}).then(
			function(scheme) {
			self.catalogValidators = new ValidationServiceFactory<IResourceCatalogPriceIndexEntity>().provideValidationFunctionsFromScheme(scheme, self);
		});
	}

	protected generateValidationFunctions(): IValidationFunctions<IResourceCatalogPriceIndexEntity> {
		if(this.catalogValidators !== null) {
			return this.catalogValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceCatalogPriceIndexEntity> {
		return inject(RESOURCE_CATALOG_PRICEINDEX_DATA_TOKEN);
	}
}