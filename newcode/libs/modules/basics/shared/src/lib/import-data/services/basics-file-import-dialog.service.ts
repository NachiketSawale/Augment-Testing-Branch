/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { FieldType, FormRow, IEditorDialogResult, IFormConfig, UiCommonDialogService, UiCommonGridDialogService, UiCommonLookupDataFactoryService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IBasicsSharedImportDataEntity } from '../models/basics-import-data-entity.interface';
import { BasicsSharedImportSimpleFileComponent } from '../components/import/basics-shared-import-simple-file.component';
import { SimpleFileImportContext } from './basics-file-import-context.class';


@Injectable({
	providedIn: 'root',
})
export class BasicsSharedSimpleFileImportDialogService<TEntity extends IBasicsSharedImportDataEntity> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly translate = inject(PlatformTranslateService);
	protected readonly msgBoxSvc = inject(UiCommonMessageBoxService);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly gridDialogService = inject(UiCommonGridDialogService);
	protected readonly lookupFactory = inject(UiCommonLookupDataFactoryService);

	public async showDialog(context: SimpleFileImportContext<TEntity>) {
		if (await this.preImportHandle(context)) {
			const result = await this.showImportDialog(context);

			// show the result dialog afterward.
			await this.postImportHandle(context, result);
		}
	}

	protected async preImportHandle(context: SimpleFileImportContext<TEntity>): Promise<boolean> {
		if (context.preOpenDialogFn) {
			return context.preOpenDialogFn(context.entity, context.formData);
		}
		return true;
	}

	protected async showImportDialog(context: SimpleFileImportContext<TEntity>, showInformationButton: boolean = true): Promise<IEditorDialogResult<TEntity>> {
		const entity: TEntity = context.entity as TEntity;

		await this.translate.load(['basics.common', 'basics.material']);

		// TODO: chase add showError logics, after data-platform-alert is ready.
		const formRows: FormRow<TEntity>[] = [
			{
				id: 'file',
				label: { text: 'File Name' },
				type: FieldType.FileSelect,
				model: 'file',
				sortOrder: 10,
				options: {
					retrieveDataUrl: true,
					retrieveFile: true,
					fileFilter: context.dlgOptions.fileFilter,
					multiSelect: context.dlgOptions.multiSelect,

					onSelectionChanged: async () => {
						entity.dialogLoading = true;

						if (context.fileLoadedFn) {
							await context.fileLoadedFn(context);
						}
					},
				},
			},
		];

		const formConfig: IFormConfig<TEntity> = {
			formId: 'basics.shared.file.import.form',
			showGrouping: false,
			addValidationAutomatically: true,
			rows: formRows,
		};

		if (context.dlgOptions.additionalRows) {
			formConfig.rows.concat(context.dlgOptions.additionalRows);
		}

		const res = await this.dialogService.show({
			id: 'basics-shared-file-import-dialog',
			headerText: context.dlgOptions.header,
			bodyComponent: BasicsSharedImportSimpleFileComponent,
			value: { entity: entity, formConfig: formConfig },
			buttons: [
				{
					id: 'Import',
					caption: { key: 'basics.material.import.importBtnTxt' },
					autoClose: false,
					isDisabled: () => {
						if (entity.dialogLoading || !entity.file) {
							return true;
						}
						const files = Array.isArray(entity.file) ? entity.file : [entity.file.file];
						if (files.length === 0) {
							return true; // Has no file selected.
						}
						if (context.importIsDisabledFn) {
							return context.importIsDisabledFn(context);
						}
						return false;
					},

					fn: async (event, info) => {
						entity.dialogLoading = true;

						if (context.importFn) {
							await context.importFn(context, () => {
								info.dialog.close(); // close import dialog.
							});
						}
					},
				},
				{
					id: 'Information',
					caption: { key: 'basics.common.taskBar.info' },
					isVisible: showInformationButton,
					autoClose: false,
					isDisabled: () => {
						if (context.infoIsDisabledFn) {
							return context.infoIsDisabledFn(context);
						}
						return true;
					},
					fn: async (event, info) => {
						await this.showResultInfoDialog(context);
					},
				},
				{
					id: 'Close',
					caption: { key: 'basics.common.button.close' },
					autoClose: true,
				},
			],
		});

		if (res) {
			return {
				closingButtonId: res.closingButtonId,
				value: res.value?.entity,
			} as IEditorDialogResult<TEntity>;
		}

		return {} as IEditorDialogResult<TEntity>;
	}

	protected async postImportHandle(context: SimpleFileImportContext<TEntity>, result: IEditorDialogResult<TEntity>): Promise<void> {
		if (context.postImportProcessFn) {
			await context.postImportProcessFn(context.entity, context.formData);
		}
	}

	private async showResultInfoDialog(context: SimpleFileImportContext<TEntity>) {
		// todo-Any: use standard Error dialog to show the messages of all logs as confirmed with Mike.

		// // show dialog to display log file content.
		// if (info.context.UploadKey && info.context.LogFilePath) {
		// 	this.logDialogService.openDialog(info.context.UploadKey, info.context.LogFilePath);
		// } else {
		// 	console.error('UploadKey or LogFilePath is empty. Please check the import process.');
		// }

		// public openDialog(uploadKey: string, logFilePath: string) {
		// 		this.loadPageData(uploadKey, 0).then(async (response) => {
		// 			const options: IPageableLongTextDialogOptions = {
		// 				headerText: 'Import Log',
		// 				topDescription: {
		// 					text: `<b>Log file:</b> ${logFilePath}`,
		// 				},
		// 				dataSource: new PageableLongTextDialogDataSource(response, (index: number) => this.loadPageData(uploadKey, index)),
		// 				type: TextDisplayType.Html,
		// 			};
		//
		// 			await this.pageableLongTextDialog.show(options);
		// 		});
		// 	}
		//
		// public async loadPageData(uploadKey: string, pageIndex: number) {
		// 		const response = await this.http.get<{ TotalCount: number; Messages: string[] }>('basics/common/document/importlogmessages', {
		// 			params: {
		// 				uploadKey: uploadKey,
		// 				firstLineIndex: pageIndex * this.pageLength,
		// 				maxLineCount: this.pageLength,
		// 			},
		// 		});
		// 		return {
		// 			text: isArray(response.Messages) ? response.Messages.join('<br>') : '',
		// 			totalPageCount: Math.ceil(response.TotalCount / this.pageLength),
		// 		};
		// 	}
	}

	// todo-Any: show alert message according to the import status code. ref. basicsMaterialImportMaterialRecordsService

	// 	switch (data.StatusCode) {
	// 	case 1:
	// 		{
	// 			service.alertInfo.type = 0;
	// 			service.alertInfo.show = true;
	// 			service.alertInfo.message = $translate.instant('basics.material.import.success');
	// 		}
	// 	break;
	// 	case 0:
	// 		{
	// 			service.alertInfo.type = 0;
	// 			service.alertInfo.show = true;
	// 			service.alertInfo.message = $translate.instant('basics.material.import.successButHasWarning');
	// 		}
	// 	break;
	// 	case -1:
	// 		{
	// 			service.alertInfo.type = 0;
	// 			service.alertInfo.show = true;
	// 			service.alertInfo.message = $translate.instant('basics.material.import.partialSuccess');
	// 		}
	// 	break;
	// 	case -2:
	// 		{
	// 			service.alertInfo.type = 3;
	// 			service.alertInfo.show = true;
	// 			service.alertInfo.message = $translate.instant('basics.material.import.fail');
	// 		}
	// 	break;
	// 	default:
	// 	break;
	// }
}
