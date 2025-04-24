/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ICustomDialogOptions, IDialogErrorInfo, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IBasicsCharacteristicDataFilter, ICharacteristicBulkEditorParams } from '../model/interfaces/characteristic-bulk-editor-params.interface';
import { BasicsSharedCharacteristicBulkEditorComponent } from '../components/characteristic-bulk-editor/characteristic-bulk-editor.component';
import { BasicsSharedCharacteristicBulkEditorDialogDataService } from './basics-characteristic-bulk-editor-dialog-data.service';
import { ICharacteristicBulkEditorOptions } from '../model/interfaces/characteristic-bulk-editor-options.interface';
import { CHARACTERISTIC_BULK_EDITOR_DIALOG_OPTIONS_TOKEN } from '../model/interfaces/characteristic-bulk-editor-dialog.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCharacteristicBulkEditorService {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly translationService: PlatformTranslateService = inject(PlatformTranslateService);

	private async getFilterRequestParams(sectionId: BasicsCharacteristicSection): Promise<IBasicsCharacteristicDataFilter> {
		// todo-Any: replace it when cloudDesktopSidebarService.getFilterRequestParams is ready.
		//params.filter = cloudDesktopSidebarService.getFilterRequestParams();

		let filter: IBasicsCharacteristicDataFilter = {
			ExecutionHints: false,
			IncludeNonActiveItems: false,
			PageSize: 0, // get all in backend, so it won't take effect
			PageNumber: 0,
			Pattern: undefined,
			PinningContext: [],
			ProjectContextId: undefined,
			UseCurrentClient: false,
			UseCurrentProfitCenter: undefined,
		};

		// todo-Any: remove test data for filter. Provide other filter for other module for test.
		if (sectionId === BasicsCharacteristicSection.BusinessPartnerCharacteristic) {
			filter = {
				Pattern: 'BESTA Ltd',
				PageSize: 700,
				PageNumber: 0,
				UseCurrentClient: false,
				UseCurrentProfitCenter: null,
				IncludeNonActiveItems: false,
				ProjectContextId: null,
				PinningContext: [],
				ExecutionHints: null,
				OrderBy: [
					{
						Field: 'BusinessPartnerName1',
					},
				],
			};
		} else if (sectionId === BasicsCharacteristicSection.Requisition) {
			filter = {
				Pattern: '3120',
				PageSize: 700,
				PageNumber: 0,
				UseCurrentClient: null,
				UseCurrentProfitCenter: null,
				IncludeNonActiveItems: null,
				ProjectContextId: null,
				PinningContext: [],
				ExecutionHints: false,
			};
		}
		return filter;
	}

	public async showEditor(options: ICharacteristicBulkEditorOptions) {
		const params: ICharacteristicBulkEditorParams = {
			sectionId: options.sectionId,
			moduleName: options.moduleName,
			filter: await this.getFilterRequestParams(options.sectionId), // todo-Any await params.filter = cloudDesktopSidebarService.getFilterRequestParams();
			values: [],
			objectsCount: 0,
		};

		const dataService = options.initContext.injector.get(BasicsSharedCharacteristicBulkEditorDialogDataService);
		dataService.getFilteredEntities$(params).subscribe({
			next: (response) => {
				params.objectsCount = response.objectsCount;
				this.showBulkEditor(this, params, options, dataService).then();
			},
			error: (err) => {
				//todo-Any: remove this after the error handling added to platform.
				this.messageBoxService.showErrorDialog(err.error as IDialogErrorInfo);
			},
		});
	}

	private async showBulkEditor(service: BasicsSharedCharacteristicBulkEditorService, params: ICharacteristicBulkEditorParams, options: ICharacteristicBulkEditorOptions, dataService: BasicsSharedCharacteristicBulkEditorDialogDataService) {
		const recordsAffectedMsg = params?.objectsCount + ' ' + service.translationService?.instant('basics.characteristic.recordsAffectedMsg').text;

		const dialogOptions: ICustomDialogOptions<void, BasicsSharedCharacteristicBulkEditorComponent> = {
			id: '724a67d0a44f40e28a85b9607adcbbad',
			headerText: 'basics.characteristic.title.bulkEditorPopup',
			bottomDescription: recordsAffectedMsg,
			resizeable: true,
			width: '50%',
			windowClass: 'grid-dialog',
			backdrop: false,
			showCloseButton: true,
			bodyComponent: BasicsSharedCharacteristicBulkEditorComponent,
			bodyProviders: [{ provide: CHARACTERISTIC_BULK_EDITOR_DIALOG_OPTIONS_TOKEN, useValue: options }],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'cloud.common.ok' },
					isDisabled: (info) => {
						return info.dialog.body.okBtnDisabled();
					},
					fn: async (event, info) => {
						const success = await info.dialog.body.onOkBtnClicked(params);
						info.dialog.close(StandardDialogButtonId.Ok);
						if (success) {
							if (options.afterCharacteristicsApplied) {
								options.afterCharacteristicsApplied();
							}
						}
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
				},
			],
		};

		return this.modalDialogService.show(dialogOptions)?.finally(() => {
			dataService.resetItems();
		});
	}
}
