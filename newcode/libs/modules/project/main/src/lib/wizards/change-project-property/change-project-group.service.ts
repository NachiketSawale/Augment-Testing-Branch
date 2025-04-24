/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { ChangeProjectGroup } from './change-project-group.class';
import { ChangeProjectGroupDialogConfig } from './change-project-group-dialog-config.class';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProjectEntityActionData } from '../common/project-entity-action-data.class';
import { ProjectEntityExecutionHelper } from '../common/project-entity-execution-helper.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeProjectGroupService {
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public changeProjectGroup(dataService: ProjectMainDataService){
		const project = this.getSelectedProject(dataService);
		if(project !== null) {
			const projectGroup= new ChangeProjectGroup(project);
			const dialogConfigurator = new ChangeProjectGroupDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(projectGroup))?.then((result: IEditorDialogResult<ChangeProjectGroup>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const postData = new ProjectEntityActionData(7, project);
					postData.NewProjectGroup = result.value?.NewProjectGroupFk;

					ProjectEntityExecutionHelper.checkProjectInBaselineAndExecute(postData, 'project.main.wizardChangeProjectGroupInfoMsg', 'project.main.entityChangeProjectGroup');
				}
			});
		}
	}

	private getSelectedProject(dataService: ProjectMainDataService): IProjectEntity | null {
		return dataService.getSelectedEntity();
	}
}