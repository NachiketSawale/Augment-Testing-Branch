/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from '@libs/project/interfaces';
export class ProjectEntityActionData {
	public NewProjectNumber?: string;
	public ProjectName?: string;
	public ProjectName2?: string;
	public AlternativeComment?: string;
	public AlternativeDescription?: string;
	public NewProjectGroup?: number;
	public CloseProject?: boolean;

	public constructor(public action: number, public project: IProjectEntity) {
	}
}
