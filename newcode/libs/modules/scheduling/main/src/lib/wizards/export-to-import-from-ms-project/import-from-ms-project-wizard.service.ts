/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { SchedulingMainDataService } from '../../services/scheduling-main-data.service';
import { StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { ImportFileDialogConfig } from './import-file-dialog-config.class';
import { SchedulingEntityExecutionHelper } from '../common/scheduling-entity-execution-helper.class';

export class ImportFileConfig {
	public CalculateSchedule: boolean = false;
	public OverWriteSchedule: boolean = false;
}

@Injectable({
	providedIn: 'root'
})

export class SchedulingImportMSProjectService {
	private readonly modalDialogService = inject(UiCommonFormDialogService);

	public importMSProject(dataService: SchedulingMainDataService) {
		const selectedEntity = dataService.getSelectedEntity();
		const scheduleId = selectedEntity?.ScheduleFk;

		if(scheduleId) {
			const entity = new ImportFileConfig();
			const dialogConfigurator = new ImportFileDialogConfig();

			this.modalDialogService.showDialog(dialogConfigurator.createFormConfiguration(entity))?.then((result) => {
				if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					this.chooseFile(file => {
						this.importFile(result.value?.OverWriteSchedule ?? false,
							result.value?.CalculateSchedule ?? false, scheduleId, file);
					});
				}
			});
		} else {
			SchedulingEntityExecutionHelper.openDialogFailed();
		}
	}

	private chooseFile(callback: (file: File) => void) {
		const fileInput = document.createElement('input') as HTMLInputElement;
		const selectFile = (e: Event) => {
			const target = e.target as HTMLInputElement;
			const files = target.files as FileList;
			const fileData = files[0];

			callback(fileData);
		};

		if (fileInput) {
			fileInput.type = 'file';
			fileInput.accept = '.xml';
			fileInput.addEventListener('change', selectFile);
			fileInput.click();
		}
	}

	private importFile(overWriteSchedule: boolean, calculateSchedule: boolean, scheduleId: number, file: File){
		//TODO waiting for basicsCommonSimpleUploadService
	}
}

