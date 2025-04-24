/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory
} from '@libs/platform/data-access';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { ResourceCatalogDataService } from './resource-catalog-data.service';

export const RESOURCE_CATALOG_VALIDATION_TOKEN = new InjectionToken<ResourceCatalogValidationService>('resourceCatalogValidationToken');

export class ResourceCatalogValidationService extends BaseValidationService<IResourceCatalogEntity> {
	private catalogValidators: IValidationFunctions<IResourceCatalogEntity> | null = null;
	private dataService = inject(ResourceCatalogDataService);

	public constructor() {
		super();
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceCatalogEntity>> = PlatformSchemaService<IResourceCatalogEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Catalog', typeName: 'CatalogDto'}).then(
			function(scheme) {
				self.catalogValidators = new ValidationServiceFactory<IResourceCatalogEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<IResourceCatalogEntity> {
		if(this.catalogValidators !== null) {
			return this.catalogValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceCatalogEntity> {
		return this.dataService;
	}
}