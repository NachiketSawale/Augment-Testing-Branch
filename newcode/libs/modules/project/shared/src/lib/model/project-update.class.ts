/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ProjectEntity } from './project-entity.class';
import { IProjectLocationEntity } from '@libs/project/interfaces';

export class ProjectUpdate implements CompleteIdentification<ProjectEntity>{

	public MainItemID: number = 0;

	public Projects: ProjectEntity[] | null = null;

	public LocationsToSave: IProjectLocationEntity[] | null = null;

	public LocationsToDelete: IProjectLocationEntity[] | null = null;
}
