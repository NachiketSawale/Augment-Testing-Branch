/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProjectDropPointProjectDataService } from '../data/project-drop-point-project-data.service';
import { inject } from '@angular/core';
import { BaseGeneratorRevalidationService } from '@libs/platform/data-access';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectDropPointProjectValidationService extends BaseGeneratorRevalidationService<IProjectEntity> {
	protected projectDropPointHeaderData: ProjectDropPointProjectDataService = inject(ProjectDropPointProjectDataService);
	public constructor(){
		super({moduleSubModule: 'Project.DropPoints', typeName: 'DropPointHeaderDto'});
	}
	protected getDataService(): ProjectDropPointProjectDataService {
		return this.projectDropPointHeaderData;
	}
}