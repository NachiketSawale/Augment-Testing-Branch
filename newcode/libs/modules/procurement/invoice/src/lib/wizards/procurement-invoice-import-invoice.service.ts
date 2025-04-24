/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { CustomStep, FieldType, GridStep, IGridConfiguration, MultistepDialog, MultistepTitleFormat, UiCommonMultistepDialogService } from '@libs/ui/common';
import { ISareFolderXmlFileSelectable, IShareFolderXmlFile, ProcurementInvoiceImportInvoiceWizardFileSelectComponent } from '../components/import-invoice-wizard-file-select/import-invoice-wizard-file-select.component';
import { PlatformHttpService, PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';

export interface IInvoiceImportData {
	importFiles: ISareFolderXmlFileSelectable[];
	result: IImportResult[];
}

export interface IImportResult {
	Id: number;
	InvHeaderFk?: number;
	BarCode: string;
	InvoiceCode: string;
	InvoiceDescription: string;
	BusinessPartner: string;
	ContractCode: string;
	ProjectNo: string;
	InvoiceDate?: Date;
	Status: string;
	Error: string;
	Warning: string;
	XmlFile: string;
	DocumentFile: string;
	WorkFlowStatus: string;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceImportInvoiceWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly multiStepService = inject(UiCommonMultistepDialogService);
	private readonly importData: IInvoiceImportData = { importFiles: [], result: [] };
	private readonly translateService = inject(PlatformTranslateService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);

	public async onStartWizard() {
		const fileSelectStep = new CustomStep('importFileSelect', 'procurement.invoice.wizard.invoice.import.headerText', ProcurementInvoiceImportInvoiceWizardFileSelectComponent);

		const gridConfig = this.getImportResultGridConfig();

		const importResultStep = new GridStep('importResult', 'procurement.invoice.wizard.invoice.import.importResult', gridConfig, 'result');

		const multiStepDialog = new MultistepDialog(this.importData, [fileSelectStep, importResultStep]);
		multiStepDialog.dialogOptions.width = '50%';
		multiStepDialog.titleFormat = MultistepTitleFormat.StepTitle;
		multiStepDialog.hideDisplayOfNextStep = true;
		multiStepDialog.hideIndicators = true;
		multiStepDialog.dialogOptions.buttons = [
			{
				id: 'nextBtn',
				caption: { key: 'ui.common.dialog.multistep.nextBtn' },
				isDisabled: (info) => {
					return !this.importData.importFiles.some((f) => f.IsChecked);
				},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 0;
				},
				autoClose: false,
				fn: async (event, info) => {
					if (info.dialog.value) {
						await this.doImportInvoice(info.dialog.value);
					}
				},
			},
			{
				id: 'Navigation',
				autoClose: true,
				caption: { key: 'cloud.common.Navigator.goTo' },
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 1 && this.importData.result.some((value, index) => value.Id > 0);
				},
				fn: () => {
					const goToIds = this.importData.result
						.filter((r) => r.Id > 0)
						.map((r) => {
							return { id: r.Id };
						});
					this.platformModuleNavigationService.navigate({
						internalModuleName: 'procurement.invoice',
						entityIdentifications: goToIds,
					});
				},
			},
			{
				id: 'closeWin',
				caption: { key: 'basics.common.button.cancel' },
				autoClose: true,
			},
		];
		return this.multiStepService.showDialog(multiStepDialog);
	}

	private async doImportInvoice(dialog: MultistepDialog<IInvoiceImportData>) {
		dialog.currentStep.loadingMessage = 'procurement.invoice.wizard.invoice.import.Importing';
		const importFiles: IShareFolderXmlFile[] = this.importData.importFiles
			.filter((f) => f.IsChecked)
			.map((f) => {
				return {
					FileName: f.FileName,
					IsErrorFile: f.IsErrorFile,
					FolderName: f.FolderName,
					TemplateId: f.TemplateId,
				};
			});
		const resp = await this.http.post<IImportResult[]>('procurement/invoice/importvoice', importFiles);
		let messageParam = { total: 0, succeeded: 0, failed: 0 };
		if (resp?.length) {
			//TODO: need to double check by Lincoin, there is commented code to execute the workflow. Not sure it is still needed or not.
			this.importData.result = resp;

			//TODO: need to enhance the server side, seems it is hard coded to showing the fail status.
			// But it should be translatable. Should return a boolean value instead.
			const failCount = resp.filter((r) => r.Status === 'Failed').length;
			messageParam = {
				total: resp.length,
				succeeded: resp.length - failCount,
				failed: failCount,
			};
		}

		//TODO: the format shows different compare with AngularJs. But can't find a good way to show the same.
		dialog.wizardSteps[1].topDescription = this.translateService.instant('procurement.invoice.wizard.invoice.import.resultBodyText', messageParam).text;
		dialog.goToNext();
	}

	private getImportResultGridConfig(): IGridConfiguration<IImportResult> {
		return {
			uuid: 'c6f33168c7474323bea20c4f2689dee0',
			skipPermissionCheck: true,
			columns: [
				{
					id: 'Status',
					model: 'Status',
					label: 'procurement.common.import.status',
					type: FieldType.Description,
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'WorkFlowStatus',
					model: 'WorkFlowStatus',
					label: 'procurement.common.import.workflowstatus',
					type: FieldType.Description,
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'Barcode',
					model: 'BarCode',
					label: 'procurement.common.import.barcode',
					type: FieldType.Description,
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'InvoiceCode',
					model: 'InvoiceCode',
					label: 'procurement.common.import.Code',
					type: FieldType.Description,
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'InvoiceDescription',
					model: 'InvoiceDescription',
					label: 'procurement.common.import.description',
					type: FieldType.Description,
					readonly: true,
					width: 100,
					sortable: true,
					visible: true,
				},
				{
					id: 'BusinessPartner',
					model: 'BusinessPartner',
					label: 'procurement.common.import.businessPartner',
					type: FieldType.Description,
					width: 130,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'Contract',
					model: 'ContractCode',
					label: 'procurement.common.import.contract',
					type: FieldType.Description,
					width: 130,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'Project',
					model: 'ProjectNo',
					label: 'procurement.common.import.project',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'InvoiceDate',
					model: 'InvoiceDate',
					label: 'procurement.common.import.date',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'Error',
					model: 'Error',
					label: 'procurement.common.import.error',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'Warning',
					model: 'Warning',
					label: 'procurement.common.import.warning',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'XmlFile',
					model: 'XmlFile',
					label: 'procurement.common.import.xmlFile',
					type: FieldType.Description,
					width: 100,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'DocumentFile',
					model: 'DocumentFile',
					label: 'procurement.common.import.file',
					type: FieldType.Description,
					width: 150,
					sortable: true,
					visible: true,
					readonly: true,
				},
			],
		};
	}
}
