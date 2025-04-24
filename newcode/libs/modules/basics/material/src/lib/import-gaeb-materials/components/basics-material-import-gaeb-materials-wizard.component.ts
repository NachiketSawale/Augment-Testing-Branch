/*
 * Copyright(c) RIB Software GmbH
 */

import { FormsModule } from '@angular/forms';
import { HttpClient} from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MATERIAL_CATALOG_TOKEN } from '@libs/basics/shared';
import { Component, inject, OnDestroy } from '@angular/core';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import {
	FieldType,
	UiCommonModule,
	IGridDialogOptions,
	getCustomDialogDataToken,
	UiCommonGridDialogService
} from '@libs/ui/common';

/**
 * Material import d90, d93, d94 materials wizard component
 */
@Component({
	selector: 'basics-material-import-gaeb-materials-wizard',
	templateUrl: './basics-material-import-gaeb-materials-wizard.component.html',
	styleUrl: './basics-material-import-gaeb-materials-wizard.component.scss',
	standalone: true,
	imports: [FormsModule, UiCommonModule]
})
export class BasicsMaterialImportGaebMaterialsWizardComponent implements OnDestroy {
	private readonly http = inject(HttpClient);
	private readonly selectedCatalog = inject(MATERIAL_CATALOG_TOKEN);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<boolean, BasicsMaterialImportGaebMaterialsWizardComponent>());

	private readonly fileType = [D9xFileType.D90, D9xFileType.D93, D9xFileType.D94].join(', ');
	private readonly moduleName = 'basics.material';
	private isUploading = false;
	private isImporting = false;
	private isImported = false;

	/**
	 * Import Data
	 */
	public importData: {
		fileArchiveDocId: number | null,
		fileName: string | null
	} = {
		fileArchiveDocId: null,
		fileName: null
	};

	/**
	 * Import result
	 */
	public importResult: {
		infoList: {Id: number, Info: string}[]/*, //TODO update it after data-platform-alert ready
		type: number,
		show: boolean,
		message: string | null*/
	} = {
		infoList: []/*,
		type: 0,
		show: false,
		message: null*/
	};

	/**
	 * Upload file
	 */
	public async upload() {
		this.isUploading = true;
		this.reset();
		//TODO update it after common upload service ready
		//uploadService.uploadFiles({}, uploadService.getExtension(), {action: 'Upload'});
		this.isUploading = false;
	}

	//TODO update it after common upload service ready
	/*uploadService.registerUploadStarting(onUploadStarting);
	uploadService.registerUploadDone(onUploadDone);
	uploadService.registerUploadCancelled(onUploadCancelled);
	uploadService.registerUploadError(onUploadError);
	function onUploadStarting(e){
		if (e){
			$scope.import.fileName = e.name;
			$scope.import.isDisabled = true;
			$scope.isLoading = true;
		}
		$scope.error.show = false;
		deleteFile();
		basicsMaterialImportMaterialRecordsService.reset();
		isUploaded = false;
		isImported = false;
	}
	function onUploadDone(){
		$scope.import.isDisabled = false;
		$scope.isLoading = false;
		canImport = true;
		isUploaded = true;
	}
	function onUploadCancelled(){
		$scope.import.isDisabled = false;
		$scope.isLoading = false;
	}
	function onUploadError(){
		$scope.import.isDisabled = false;
		$scope.isLoading = false;
	}*/

	/**
	 * Import material
	 */
	public async import() {
		this.isImporting = true;
		if (this.importData.fileArchiveDocId) {
			const jobId = await this.importMaterialFromD9x();
			if (jobId) {
				await this.checkImportState(jobId);
			}
		}
		this.isImporting = false;
	}

	/**
	 * Open information grid dialog
	 */
	public async showInfo() {
		const infoGridDialogData: IGridDialogOptions<{ Id: number, Info: string }> = {
			width: '550px',
			windowClass: 'grid-dialog',
			headerText: 'basics.common.taskBar.info',
			gridConfig: {
				idProperty: 'Id',
				uuid: '4643221abb984dc384ba8b0f0ca280f9',
				columns: [{
						type: FieldType.Text,
						id: 'info',
						model: 'Info',
						label: { text: 'Information', key: 'basics.common.taskBar.info', },
						sortable: true,
						visible: true,
						width: 500,
					}],
			},
			items: this.importResult.infoList,
			selectedItems: [],
			isReadOnly: true,
			resizeable: true
		};
		await this.gridDialogService.show(infoGridDialogData);
	}

	/**
	 * Disable import
	 */
	public disableImport(): boolean {
		return this.isLoading || !this.importData.fileArchiveDocId;
	}

	/**s
	 * Disable show information
	 */
	public disableShowInfo(): boolean {
		return this.isLoading || !this.importResult.infoList.length;
	}

	/**
	 * Is loading
	 */
	public get isLoading() {
		return this.isUploading || this.isImporting;
	}

	/**
	 * Destroy wizard
	 */
	public async ngOnDestroy() {
		await this.deleteFileArchiveDoc();
		this.reset();
	}

	/**
	 * Close wizard
	 */
	public close() {
		this.dialogWrapper.value = this.isImported;
		this.dialogWrapper.close();
	}

	private async importMaterialFromD9x(): Promise<number | undefined> {
		return firstValueFrom(this.http.post<{ JobId: number | undefined }>(this.configService.webApiBaseUrl + 'basics/material/wizard/importmaterialfromd9x', {
			FileArchiveDocId: this.importData.fileArchiveDocId,
			FileName: this.importData.fileName,
			ModuleName: this.moduleName,
			MaterialCatalogId: this.selectedCatalog.Id,
			MaterialCatalogCode: this.selectedCatalog.Code
		}).pipe(map(d => {
			return d.JobId;
		})));
	}

	private async deleteFileArchiveDoc(): Promise<void> {
		if (!this.importData.fileArchiveDocId) {
			return;
		}
		await firstValueFrom(this.http.post<{ JobId: number | undefined }>(this.configService.webApiBaseUrl + 'basics/common/document/deletefilearchivedoc', [this.importData.fileArchiveDocId]));
		return;
	}

	private async checkImportState(jobId: number): Promise<void> {
		return firstValueFrom(
			new Observable((subscriber) => {
				this.http.get<ImportStateResponse>(this.configService.webApiBaseUrl + 'basics/material/wizard/importstate?jobId=' + jobId).subscribe(
					(result) => {
						if (result) {
							this.isImported = true;
							this.setImportInfo(result);
							this.importFinish(result);
						} /*else { // TODO tis code has performance issues
							setTimeout(function () {
								this.checkImportState(jobId);
							}, 5000);
						}*/
						subscriber.next();
					},
					(error) => {
						const errMsg = error.ErrorMessage ?? this.translateService.instant('basics.material.import.importError4BigData').text;
						this.setImportInfo({ InfoList: [errMsg], StatusCode: ImportStatusCode.Fail });
						subscriber.next();
					}
				);
			})
		);
	}

	private setImportInfo(result: ImportStateResponse) {
		if (result.InfoList?.length) {
			this.importResult.infoList = result.InfoList.map((value, index) => ({ Id: index + 1, Info: value }));
		}
		//TODO update it after data-platform-alert ready
		/*switch (data.StatusCode) {
			case 1:
			{
				service.alertInfo.type = 0;
				service.alertInfo.show = true;
				service.alertInfo.message = $translate.instant('basics.material.import.success');
			}
				break;
			case 0:
			{
				service.alertInfo.type = 0;
				service.alertInfo.show = true;
				service.alertInfo.message = $translate.instant('basics.material.import.successButHasWarning');
			}
				break;
			case -1:
			{
				service.alertInfo.type = 0;
				service.alertInfo.show = true;
				service.alertInfo.message = $translate.instant('basics.material.import.partialSuccess');
			}
				break;
			case -2:
			{
				service.alertInfo.type = 3;
				service.alertInfo.show = true;
				service.alertInfo.message = $translate.instant('basics.material.import.fail');
			}
				break;
			default:
				break;
		}*/
	}

	private importFinish(result: ImportStateResponse) {
		if (result.ImportObjects) {
			//TODO continue to do it after upload function ready
			//basicsMaterialRecordService.navigateToItem(result.ImportObjects.map(i => i.Id));
		}
	}

	private reset() {
		this.importData = {
			fileArchiveDocId: null,
			fileName: null
		};
		this.importResult = {
			infoList: []
		};
	}
}

/**
 * Import state http response type
 */
type ImportStateResponse = {
	StatusCode?: number,
	InfoList?: string[],
	ImportObjects?: {Id: number}[]
}

/**
 * Import status code
 */
enum ImportStatusCode {
	Success = 1,
	SuccessButHasWarning = 0,
	PartialSuccess = -1,
	Fail= -2,
}

/**
 * File type
 */
enum D9xFileType {
	D90 = '.d90',
	D93 = '.d93',
	D94 = '.d94'
}