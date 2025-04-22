import { Component, inject, OnInit } from '@angular/core';
import { FieldType, getMultiStepDialogDataToken, GridComponent, IGridConfiguration, UiCommonLookupDataFactoryService, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IInvoiceImportData } from '../../wizards/procurement-invoice-import-invoice.service';


enum ImportFilterOptions {
	All = 1,
	Error,
	Current,
}

export interface IShareFolderXmlFile {
	FileName: string;
	IsErrorFile: boolean;
	FolderName: string;
	TemplateId?: number;
}

export interface ISareFolderXmlFileSelectable extends IShareFolderXmlFile {
	Id: number;
	IsChecked: boolean;
	Status: string;
}

@Component({
	selector: 'procurement-invoice-import-invoice-wizard-file-select',
	standalone: true,
	imports: [GridComponent, PlatformCommonModule, UiCommonModule],
	templateUrl: './import-invoice-wizard-file-select.component.html',
	styleUrl: './import-invoice-wizard-file-select.component.css',
})
export class ProcurementInvoiceImportInvoiceWizardFileSelectComponent implements OnInit {
	protected filterOption: ImportFilterOptions = ImportFilterOptions.All;

	private readonly http = inject(PlatformHttpService);
	protected readonly translateService = inject(PlatformTranslateService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IInvoiceImportData>());

	protected gridConfig: IGridConfiguration<ISareFolderXmlFileSelectable> = {
		uuid: 'C305AD78C0ED489CAC74DE0B8C35183B',
		columns: [
			{
				id: 'IsChecked',
				model: 'IsChecked',
				width: 60,
				type: FieldType.Boolean,
				label: { key: 'procurement.invoice.wizard.checkbox.headerText' },
				sortable: true,
				visible: true,
				headerChkbox: true
			},
			{
				id: 'Description',
				model: 'FileName',
				width: 400,
				type: FieldType.Description,
				label: { key: 'procurement.invoice.entityXmlFile' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'Status',
				model: 'Status',
				width: 400,
				type: FieldType.Description,
				label: { key: 'procurement.invoice.importFileStatus' },
				sortable: true,
				visible: true,
				readonly: true,
			},
		],
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
		items: [],
		//entityRuntimeData: this.gridRuntimeData
	};

	protected readonly importFilterOptionsService = inject(UiCommonLookupDataFactoryService).fromItems(
		[
			{
				id: ImportFilterOptions.All,
				desc: {
					key: 'procurement.invoice.wizard.invoice.import.FilterAll',
				},
			},
			{
				id: ImportFilterOptions.Error,
				desc: {
					key: 'procurement.invoice.wizard.invoice.import.FilterError',
				},
			},
			{
				id: ImportFilterOptions.Current,
				desc: {
					key: 'procurement.invoice.wizard.invoice.import.FilterCurrent',
				},
			},
		],
		{
			uuid: '8abcb9183c2a466b8466e2f68653590d',
			valueMember: 'id',
			displayMember: 'desc',
			translateDisplayMember: true,
		},
	);

	public async ngOnInit() {
		await this.loadImportFiles();
	}

	private async loadImportFiles() {
		this.dialogData.currentStep.loadingMessage = 'procurement.invoice.wizard.invoice.import.loading';
		//TODO need to enhance the sever side, actually it can be a get
		const resp = await this.http.post<IShareFolderXmlFile[]>('procurement/invoice/getsharexml', null);
		if (resp?.length) {
			this.dialogData.dataItem.importFiles = resp.map((r, index) => {
				return {
					Id: index,
					IsChecked: false,
					Status: r.IsErrorFile ? this.translateService.instant('procurement.invoice.alreadyImported').text : this.translateService.instant('procurement.invoice.newImported').text,
					...r,
				};
			});

			this.filterImportData();
		}

		this.dialogData.currentStep.loadingMessage = undefined;
	}

	protected filterOptionChanged(newValue: number) {
		this.filterOption = newValue;
		this.filterImportData();
	}

	private filterImportData() {
		this.gridConfig = {
			...this.gridConfig,
			items: this.dialogData.dataItem.importFiles.filter((f) => {
				switch (this.filterOption) {
					case ImportFilterOptions.All:
						return true;
					case ImportFilterOptions.Current:
						return !f.IsErrorFile;
					case ImportFilterOptions.Error:
						return f.IsErrorFile;
				}
			}),
		};
	}
}
