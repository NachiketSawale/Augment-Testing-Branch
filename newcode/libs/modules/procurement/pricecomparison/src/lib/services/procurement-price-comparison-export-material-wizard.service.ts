/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { createLookup, FieldType, GridApiService, IEditorDialogResult, IFieldValueChangeInfo, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementPricecomparisonRfqHeaderDataService } from './rfq-header-data.service';
import { CompareTypes } from '../model/enums/compare.types.enum';
import { IExportMaterialData, IExportMaterialEntity } from '../model/entities/procurement-price-comparison-export-material-wizard.interface';
import { Observable } from 'rxjs';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { PrcRfqStatusLookupService, ProcurementInternalModule, RfqStatusEntity } from '@libs/procurement/shared';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';

/**
 * Procurement Price Comparison Export Material Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementPriceComparisonExportMaterialWizardService {
	/**
	 * To inject UiCommonMessageBoxService
	 */
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	/**
	 * To inject PlatformHttpService
	 */
	public readonly http = inject(PlatformHttpService);
	/**
	 *To inject ProcurementPricecomparisonRfqHeaderDataService
	 */
	private mainDataService = inject(ProcurementPricecomparisonRfqHeaderDataService);
	/**
	 * To inject UiCommonFormDialogService
	 */
	private readonly formDialogService = inject(UiCommonFormDialogService);
	/**
	 * To inject PlatformTranslateService
	 */
	public translateService = inject(PlatformTranslateService);
	/**
	 * To inject GridApiService
	 */
	public readonly gridApiService = inject(GridApiService);
	/**
	 * To inject BasicsShareFileDownloadService
	 */
	private readonly downloadService = inject(BasicsShareFileDownloadService);

	public quoteSelection!: IRfqHeaderEntity | null;
	public translatePrefix = 'procurement.pricecomparison.wizard';

	/**
	 * Used to prepare data required in grid integration
	 */
	private exportMaterialWizardGridConfiguration: IGridConfiguration<IExportMaterialEntity> = {
		uuid: 'AEC6A2213A6649D392258552DB9956E9',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'IsChecked',
				label: {
					key: '',
					text: 'IsChecked',
				},
				model: 'IsChecked',
				type: FieldType.Boolean,
				headerChkbox: true,
				change: (changeInfo: IFieldValueChangeInfo<IExportMaterialEntity, PropertyType>) => {
					const isChecked = changeInfo.newValue;
					const quoteId = changeInfo.entity?.Id;
					this.exportMaterialEntity.Quote.forEach((quote) => {
						if (quote.Id === quoteId) {
							this.exportMaterialEntity.IsChecked = !!isChecked;
						}
					});
				},
				width: 100,
				sortable: false,
			},
			{
				id: 'statusFk',
				label: {
					key: 'cloud.common.entityState',
					text: 'Status',
				},
				model: 'StatusFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup<IExportMaterialEntity, RfqStatusEntity>({
					dataServiceToken: PrcRfqStatusLookupService,
					showClearButton: true,
					displayMember: 'Description',
				}),
				sortable: false,
				visible: true,
			},
			{
				id: 'qtnCode',
				label: {
					key: 'cloud.common.entityReferenceCode',
					text: 'Reference Code',
				},
				model: 'Code',
				type: FieldType.Description,
				sortable: false,
				visible: true,
				width: 85,
			},
			{
				id: 'qtnDescription',
				label: {
					key: 'cloud.common.entityDescription',
					text: 'Description',
				},
				model: 'Description',
				type: FieldType.Description,
				width: 100,
				sortable: false,
				visible: true,
			},
			{
				id: 'businessPartnerFk',
				label: {
					key: 'cloud.common.entityBusinessPartner',
					text: 'Business Partner',
				},
				model: 'BusinessPartnerName1',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				}),
				width: 120,
				sortable: false,
				visible: true,
			},
			{
				id: 'subTotal',
				label: {
					key: 'procurement.pricecomparison.compareSubtotal',
					text: 'SubTotal',
				},
				type: FieldType.Money,
				model: 'subTotal',
				width: 120,
				sortable: false,
				visible: true,
			},
			{
				id: 'grandTotal',
				label: {
					key: 'procurement.pricecomparison.compareGrandTotal',
					text: 'Grand Total',
				},
				model: 'boqSubTotal',
				type: FieldType.Money,
				width: 120,
				sortable: false,
				visible: true,
			},
			{
				id: 'DateQuoted',
				label: {
					key: 'procurement.pricecomparison.compareSubmitDate',
					text: 'Date Submit',
				},
				model: 'DateQuoted',
				type: FieldType.Date,
				sortable: false,
				visible: true,
				width: 120,
			},
			{
				id: 'qtnVersion',
				label: {
					key: 'cloud.common.entityVersion',
					text: 'Version',
				},
				model: 'QuoteVersion',
				type: FieldType.Integer,
				sortable: false,
				visible: true,
				width: 120,
			},
		],
	};

	/**
	 * Used to prepare data used in form configuration
	 */
	public exportMaterialFormConfig: IFormConfig<IExportMaterialEntity> = {
		formId: 'export.material.wizard',
		showGrouping: true,
		groups: [
			{
				groupId: 1,
				header: { key: this.translatePrefix + '.exportMaterialGrid.choose.quote' },
				visible: true,
				open: true,
				sortOrder: 1,
			},
		],
		rows: [
			{
				groupId: 1,
				id: '1',
				type: FieldType.Grid,
				configuration: this.exportMaterialWizardGridConfiguration as IGridConfiguration<object>,
				model: 'IExportMaterialEntity',
				required: true,
			},
		],
	};

	/**
	 * Initialize exportMaterialEntity
	 */
	public exportMaterialEntity: IExportMaterialEntity = {
		Id: null,
		IsChecked: false,
		Totals: [],
		Quote: [],
	};

	public constructor() {
		this.mainDataService.selectionChanged$.subscribe((selection) => {
			this.quoteSelection = selection[0];
		});
	}

	/**
	 * Opens the export material wizard dialog.
	 */
	public async exportMaterial() {
		if (!this.mainDataService.hasSelection()) {
			this.showDialog(this.translatePrefix + '.info.noHeader');
			return;
		}
		if (!this.quoteSelection) {
			this.showDialog(this.translatePrefix + '.info.noQuoteData');
			return;
		}
		this.quotes4wizardcreatecontract$(this.quoteSelection).subscribe({
			next: (res) => this.populateExportMaterialEntity(res),
			error: (err) => console.error('Error fetching quotes:', err),
		});

		const result = await this.formDialogService.showDialog<IExportMaterialEntity>({
			id: '',
			headerText: this.translateService.instant(this.translatePrefix + '.exportMaterial').text,
			formConfiguration: this.exportMaterialFormConfig,
			entity: this.exportMaterialEntity,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'cloud.common.ok' },
					isDisabled: (info) => {
						return !info.dialog.value?.IsChecked;
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'cloud.common.cancel' },
					autoClose: true,
				},
			],
			resizeable: true,
		});
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.okButtonDialog(result);
		}
		return result as IEditorDialogResult<IExportMaterialEntity>;
	}

	/**
	 * Handles the OK button click for the export material wizard.
	 * @param {IEditorDialogResult<IExportMaterialEntity>} result
	 * @returns
	 */
	private async okButtonDialog(result: IEditorDialogResult<IExportMaterialEntity>) {
		const quoteHeaderId = this.exportMaterialEntity.Quote.find((item) => item.RfqHeaderFk === this.quoteSelection?.Id)?.Id;
		if (result.value) {
			this.resetExportMaterialEntity(result.value);
		}

		if (this.quoteSelection) {
			try {
				const materialData = await this.http.get<IExportMaterialData>('procurement/common/wizard/exportmaterial', {
					params: { objectFk: quoteHeaderId ?? '', ProjectFk: this.quoteSelection.ProjectFk ?? '', CurrencyFk: this.quoteSelection.CurrencyFk, moduleName: ProcurementInternalModule.Quote, subObjectFk: 0 },
				});
				if (materialData?.FileName) {
					this.downloadService.download([], [], materialData.FileName, materialData.path);
				}
			} catch (error) {
				console.error('Error exporting material:', error);
			}
		}
	}

	/**
	 * Fetches quote data for the wizard.
	 * @param {IRfqHeaderEntity} currItem
	 * @returns {Observable<IExportMaterialEntity>}
	 */
	private quotes4wizardcreatecontract$(currItem: IRfqHeaderEntity): Observable<IExportMaterialEntity> {
		const requestPayload = {
			compareType: CompareTypes.Both,
			filter: '',
			rfqHeaderFk: currItem.Id,
		};
		return this.http.post$<IExportMaterialEntity>('procurement/pricecomparison/comparecolumn/quotes4wizardcreatecontract', requestPayload);
	}

	/**
	 * Displays a dialog message.
	 * @param {string} messageKey
	 */
	private showDialog(messageKey: string): void {
		this.messageBoxService.showMsgBox(messageKey, 'cloud.common.informationDialogHeader', 'ico-info');
	}

	/**
	 * Populates the export material entity with quote data.
	 * @param {IExportMaterialEntity} res
	 */
	private populateExportMaterialEntity(res: IExportMaterialEntity) {
		this.exportMaterialEntity.Quote = res.Quote;
		this.exportMaterialEntity.Totals = res.Totals;
		const totalsMap = new Map(res.Totals.map((total) => [total.QtnId, total]));
		const gridService = this.gridApiService.get('AEC6A2213A6649D392258552DB9956E9');
		gridService.items = res.Quote.map((quote) => ({
			...quote,
			subTotal: totalsMap.get(quote.Id)?.subTotal || 0,
			boqSubTotal: totalsMap.get(quote.Id)?.boqSubTotal || 0,
		}));
	}

	/**
	 * Resets the exportMaterialEntity data after dialog completion.
	 * @param {IExportMaterialEntity} value 
	 */
	private resetExportMaterialEntity(value: IExportMaterialEntity) {
		this.exportMaterialEntity = value?.IsChecked ? { Id: null, IsChecked: false, Totals: [], Quote: [] } : { ...value, Totals: [...(value.Totals || [])], Quote: [...(value.Quote || [])] };
	}
}
