/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IIdentificationData, ITranslatable, PlatformModuleNavigationService } from '@libs/platform/common';
import { UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PROCUREMENT_COMMON_LOAD_DIALOG_OPTIONS_TOKEN, ProcurementCommonLoadingDialogComponent } from '../../components/procurement-common-loading-dialog/procurement-common-loading-dialog.component';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonWizardUtilService {
	private closeLoadingDialog$ = new Subject<void>();
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	public showLoadingDialog(headerText: string, info: ITranslatable = { key: 'procurement.common.processing' }, cssClass: string = 'ico-info') {
		this.dialogService.show({
			width: '200px',
			headerText: headerText,
			id: 'dcd5815e4c0246e9a82c4a64b6cdc416',
			bodyLargeMargin: true,
			showCloseButton: false,
			bodyComponent: ProcurementCommonLoadingDialogComponent,
			bodyProviders: [
				{
					provide: PROCUREMENT_COMMON_LOAD_DIALOG_OPTIONS_TOKEN,
					useValue: {
						info,
						cssClass: cssClass,
						closeEvent$: this.closeLoadingDialog$,
					},
				},
			],
		});
	}

	public closeLoadingDialog() {
		this.closeLoadingDialog$.next();
	}

	/**
	 * Show message dialog with goto button
	 */
	public async showGoToMsgBox(bodyText: string, headerText: string, entityIdentifications: IIdentificationData[], internalModuleName: string) {
		const navigateService = this.platformModuleNavigationService;
		return this.messageBoxService.showMsgBox({
			bodyText,
			headerText,
			iconClass: 'ico-info',
			customButtons: [
				{
					id: 'Navigation',
					autoClose: true,
					caption: { key: 'cloud.common.Navigator.goTo' },
					fn() {
						//TODO: navigate seems not work. May need to create a ticket to framework team.
						navigateService.navigate({
							internalModuleName,
							entityIdentifications,
						});
					},
				},
			],
		});
	}
}
