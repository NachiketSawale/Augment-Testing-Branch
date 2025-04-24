/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { FieldType, IGridDialogOptions, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import _ from 'lodash';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SetActiveProjectAlternativeService{
	private readonly dataService = inject(ProjectMainDataService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	public async setActiveProjectAlternative(){
		const selPrj = this.getSelectedProject();
		if(selPrj && this.assertProjectHasAlternatives(selPrj)){
			const title = this.translateService.instant('project.main.setActiveAlternativeTitle').text;
			const modalSetActiveAlternavitveConfig: IGridDialogOptions<IProjectEntity> = {
				width: '50%',
				headerText: title,
				windowClass: 'grid-dialog',
				gridConfig: {
					uuid: 'ae887ac248704a08a065bd8c04c831b0',
					columns: [
						{
							id: 'islive',
							model: 'IsLive',
							sortable: true,
							label: {
								text: 'cloud.common.entityIsLive',
							},
							type: FieldType.Boolean,
							readonly: false,
							width: 100,
							visible: true
						},
						{
							id: 'projectno',
							model: 'ProjectNo',
							sortable: true,
							label: {
								text: 'project.main.projectNo',
							},
							type: FieldType.Code,
							readonly: true,
							width: 100,
							visible: true
						},
						{
							id: 'index',
							model: 'ProjectIndex',
							sortable: true,
							label: {
								text: 'cloud.common.entityIndex',
							},
							type: FieldType.Integer,
							readonly: true,
							width: 100,
							visible: true
						},
						{
							id: 'projectname',
							model: 'ProjectName',
							sortable: true,
							label: {
								text: 'cloud.common.entityName',
							},
							type: FieldType.Code,
							readonly: true,
							width: 100,
							visible: true
						},
						{
							id: 'projectname2',
							model: 'ProjectName2',
							sortable: true,
							label: {
								text: 'project.main.name2',
							},
							type: FieldType.Code,
							readonly: true,
							width: 100,
							visible: true
						}
					]
				},
				isReadOnly: false,
				allowMultiSelect: true,
				items: [],
				selectedItems: [],
			};

			await this.loadAlternatives(selPrj).then((response) => {
				_.forEach(response, (alter) => {
					const customizeAlter = alter;
					customizeAlter.IsLive = alter.MainProject === 4;
					modalSetActiveAlternavitveConfig.items.push(customizeAlter);
				});
			});

			const result = await this.gridDialogService.show(modalSetActiveAlternavitveConfig);
			if(result && result.closingButtonId === StandardDialogButtonId.Ok){
				const action = {
					Action: 3,
					Project: selPrj
				};

				this.http.post(this.configurationService.webApiBaseUrl + 'project/main/execute', action).subscribe((res) => {
					if(res) {
						this.msgBoxService.showMsgBox('cloud.common.doneSuccessfully', title, 'ico-info', 'info', true);
					}
				});
			}
		}
	}

	private assertProjectHasAlternatives(project: IProjectEntity): boolean{
		let allow = false;
		if(project.MainProject === 4 || project.MainProject === 5){
			allow = true;
		} else {
			const title = this.translateService.instant('project.main.setActiveAlternativeTitle').text;
			const errMsg = this.translateService.instant('project.main.noAlternativesFound').text;

			this.msgBoxService.showMsgBox(errMsg,title, 'ico-info');
		}

		return allow;
	}

	private async loadAlternatives(project: IProjectEntity): Promise<IProjectEntity[]>{
		return await lastValueFrom(this.http.get(
			this.configurationService.webApiBaseUrl + 'project/main/alternative/list?projectID=' + project.Id)) as Promise<IProjectEntity[]>;
	}

	private getSelectedProject(): IProjectEntity | null {

		const project =  this.dataService.getSelectedEntity();
		if(!project){
			this.msgBoxService.showInfoBox(this.translateService.instant('project.main.noCurrentSelection').text,'info', true);
		}

		return project;
	}
}