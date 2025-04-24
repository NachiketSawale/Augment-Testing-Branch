/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { createLookup, FieldType, IFormDialogConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsSharedPrcStockTransactionTypeLookupService } from '@libs/basics/shared';
import { ProcurementStockHeaderDataService } from '../services/procurement-stock-header-data.service';
import { IClearProjectStockOptions, IProjectStockResult } from '../model/interfaces/wizard/stock-clear-project-stock.interface';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { ProcurementStockTotalDataService } from '../services/procurement-stock-total-data.service';
import { ProcurementStockTransactionType } from '../model/enums';
import { IBasicsCustomizePrcStockTransactionTypeEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockClearProjectStockWizardService {
	private readonly http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly stockHeaderService = inject(ProcurementStockHeaderDataService);
	private readonly stockTotalService = inject(ProcurementStockTotalDataService);
	private readonly wizardTitle = 'procurement.stock.wizard.ClearProjectStockTitle';

	public async onStartWizard() {
		const selectedHeaders = this.stockHeaderService.getList().filter((header) => header.IsChecked);
		if (selectedHeaders.length === 0) {
			await this.messageBoxService.showInfoBox('procurement.stock.wizard.SelectProjectStockMessage', 'ico-info', false);
			return;
		}

		//Stock header not belongs to current login company
		if (selectedHeaders.find((header) => header.CompanyFk !== this.configService.clientId)) {
			await this.messageBoxService.showInfoBox('procurement.stock.wizard.notBelongToLoginCompanyMessage', 'ico-info', false);
			return;
		}

		const results = await this.http.post<IProjectStockResult[]>('procurement/stock/header/getclearprojectstock', {
			ProjectId : null,
			prjStockIds: selectedHeaders.map((header) => header.Id)
		});

		const initialData = {
			StockResults: results,
			TransactionDate: new Date(),
			TransactionTypeId: null,
		};

		const dialogResult = await this.formDialogService.showDialog(this.getFormConfig(initialData));

		if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
			await this.http.post('procurement/stock/header/updateclearprojectstock', {
				prjStockIds: initialData.StockResults.map((result) => result.Id),
				transactionDate: initialData.TransactionDate,
				transactionTypeId: initialData.TransactionTypeId,
				ProjectId: null
			});

			await this.messageBoxService.showInfoBox('procurement.stock.wizard.ClearProjectStockMessage', 'info', false);
			await this.stockTotalService.refreshAll();
		}
	}

	private getFormConfig(initialData: IClearProjectStockOptions): IFormDialogConfig<IClearProjectStockOptions> {
		return {
			id: 'stock-clear-project-stock',
			headerText: {
				key: this.wizardTitle,
			},
			formConfiguration: {
				formId: 'stock-clear-project-stock-form',
				showGrouping: true,
				groups: [
					{ groupId: 'stocks', header: { key: 'procurement.stock.moduleName' }, open: true },
					{ groupId: 'settings', header: { key: 'procurement.stock.wizard.ClearSetting' }, open: true },
				],
				rows: [
					{
						id: 'StockResults',
						model: 'StockResults',
						type: FieldType.Grid,
						groupId: 'stocks',
						configuration: {
							uuid: 'f52781149ca746bf8ccdc6602b137841',
							columns: [
								{
									id: 'projectNo',
									model: 'ProjectId',
									width: 80,
									type: FieldType.Lookup,
									label: { key: 'cloud.common.entityProjectNo' },
									lookupOptions: createLookup({
										dataServiceToken: ProjectSharedLookupService,
										displayMember: 'ProjectNo',
									}),
									sortable: true,
									readonly: true,
									visible: true,
								},
								{
									id: 'projectName',
									model: 'ProjectId',
									width: 100,
									type: FieldType.Lookup,
									label: { key: 'loud.common.entityProjectName' },
									lookupOptions: createLookup({
										dataServiceToken: ProjectSharedLookupService,
										displayMember: 'ProjectName',
									}),
									sortable: true,
									readonly: true,
									visible: true,
								},
								{
									id: 'code',
									model: 'Code',
									type: FieldType.Code,
									width: 80,
									label: { key: 'cloud.common.entityCode' },
									sortable: true,
									visible: true,
									readonly: true,
								},
								{
									id: 'description',
									model: 'Description',
									type: FieldType.Code,
									width: 100,
									label: { key: 'cloud.common.entityDescription' },
									sortable: true,
									visible: true,
									readonly: true,
								},
								{
									id: 'quantity',
									model: 'Quantity',
									type: FieldType.Quantity,
									width: 100,
									label: { key: 'procurement.stock.stocktotal.Quantity' },
									sortable: true,
									visible: true,
									readonly: true,
								},
								{
									id: 'total',
									model: 'Total',
									type: FieldType.Money,
									width: 100,
									label: { key: 'procurement.stock.stocktotal.Total' },
									sortable: true,
									visible: true,
									readonly: true,
								},
								{
									id: 'provisionTotal',
									model: 'ProvisionTotal',
									type: FieldType.Money,
									width: 100,
									label: { key: 'procurement.stock.stocktotal.ProvisionTotal' },
									sortable: true,
									visible: true,
									readonly: true,
								},
								{
									id: 'address',
									model: 'Address',
									type: FieldType.Description,
									width: 150,
									label: { key: 'cloud.common.address' },
									sortable: true,
									visible: true,
									readonly: true,
								},
							],
							items: initialData.StockResults,
							iconClass: null,
							skipPermissionCheck: true,
							enableColumnReorder: true,
							enableCopyPasteExcel: false,
						},
						readonly: true,
					},
					{
						id: 'TransactionDate',
						model: 'TransactionDate',
						type: FieldType.DateUtc,
						label: { key: 'procurement.stock.wizard.TransactionDate' },
						groupId: 'settings',
					},
					{
						id: 'TransactionTypeId',
						model: 'TransactionTypeId',
						groupId: 'settings',
						label: { key: 'procurement.stock.wizard.TransactionType' },
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedPrcStockTransactionTypeLookupService,
							imageSelector: {
								select(item: IBasicsCustomizePrcStockTransactionTypeEntity): string {
									return item.Icon === 1 ? 'control-icons ico-stock-type-in' : 'control-icons ico-stock-type-out';
								},
								getIconType() {
									return 'css';
								},
							},
							showGrid: false,
							displayMember: 'DescriptionInfo.Translated',
							clientSideFilter: {
								execute: (item, context) => {
									return item.Id === ProcurementStockTransactionType.MaterialConsumption ||
										item.Id === ProcurementStockTransactionType.Wastage ||
										item.Id === ProcurementStockTransactionType.OutwardMovement;
								}
							}
						}),
					},
				],
			},
			entity: initialData,
			//TODO: depends on framework ticket DEV-15769
			/*customButtons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'ui.common.dialog.okBtn' },
					isDisabled: (info) => {
						return initialData.StockResults.length === 0 || !!initialData.TransactionTypeId;
					},
				},
			],*/
		};
	}
}
