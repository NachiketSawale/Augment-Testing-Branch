/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from '@libs/project/interfaces';

export class CoreProjectProperties {
	public ProjectNo?: string;
	public ProjectName?: string;
	public ProjectName2?: string;

	public constructor(project: IProjectEntity) {
		this.ProjectNo = project.ProjectNo;
		this.ProjectName = project.ProjectName;
		this.ProjectName2 = project.ProjectName2;
	}
}
