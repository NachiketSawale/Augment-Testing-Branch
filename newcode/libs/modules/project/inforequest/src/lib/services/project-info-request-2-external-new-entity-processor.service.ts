/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
	IValidationService, ISchemaProperty,
	NewEntityValidationProcessor, PlatformSchemaService, EntitySchemaEvaluator
} from '@libs/platform/data-access';
import { IProjectInfoRequest2ExternalEntity } from '@libs/project/interfaces';
import { inject, ProviderToken } from '@angular/core';
import { ProjectInfoRequest2ExternalValidationService } from './project-info-request-2-external-data-validation.service';

export class ProjectInfoRequest2ExternalNewEntityValidationProcessor extends NewEntityValidationProcessor<IProjectInfoRequest2ExternalEntity> {
	protected override getValidator(): IValidationService<IProjectInfoRequest2ExternalEntity> | null {
		return inject(ProjectInfoRequest2ExternalValidationService);
	}

	protected override async getSchema(): Promise<ISchemaProperty<IProjectInfoRequest2ExternalEntity>[]> {
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequest2ExternalEntity>> = PlatformSchemaService<IProjectInfoRequest2ExternalEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		return platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'InfoRequest2ExternalDto'}).then(function (scheme) {
			return EntitySchemaEvaluator.EvaluateMandatoryFields(scheme);
		});
	}
}