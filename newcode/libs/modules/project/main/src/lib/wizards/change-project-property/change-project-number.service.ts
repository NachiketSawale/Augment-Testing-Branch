/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEditorDialogResult, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { ChangeProjectNumber } from './change-project-number.class';
import { ChangeProjectNumberDialogConfig } from './change-project-number-dialog-config.class';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProjectEntityActionData } from '../common/project-entity-action-data.class';
import { ProjectEntityExecutionHelper } from '../common/project-entity-execution-helper.class';

@Injectable({
	providedIn: 'root'
})
export class ChangeProjectNumberService {
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public changeProjectNumber(dataService: ProjectMainDataService){
		const project = this.getSelectedProject(dataService);
		if(project !== null) {
			const projectNumber = new ChangeProjectNumber(project);
			const dialogConfigurator = new ChangeProjectNumberDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(projectNumber))?.then((result: IEditorDialogResult<ChangeProjectNumber>) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					const postData = new ProjectEntityActionData(6, project);
					postData.NewProjectNumber = result.value?.NewNumber;

					ProjectEntityExecutionHelper.checkProjectInBaselineAndExecute(postData, 'project.main.wizardChangeProjectNumberInfoMsg', 'project.main.entityChangeProjectNumber');
				}
			});
		}
	}

	private getSelectedProject(dataService: ProjectMainDataService): IProjectEntity | null {
		return dataService.getSelectedEntity();
	}
}