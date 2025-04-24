
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {  Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { ProjectMainReleaseDataService } from './project-main-release-data.service';
import { IProjectMainProjectReleaseEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainReleaseValidationService extends BaseValidationService<IProjectMainProjectReleaseEntity> {

	public constructor(private projectMainReleaseDataService: ProjectMainReleaseDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IProjectMainProjectReleaseEntity> {
		return {
			CommentText: this.validateIsMandatory,
			ReleaseDate:this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainProjectReleaseEntity> {
		return this.projectMainReleaseDataService;
	}

}