/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IValidationService, ISchemaProperty, NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator } from '@libs/platform/data-access';
import { inject, ProviderToken } from '@angular/core';
import { IEstimateProjectHeader2ClerkEntity } from '../model/entities/estimate-project-header-2clerk-entity.interface';
import { ESTIMATE_PROJECT_CLERK_VALIDATION_TOKEN } from './estimate-project-clerk-validation.service';

/**
 * @file estimate-project-clerk-new-entity-validation-processor.service.ts
 */

export class EstimateProjectClerkNewEntityValidationProcessorService extends NewEntityValidationProcessor<IEstimateProjectHeader2ClerkEntity> {
	/**
	 * @brief Gets the validator service for the EstimateProjectHeader2Clerk entity.
	 * @returns A validation service instance or null if not found.
	 */
	protected override getValidator(): IValidationService<IEstimateProjectHeader2ClerkEntity> | null {
		return inject(ESTIMATE_PROJECT_CLERK_VALIDATION_TOKEN);
	}

	/**
	 * @brief Retrieves the schema for the EstimateProjectHeader2Clerk entity.
	 * @returns A promise that resolves to an array of schema properties for the entity.
	 */
	protected override async getSchema(): Promise<ISchemaProperty<IEstimateProjectHeader2ClerkEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IEstimateProjectHeader2ClerkEntity>> = PlatformSchemaService<IEstimateProjectHeader2ClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({ moduleSubModule: 'Estimate.Project', typeName: 'EstimateProjectHeader2ClerkDto' }).then(function (scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}
