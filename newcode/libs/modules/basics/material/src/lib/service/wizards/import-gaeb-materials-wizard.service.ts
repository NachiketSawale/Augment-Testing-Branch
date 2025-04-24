/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { MATERIAL_CATALOG_TOKEN } from '@libs/basics/shared';
import {
	ICustomDialogOptions,
	UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { BasicsMaterialMaterialCatalogDataService } from '../../material-catalog/basics-material-material-catalog-data.service';
import { BasicsMaterialImportGaebMaterialsWizardComponent } from '../../import-gaeb-materials/components/basics-material-import-gaeb-materials-wizard.component';

/**
 * Import d90. d93, d94 wizard service
 */
@Injectable({
	providedIn: 'root'
})
export class ImportGaebMaterialsWizardService {
	private readonly materialCatalogService = inject(BasicsMaterialMaterialCatalogDataService);
	private readonly msgDialogService = inject(UiCommonMessageBoxService);
	private readonly dialogService = inject(UiCommonDialogService);
	private readonly wizardTitleKey = 'basics.material.import.importd9xTitle';

	/**
	 * On start wizard
	 */
	public async onStartWizard(): Promise<void> {
		const selectedCatalog = this.materialCatalogService.getSelectedEntity();
		if (!selectedCatalog) {
			await this.msgDialogService.showMsgBox('basics.material.import.noCatalogError', this.wizardTitleKey, 'ico-error' );
		} else {
			const dialogOption: ICustomDialogOptions<boolean, BasicsMaterialImportGaebMaterialsWizardComponent>  = {
				headerText: this.wizardTitleKey,
				width: '550px',
				resizeable: true,
				showCloseButton: false,
				bodyComponent: BasicsMaterialImportGaebMaterialsWizardComponent,
				bodyProviders: [{ provide: MATERIAL_CATALOG_TOKEN, useValue: selectedCatalog }],
				buttons: [{
					id: 'importBtn',
					caption: { key: 'basics.material.import.importBtnTxt' },
					isDisabled: (info) => {
						return (info.dialog.body as BasicsMaterialImportGaebMaterialsWizardComponent).disableImport();
					},
					fn: async (evt, info) => {
						await (info.dialog.body as BasicsMaterialImportGaebMaterialsWizardComponent).import();
					}
				}, {
					id: 'infoBtn',
					caption: { key: 'basics.common.taskBar.info' },
					isDisabled: (info) => {
						return (info.dialog.body as BasicsMaterialImportGaebMaterialsWizardComponent).disableShowInfo();
					},
					fn: async (evt, info) => {
						await (info.dialog.body as BasicsMaterialImportGaebMaterialsWizardComponent).showInfo();
					}
				}, {
					id: 'closeBtn',
					caption: { key: 'basics.common.button.close' },
					fn: async (evt, info) => {
						await (info.dialog.body as BasicsMaterialImportGaebMaterialsWizardComponent).close();
					}
				}]
			};
			this.dialogService.show(dialogOption)?.then((result) => {
				if (result.value) {
					//TODO continue to do it after upload function ready
					//basicsMaterialMaterialGroupsService.loadByMainItemId();
				}
			});
		}
	}
}