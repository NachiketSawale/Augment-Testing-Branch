/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectEntityActionData } from './project-entity-action-data.class';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { lastValueFrom } from 'rxjs';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { ProjectMainDataService } from '@libs/project/shared';

export class ProjectEntityExecutionHelper {
	private static readonly iTwo5DProjectType = 5;
	private static readonly dialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private static readonly http = ServiceLocator.injector.get(HttpClient);
	private static readonly configService = ServiceLocator.injector.get(PlatformConfigurationService);
	private static readonly projectMainService = ServiceLocator.injector.get(ProjectMainDataService);

	public static checkProjectInBaselineAndExecute(action: ProjectEntityActionData, errMsg: string, title: string): void {
		if (ProjectEntityExecutionHelper.is5DProject(action.project)) {
			ProjectEntityExecutionHelper.closeProjectAndExecute(action, errMsg, title);
		} else {
			ProjectEntityExecutionHelper.updateAndExecute(action, errMsg, title);
		}
	}

	private static is5DProject(project: IProjectEntity): boolean {
		return project.TypeFk === ProjectEntityExecutionHelper.iTwo5DProjectType;
	}

	private static closeProjectAndExecute(action: ProjectEntityActionData, errMsg: string, title: string): Promise<void> {
		const projectCloseAction = new ProjectEntityActionData(8, action.project);

		return ProjectEntityExecutionHelper.callActionOnSever<IProjectComplete>('project/main/execute', projectCloseAction).then((response) => {
				if (!response) {
					return ProjectEntityExecutionHelper.callActionOnSever<IProjectComplete>( 'project/main/execute', action).then((response) => {
						if(response){
							this.dialogService.showMsgBox('cloud.common.doneSuccessfully', title, 'info', 'info', true);
						} else {
							this.dialogService.showMsgBox(errMsg, title, 'ico-error');
						}
					});
				} else {
					this.dialogService.showMsgBox(errMsg, title, 'ico-error');
					return Promise.resolve();
				}
			}
		);

	}

	private static updateAndExecute(action: ProjectEntityActionData, errMsg: string, title: string): Promise<void> {
		const exeFunc = (): void => {
			(async () => {
				const response = await ProjectEntityExecutionHelper.callActionOnSever<IProjectComplete>('project/main/execute', action);
				if (response) {
					this.dialogService.showMsgBox('cloud.common.doneSuccessfully', title, 'info', 'info', true);
				} else {
					this.dialogService.showMsgBox(errMsg, title, 'ico-error');
				}
			})();
		};

		return this.projectMainService.updateAndExecute(exeFunc);
	}

	private static async callActionOnSever<T>(url: string, action: ProjectEntityActionData): Promise<T> {
		const queryPath = this.configService.webApiBaseUrl + url;

		return await lastValueFrom(this.http.post<T>(queryPath, action));
	}
}