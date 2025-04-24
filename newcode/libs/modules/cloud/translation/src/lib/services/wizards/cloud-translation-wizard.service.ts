/*
 * Copyright(c) RIB Software GmbH
 */


import { CloudTranslationExportDialogComponent } from '../../components/cloud-translation-excel-export-dialog/cloud-translation-export-dialog.component';
import { CloudTranslationImportExportService } from '../cloud-translation-import-export.service';
import { IExcelExportDialogValue } from '../../model/wizards/interfaces/excel-export-dialog-value.interface';


import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';

import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, } from '@libs/ui/common';
import { CloudTranslationExcelImportWizardComponent } from '../../components/cloud-translation-excel-import-wizard/cloud-translation-excel-import-wizard.component';
import { CloudTranslationLanguageSelectionDialogComponent } from '../../components/cloud-translation-language-selection-dialog/cloud-translation-language-selection-dialog.component';
import { CloudTranslationImportPreviewDialogComponent } from '../../components/cloud-translation-import-preview-dialog/cloud-translation-import-preview-dialog.component';
import { IExcelImportDialogValue } from '../../model/wizards/interfaces/excel-import-dialog-value.interface';

@Injectable({
	providedIn: 'root'
})

/**
 *  Implement Excel Import Wizard.
 */
export class CloudTranslationWizardService {

	/**
	 * Inject the UiCommonDialogService
	 */
	private readonly dialogService = inject(UiCommonDialogService);

	/**
	 * Inject the PlatformTranslateService
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Inject the CloudTranslationImportExportService
	 */
	private readonly importExportService = inject(CloudTranslationImportExportService);

	/**
	 * The session UUID.
	 */
	public sessionUuid: { uuid: Translatable  } = { uuid: '' };

	/**
	 * Sets the session UUID.
	 */
	public setSessionUuid(uuid: Translatable ) {
		this.sessionUuid.uuid = uuid;
	}

	/**
	 * Clear the session UUID.
	 */
	public clearSessionUuid() {
		this.sessionUuid.uuid = '';
	}

	/**
	 * Initiates the Excel import process
	 */
	public async importFromExcel(): Promise<void> {
		await this.showImportFileChooseDialog();
	}

	/**
   	* Loads resource categories and shows the export dialog if successful.
   	*/
	   public async exportToExcel() {
		this.importExportService.resourceCategories = [];
		this.importExportService.loadResourceCategories().subscribe({
			next: (result: boolean) => {
				if (result) {
					this.showExportDialog();
				}
			},
			error: (error) => {
				console.error('Error loading resource categories:', error);
			}
		});
	}

		/**
	 * Displays Export Dialog
	 */
		public async showExportDialog(): Promise<void> {
			const modalOptions: ICustomDialogOptions<IExcelExportDialogValue, CloudTranslationExportDialogComponent<IExcelExportDialogValue>> = {
				headerText: { key: 'cloud.translation.exportdlg.dialogTitle' },
				id: 'ID',
				minHeight: '700px',
				minWidth: '700px',
				height: '700px',
				width: '700px',
				resizeable: true,
				showCloseButton: true,
				bodyComponent: CloudTranslationExportDialogComponent,
				buttons: [
					{
						id: 'export',
						caption: { key: 'cloud.translation.exportdlg.buttons.export' },
						fn: (event, info) => {
							info.dialog.body.onExport();
						},
						isDisabled: info => !info.dialog.body?.isButtonActive
					},
					{
						id: StandardDialogButtonId.Cancel,
						caption: { key: 'cloud.translation.fileImportdllg.buttons.cancel' },
					}
				],
				value: {
					isButtonActive: false,
					defaultLanguage: this.translateService.instant('cloud.translation.exportdlg.defaultLanguage').text,
					selectedLanguagesTitle: this.translateService.instant('cloud.translation.exportdlg.selectedLanguages').text,
					downloadFile: this.translateService.instant('cloud.translation.exportdlg.downloadFile').text,
					checkboxTitle: this.translateService.instant('cloud.translation.exportdlg.checkboxTitle').text,
					successText: this.translateService.instant('cloud.translation.exportdlg.successText').text,
					failedText: this.translateService.instant('cloud.translation.exportdlg.failedText').text,
					checkboxItems: [],
	
					checkboxOptions: {
						isFlatDesign: false
					},
					isUntranslated: true,
					untranslatedTitle: this.translateService.instant('cloud.translation.exportdlg.untranslatedText').text,
					isExportChanged: false,
					newOrChangedTitle: this.translateService.instant('cloud.translation.exportdlg.newOrChangedTitle').text,
					isResourceRemarkAdded: true,
					addResourceRemarkTitle: this.translateService.instant('cloud.translation.exportdlg.addResourceRemark').text,
					isTranslationRemarkAdded: false,
					addPathTitle: this.translateService.instant('cloud.translation.exportdlg.addPath').text,
					isPathAdded: false,
					addParameterInfoTitle: this.translateService.instant('cloud.translation.exportdlg.addParameterInfo').text,
					isParameterInfoAdded: false,
					addTranslationRemarkTitle: this.translateService.instant('cloud.translation.exportdlg.addTranslationRemark').text,
					exportByCategoryTitle: this.translateService.instant('cloud.translation.exportdlg.exportByCategory').text,
					checkBoxCategories: [],
					isCategoryAdded: false,
					addCategoryTitle: this.translateService.instant('cloud.translation.exportdlg.addCategory').text
				}
			};
			await this.dialogService.show(modalOptions);
		}

	/**
	 * Displays a dialog for selecting an import file. 
	 */
	public async showImportFileChooseDialog(): Promise<void> {
		const modalOptions: ICustomDialogOptions<IExcelImportDialogValue, CloudTranslationExcelImportWizardComponent<IExcelImportDialogValue>> = {
			headerText: { key: 'cloud.translation.languageSelectionDlg.dialogTitle' },
			minHeight: '700px',
			minWidth: '700px',
			height: '700px',
			width: '700px',
			resizeable: true,
			showCloseButton: true,
			bodyComponent: CloudTranslationExcelImportWizardComponent,
			buttons: [
				{
					id: 'upload',
					caption: { key: 'cloud.translation.fileImportdllg.buttons.upload' },
					fn: (event, info) => {
						info.dialog.body.onClickUploadBtn();
					},
					isDisabled: info => info.dialog.body.uploadBtnDisabled(),
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.translation.fileImportdllg.buttons.cancel' },
				}
			],
			value: {
				checkboxItem: [],
				checkboxTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.checkboxTitle').text,
				checkboxOptions: {
					flatDesign: false
				},
				infoList: [],
				fileInfoTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.fileInfoTitle').text,
				introText: this.translateService.instant('cloud.translation.fileImportdllg.step1Info').text,
				spinnermsg: this.translateService.instant('cloud.translation.fileImportdllg.spinnermsg').text,
			}
		};
		await this.dialogService.show(modalOptions);
	}

	/**
	 * Displays a dialog for selecting languages.
	   * @param {File} selectedFile - The selected file for import.
	 */
	public async showLanguageSelectionDialog(selectedFile: File): Promise<void> {
		const modalOptions: ICustomDialogOptions<IExcelImportDialogValue, CloudTranslationLanguageSelectionDialogComponent<IExcelImportDialogValue>> = {
			headerText: { key: 'cloud.translation.languageSelectionDlg.dialogTitle' },
			minHeight: '700px',
			minWidth: '700px',
			height: '700px',
			width: '700px',
			resizeable: true,
			showCloseButton: true,
			bodyComponent: CloudTranslationLanguageSelectionDialogComponent,
			buttons: [
				{
					id: 'preview',
					caption: { key: 'cloud.translation.languageSelectionDlg.buttons.preview' },
					fn: (event, info) => {
						info.dialog.body.onPreviewImportClicked();
					},
					isDisabled: info => info.dialog.body.btnDisabled(),
				},
				{
					id: 'import',
					caption: { key: 'cloud.translation.languageSelectionDlg.buttons.import' },
					fn: (event, info) => {
						info.dialog.body.onImportClicked();
					},
					isDisabled: info => info.dialog.body.isImportButtonDisabled(),
				},
				{
					id: 'cancel',
					caption: { key: 'cloud.translation.languageSelectionDlg.buttons.cancel' },
					fn: (event, info) => {
						info.dialog.body.onCancelClicked();
					},
					isDisabled: info => info.dialog.body.btnDisabled(),
				}
			],
			value: {
				selectedFile: selectedFile,
				checkboxItem: [],
				checkboxTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.checkboxTitle').text,
				checkboxOptions: {
					flatDesign: false
				},
				infoList: [],
				fileInfoTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.fileInfoTitle').text,
				isLoading: true,
				isLanguageSelection: false,
				spinnermsg: this.translateService.instant('cloud.translation.languageSelectionDlg.spinnermsg').text,
				defaultLanguage: this.translateService.instant('cloud.translation.languageSelectionDlg.defaultLanguage').text,
				resetChangedTitle: this.translateService.instant('cloud.translation.previewdlg.resetChangedTitle').text,
				isResetChanged: false,
				uuidImport: ''
			}
		};
		await this.dialogService.show(modalOptions);
	}

	/**
	 * Displays a preview dialog for the import operation.
	   * @param {Translatable[]} selectedCultures 
	   * @param {boolean} isResetChanged 
	   * @param {Translatable} uuidImport
	 */
	public async showPreviewImportDialog(selectedCultures: Translatable[], isResetChanged: boolean, uuidImport: Translatable): Promise<void> {
		const modalOptions: ICustomDialogOptions<IExcelImportDialogValue, CloudTranslationImportPreviewDialogComponent> = {
			headerText: { key: 'cloud.translation.previewdlg.dialogTitleImport' },
			minHeight: '700px',
			minWidth: '700px',
			height: '700px',
			width: '700px',
			resizeable: true,
			showCloseButton: true,
			bodyComponent: CloudTranslationImportPreviewDialogComponent,
			buttons: [
				{
					id: 'import',
					caption: { key: 'cloud.translation.previewdlg.buttons.import' },
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.translation.previewdlg.buttons.cancel' },
				}
			],
			value: {
				selectedCultures: selectedCultures,
				isPreview: true,
				checkboxItem: [],
				checkboxTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.checkboxTitle').text,
				checkboxOptions: {
					flatDesign: false
				},
				infoList: [],
				fileInfoTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.fileInfoTitle').text,
				isLoading: true,
				isLanguageSelection: false,
				spinnermsg: this.translateService.instant('cloud.translation.languageSelectionDlg.spinnermsg').text,
				resetChangedTitle: this.translateService.instant('cloud.translation.previewdlg.resetChangedTitle').text,
				isResetChanged: isResetChanged,
				uuidImport: uuidImport,
			}
		};
		await this.dialogService.show(modalOptions);
	}

	/**
	   * Displays a dialog showing the import report.
	   * @param {Translatable[]} selectedCultures 
	   * @param {boolean} isResetChanged 
	   * @param {Translatable} uuidImport 
	   */
	public async showImportReportDialog(selectedCultures: Translatable[], isResetChanged: boolean, uuidImport: Translatable): Promise<void> {
		const modalOptions: ICustomDialogOptions<IExcelImportDialogValue, CloudTranslationImportPreviewDialogComponent> = {
			headerText: { key: 'cloud.translation.previewdlg.dialogTitleImport' },
			minHeight: '700px',
			minWidth: '700px',
			height: '700px',
			width: '700px',
			resizeable: true,
			showCloseButton: true,
			bodyComponent: CloudTranslationImportPreviewDialogComponent,
			buttons: [
				{
					id: 'copy',
					caption: { key: 'cloud.translation.previewdlg.buttons.copy' },

				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.translation.previewdlg.buttons.close' },
				}
			],
			value: {
				selectedCultures: selectedCultures,
				isPreview: true,
				checkboxItem: [],
				checkboxTitle: this.translateService.instant('cloud.translation.languageSelectionDlg.checkboxTitle').text,
				checkboxOptions: {
					flatDesign: false
				},
				infoList: [],
				fileInfoTitle: '',
				isLoading: true,
				isLanguageSelection: false,
				spinnermsg: this.translateService.instant('cloud.translation.languageSelectionDlg.spinnermsg').text,
				resetChangedTitle: this.translateService.instant('cloud.translation.previewdlg.resetChangedTitle').text,
				isResetChanged: isResetChanged,
				uuidImport: uuidImport
			}
		};
		await this.dialogService.show(modalOptions);
	}

}
