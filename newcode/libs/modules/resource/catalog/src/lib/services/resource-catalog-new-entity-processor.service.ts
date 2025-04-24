/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IResourceCatalogEntity } from '@libs/resource/interfaces';
import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { RESOURCE_CATALOG_VALIDATION_TOKEN } from './resource-catalog-validation.service';

export const RESOURCE_CATALOG_NEWENTITYVALIDATION_TOKEN = new InjectionToken<ResourceCatalogNewEntityValidationProcessor>('resourceCatalogNewEntityValidationProcessor');

export class ResourceCatalogNewEntityValidationProcessor extends NewEntityValidationProcessor<IResourceCatalogEntity> {
	protected override getValidator() : IValidationService<IResourceCatalogEntity> | null {
		return inject(RESOURCE_CATALOG_VALIDATION_TOKEN);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IResourceCatalogEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceCatalogEntity>> = PlatformSchemaService<IResourceCatalogEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Resource.Catalog', typeName: 'CatalogDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}