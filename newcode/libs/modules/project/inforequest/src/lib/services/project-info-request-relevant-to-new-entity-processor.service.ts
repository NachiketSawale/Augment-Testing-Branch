/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IProjectInfoRequestRelevantToEntity } from '@libs/project/interfaces';
import { inject, ProviderToken } from '@angular/core';
import { ProjectInfoRequestRelevantToValidationService } from './project-info-request-relevant-to-data-validation.service';

export class ProjectInfoRequestRelevantToNewEntityValidationProcessor extends NewEntityValidationProcessor<IProjectInfoRequestRelevantToEntity> {
	protected override getValidator() : IValidationService<IProjectInfoRequestRelevantToEntity> | null {
		return inject(ProjectInfoRequestRelevantToValidationService);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IProjectInfoRequestRelevantToEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestRelevantToEntity>> = PlatformSchemaService<IProjectInfoRequestRelevantToEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'RequestRelevantToDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}