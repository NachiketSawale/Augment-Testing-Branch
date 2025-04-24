/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from '@libs/project/interfaces';
import { CoreProjectProperties } from './core-project-properties.class';

export class ChangeProjectGroup extends CoreProjectProperties {
	public ProjectGroupFk?: number;
	public NewProjectGroupFk?: number | undefined;

	public constructor(project: IProjectEntity) {
		super(project);
		this.ProjectGroupFk = project.ProjectGroupFk;
		this.NewProjectGroupFk = undefined;
	}
}
