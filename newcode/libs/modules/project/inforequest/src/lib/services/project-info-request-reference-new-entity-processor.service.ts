/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IProjectInfoRequestReferenceEntity } from '@libs/project/interfaces';
import { inject, ProviderToken } from '@angular/core';
import { ProjectInfoRequestReferenceValidationService } from './project-info-request-reference-validation.service';

export class ProjectInfoRequestReferenceNewEntityValidationProcessor extends NewEntityValidationProcessor<IProjectInfoRequestReferenceEntity> {
	protected override getValidator() : IValidationService<IProjectInfoRequestReferenceEntity> | null {
		return inject(ProjectInfoRequestReferenceValidationService);
	}

	protected override async getSchema() : Promise<ISchemaProperty<IProjectInfoRequestReferenceEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestReferenceEntity>> = PlatformSchemaService<IProjectInfoRequestReferenceEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'InfoRequestReferenceDto'}).then(function(scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}