/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IProjectInfoRequestEntity } from '@libs/project/interfaces';
import { inject, ProviderToken } from '@angular/core';
import { ProjectInfoRequestValidationService } from './project-info-request-data-validation.service';

export class ProjectInfoRequestNewEntityValidationProcessor extends NewEntityValidationProcessor<IProjectInfoRequestEntity> {
	protected override getValidator() : IValidationService<IProjectInfoRequestEntity> | null {
		return inject(ProjectInfoRequestValidationService);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IProjectInfoRequestEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestEntity>> = PlatformSchemaService<IProjectInfoRequestEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Resource.Catalog', typeName: 'InfoRequestDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}