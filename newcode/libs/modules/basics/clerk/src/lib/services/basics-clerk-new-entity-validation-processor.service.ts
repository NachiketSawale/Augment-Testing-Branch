/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { inject, ProviderToken } from '@angular/core';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { BASICS_CLERK_VALIDATION_TOKEN } from './basics-clerk-validation.service';

export class BasicsClerkNewEntityValidationProcessorService extends NewEntityValidationProcessor<IBasicsClerkEntity> {
	protected override getValidator() : IValidationService<IBasicsClerkEntity> | null {
		return inject(BASICS_CLERK_VALIDATION_TOKEN);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IBasicsClerkEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IBasicsClerkEntity>> = PlatformSchemaService<IBasicsClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Basics.Clerk', typeName: 'ClerkDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}