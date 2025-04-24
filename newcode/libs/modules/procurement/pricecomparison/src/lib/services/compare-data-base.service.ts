/*
 * Copyright(c) RIB Software GmbH
 */

import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { DataServiceHierarchicalNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { BasicsSharedTaxCodeLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ICompositeBaseEntity } from '../model/entities/composite-base-entity.interface';
import { CompositeCompleteBaseEntity } from '../model/classes/composite-complete-base-entity.class';
import { ProcurementPricecomparisonRfqHeaderDataService } from './rfq-header-data.service';
import { CompareTypes } from '../model/enums/compare.types.enum';
import { ProcurementPricecomparisonConfigurationService } from './configuration.service';
import { ICompareCustomData } from '../model/entities/compare-custom-data.interface';
import { ICompareViewEntity } from '../model/entities/compare-view-entity.interface';
import { ICompareTreeResponseBase } from '../model/entities/compare-tree-response-base.interface';
import { ProcurementPricecomparisonUtilService } from './util.service';
import { ICompareRowEntity } from '../model/entities/compare-row-entity.interface';
import { CompareDataBaseCache } from '../model/classes/compare-data-base-cache.class';
import { CompareTreeBaseBuilder } from '../model/classes/compare-tree-base-builder.class';
import { ICustomCompareColumnEntity } from '../model/entities/custom-compare-column-entity.interface';
import { CompareColumnBaseBuilder } from '../model/classes/compare-column-base-builder.class';
import { Observable, Subject } from 'rxjs';
import { ICompareGridState } from '../model/entities/compare-grid-state.interface';
import { IQuoteColumnResponse } from '../model/entities/quote-column-response.interface';
import { CompareGridColumn } from '../model/entities/compare-grid-column.interface';
import { ICompareModifiedState } from '../model/entities/compare-modified-state.interface';
import { ICompareDataRequestBase } from '../model/entities/compare-data-request-base.interface';
import { ICompareDataSaveResult } from '../model/entities/compare-data-save-result.interface';
import { CompareDataSaveTypes } from '../model/enums/compare-data-save-types.enum';
import { CompareModifiedStateBase } from '../model/classes/compare-modified-state-base.class';
import { ICompareDataUpdateResult } from '../model/entities/compare-data-update-result.interface';
import { ICompareDataUpdateRequest } from '../model/entities/compare-data-update-request.interface';
import { ProcurementPricecomparisonCompareEventManagerService } from './compare-event-manager.service';
import { CompareDataReadManager } from '../model/classes/compare-data-read-manager.class';
import { ICompareDataRowReader } from '../model/entities/compare-data-reader.interface';
import { CompareDataRowReaderBase } from '../model/classes/compare-data-row-reader-base.class';
import { IChartDataEvaluationComparingValue } from '../model/entities/chart/chart-data-evaluation.interface';
import { ICompositeItemEntity } from '../model/entities/item/composite-item-entity.interface';
import { CompareRowTypes } from '../model/constants/compare-row-types';
import { IChartDataComparingValue } from '../model/entities/chart/chart-data-evaluation-comparing-value.interface';
import { CompareFields } from '../model/constants/compare-fields';
import _ from 'lodash';
import { ICompositeBoqEntity } from '../model/entities/boq/composite-boq-entity.interface';

export abstract class ProcurementPricecomparisonCompareDataBaseService<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>,
> extends DataServiceHierarchicalNode<T, CompositeCompleteBaseEntity<T>, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	protected readonly http = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly mdcTaxCodeSvc = ServiceLocator.injector.get(BasicsSharedTaxCodeLookupService);
	protected readonly configService = ServiceLocator.injector.get(ProcurementPricecomparisonConfigurationService);
	protected readonly utilService = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly eventMgr = ServiceLocator.injector.get(ProcurementPricecomparisonCompareEventManagerService);
	protected readonly uomSvc = ServiceLocator.injector.get(BasicsSharedUomLookupService);
	public readonly parentService = ServiceLocator.injector.get(ProcurementPricecomparisonRfqHeaderDataService);

	private _items?: T[];
	private _gridStateChanged = new Subject<ICompareGridState<T>>();

	protected abstract get saveSuccess(): Subject<ICompareDataSaveResult>;

	public abstract get containerUuid(): string;

	public abstract get compareType(): CompareTypes;

	public abstract get compareCache(): CompareDataBaseCache<T>;

	public abstract get modifiedState(): CompareModifiedStateBase;

	public abstract get treeBuilder(): CompareTreeBaseBuilder<T, RT>;

	public abstract get columnBuilder(): CompareColumnBaseBuilder<T, RT>;

	public abstract get readMgr(): CompareDataReadManager<T>;

	public abstract get dataReaders(): ICompareDataRowReader<T>[];

	public abstract get rowReader(): CompareDataRowReaderBase<T>;

	public abstract get deviationFields(): string[];

	public get gridStateChanged(): Observable<ICompareGridState<T>> {
		return this._gridStateChanged;
	}

	protected abstract getColumnsFromResponse(response: RT): ICustomCompareColumnEntity[];

	protected abstract getCompareRowsFromResponse(response: RT): ICompareRowEntity[];

	protected abstract getQuoteRowsFromResponse(response: RT): ICompareRowEntity[];

	protected abstract getBillingSchemaRowsFromResponse(response: RT): ICompareRowEntity[];

	protected abstract provideCustomLoadPayload(payload: ICompareDataRequestBase): ICompareDataRequestBase;

	public abstract getCompareFieldName(row: T): string;

	protected constructor(
		protected apiUrl: string
	) {
		super({
			apiUrl: apiUrl,
			readInfo: {
				endPoint: 'list',
				usePost: true
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			roleInfo: <IDataServiceChildRoleOptions<T, IRfqHeaderEntity, RfqHeaderEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'ComparisonData',
				parent: ServiceLocator.injector.get(ProcurementPricecomparisonRfqHeaderDataService)
			}
		});
	}

	private get configurationFk() {
		const selectedItem = this.parentService.getSelectedEntity();
		return selectedItem ? selectedItem.PrcConfigurationFk : null;
	}

	public reload() {
		return this.parentService.hasSelection() ? this.load({
			id: 0,
			pKey1: this.parentService.getSelectedEntity()?.Id
		}) : Promise.resolve([]);
	}

	private drawTree(items: T[], refresh?: boolean) {
		const gridState: ICompareGridState<T> = {
			data: items
		};
		if (!refresh) {
			gridState.columns = this.columnBuilder.buildColumns();
		}

		this._items = items;
		this._gridStateChanged.next(gridState);
	}

	protected override provideLoadPayload() {
		return this.provideCustomLoadPayload({
			RfqHeaderId: this.getParentSelectedIdElse(),
			CompareType: this.compareType,
			CompareQuoteRows: this.getCompareQuoteRows(),
			CompareBillingSchemaRows: this.getCompareBillingSchemaRows(),
			CompareRows: this.getCompareRows(),
			CompareBaseColumns: this.getCompareBaseColumns(),
			Version: 2
		});
	}

	public getTree(): T[] {
		return this._items ?? [];
	}

	public override parentOf(element: T): T | null {
		return element.parentItem ? element.parentItem : null;
	}

	public override childrenOf(element: T): T[] {
		return element.Children;
	}

	public override onLoadSucceeded(loaded: RT[]): T[] {
		this.buildCache(loaded);

		this.utilService.updateCompareConfig(
			this.getCompareRows(),
			this.getCompareBillingSchemaRows(),
			this.getCompareQuoteRows(),
			this.compareCache.visibleCompareRows,
			this.compareCache.visibleQuoteRows,
			this.compareCache.visibleBillingSchemaRows,
			this.compareCache.columns
		);

		this.loadTreeSuccess(loaded);
		const result = this.buildTree(loaded);

		// Re-order column by rank.
		this.compareCache.visibleColumns = this.utilService.reorderCompareColumns(
			this.compareCache.visibleQuoteRows,
			this.compareCache.visibleColumns,
			result
		);

		this.drawTree(result);
		return result;
	}

	public async saveCustomSettings2DB(createData: Partial<ICompareViewEntity & ICompareCustomData & { gridColumns: object }>) {
		return await this.configService.saveCustomSettings2DB(this.configurationFk, this.compareType, createData);
	}

	public getParentSelectedIdElse(id?: number): number {
		const selected = this.parentService.getSelectedEntity();
		return selected ? selected.Id : id ?? -1;
	}

	public getCompareQuoteRows() {
		return this.configService.getCustomSettingsCompareQuoteRows(this.configurationFk, this.compareType);
	}

	public getCompareBillingSchemaRows() {
		return this.configService.getCustomSettingsCompareBillingSchemaRows(this.configurationFk, this.compareType);
	}

	public getCompareRows() {
		return this.configService.getCustomSettingsCompareRows(this.configurationFk, this.compareType);
	}

	public getCompareBaseColumns() {
		return this.configService.getCustomSettingsCompareColumns(this.compareType);
	}

	public isVerticalCompareRows() {
		return this.configService.isVerticalCompareRows(this.compareType);
	}

	public isLineValueColumnVisible() {
		return this.configService.isLineValueColumnVisible(this.compareType);
	}

	public isFinalShowInTotal() {
		return this.configService.isFinalShowInTotal(this.compareType);
	}

	public async loadQuoteColumns() {
		const response = await this.http.post<IQuoteColumnResponse>('procurement/pricecomparison/comparecolumn/columnlist', {
			rfqHeaderFk: this.parentService.getSelectedEntity()?.Id,
			compareType: this.compareType
		});
		return this.utilService.restructureQuoteCompareColumns(response.Main, response.Quote, false, this.getCompareBaseColumns());
	}

	public loadGridColumns(): Promise<CompareGridColumn<T>[]> {
		// TODO-DRIZZLE: To be checked.
		return Promise.resolve([]);
	}

	protected buildCache(loaded: RT[]) {
		this.compareCache.clear();
		this.utilService.concat(this.compareCache.taxCodes, this.mdcTaxCodeSvc.syncService?.getListSync() ?? []);
		loaded.forEach((response, idx) => {
			const compareRows = this.getCompareRowsFromResponse(response);
			if (compareRows && compareRows.length > 0) {
				this.utilService.concat(this.compareCache.summaryRows, compareRows.filter(r => r.ShowInSummary === true));
				this.utilService.concat(this.compareCache.visibleCompareRows, compareRows.filter(r => r.Visible === true));
				this.compareCache.leadingRow = compareRows.find(r => r.IsLeading === true) ?? this.compareCache.leadingRow;
			}

			this.utilService.concat(this.compareCache.visibleQuoteRows, this.getQuoteRowsFromResponse(response).filter(r => r.Visible === true));
			this.utilService.concat(this.compareCache.visibleBillingSchemaRows, this.getBillingSchemaRowsFromResponse(response).filter(r => r.Visible === true));
			this.utilService.concat(this.compareCache.finalBillingSchema, response.FinalBillingSchemas);

			this.utilService.concat(this.compareCache.rfqHeaders, response.RfqHeader);
			this.utilService.concat(this.compareCache.generalTypes, response.PrcGeneralsType);
			this.utilService.concat(this.compareCache.rfqCharacteristicGroup, this.utilService.flatTree(response.RfqCharacteristicGroup, []));
			this.utilService.concat(this.compareCache.rfqCharacteristic, response.RfqCharacteristic);
			this.utilService.concat(this.compareCache.quoteCharacteristic, response.QuoteCharacteristic);

			const columns = this.utilService.buildTree(this.getColumnsFromResponse(response), 'Id', 'CompareColumnFk', 'Children');
			this.utilService.concat(this.compareCache.columns, columns);
			this.utilService.concat(this.compareCache.visibleColumns, columns);

			if (response.Quote) {
				this.utilService.processQuote(response.Quote);
			}
			this.utilService.concat(this.compareCache.quotes, response.Quote);

			this.utilService.concat(this.compareCache.allRfqCharacteristic, this.compareCache.allRfqCharacteristic.concat(response.RfqCharacteristic));
			this.utilService.concat(this.compareCache.allQuoteCharacteristic, this.compareCache.allQuoteCharacteristic.concat(response.QuoteCharacteristic));
			this.utilService.concat(this.compareCache.originalFields, this.utilService.extractOriginalFields(response.Main));
			this.utilService.concat(this.compareCache.materialRecords, response.MaterialRecord);
			this.utilService.concat(this.compareCache.uoms, response.PCUom);
			this.utilService.concat(this.compareCache.quoteStatus, response.QuoteStatus);
			this.utilService.concat(this.compareCache.reqStatus, response.reqStatus);
			this.utilService.concat(this.compareCache.prcItemEvaluations, response.PrcItemEvaluation);
			this.utilService.concat(this.compareCache.currencies, response.Currency);
			this.utilService.concat(this.compareCache.taxCodeMatrixes, response.TaxCodeMatrix);
			this.utilService.concat(this.compareCache.turnovers, response.Turnover);
			this.utilService.concat(this.compareCache.businessPartnerAvgEvaluationValues, response.BusinessPartnerAvgEvaluationValue);
			this.utilService.concat(this.compareCache.projectChanges, response.ProjectChange);
			this.utilService.concat(this.compareCache.prcIncoterms, response.PrcIncoterm);

			response.Main.forEach(requisition => {
				this.compareCache.generalItems.set(requisition.RfqHeaderId, requisition.QuoteGeneralItems);
			});

			this.processResponse(response);

			this.buildCustomCache(response);
		});

		// Lookup
		this.uomSvc.cache.setItems(this.compareCache.uoms);
	}

	protected buildCustomCache(response: RT) {

	}

	protected loadTreeSuccess(loaded: RT[]) {

	}

	protected processResponse(response: RT) {

	}

	protected buildTree(loaded: RT[]): T[] {
		return this.treeBuilder.buildTree(loaded);
	}

	public checkModifiedState(isNewVersion?: boolean): Promise<ICompareModifiedState> {
		// TODO-DRIZZLE: To be checked.
		return Promise.resolve({
			hasModified: true
		});
	}

	public hideInsteadOfDeletingRows(): boolean {
		return true;
	}

	public async reloadLatestQuotes(): Promise<boolean> {
		const result = await this.http.post<boolean>('procurement/pricecomparison/comparecolumn/reload', {
			rfqHeaderFk: this.parentService.getSelectedBaseRfqId(),
			compareType: this.compareType
		});
		if (result) {
			this.reload().then();
		}
		return result;
	}

	public async saveToQuote(
		type: CompareDataSaveTypes,
		qtnSourceTarget?: object | null,
		isFromNewVersion?: boolean,
		isSaveAll?: boolean
	): Promise<ICompareDataSaveResult> {
		const allQuoteIds: number[] = [];
		const isNewVersion = type === CompareDataSaveTypes.New;
		if (isNewVersion && isSaveAll) {
			this.compareCache.visibleColumns.forEach((column) => {
				allQuoteIds.push(column.QuoteHeaderId);
			});
		}
		return this.checkModifiedState(isNewVersion).then((result) => {
			if (result.hasModified || (isNewVersion && isSaveAll)) {
				const saveData: ICompareDataUpdateRequest = {
					AllQuoteIds: allQuoteIds,
					...result.saveData
				};
				// TODO-DRIZZLE: To be checked.
				// let modifiedData = this.modifiedState.modifiedData;

				if (isNewVersion && this.modifiedState.commonData.PrcGeneralsToSave) {
					const generalQuoteIds = this.modifiedState.commonData.PrcGeneralsToSave.map(e => e.QuoteHeaderId);
					saveData.AllQuoteIds = saveData.AllQuoteIds.concat(generalQuoteIds);
				}

				if (qtnSourceTarget) {
					// TODO-DRIZZLE: To be checked
					// updateModifiedKeyService.updateModifiedKey(saveData, commonService.constant.compareType.boqItem, qtnSourceTarget);
					// modifiedData = saveData.ModifiedData as IModifiedData;
				}

				return this.http.post<ICompareDataUpdateResult>(`${this.apiUrl}/save?isNewVersion=${isNewVersion}`, saveData).then((result) => {
					this.modifiedState.clear();
					// TODO-DRIZZLE: To be checked.
					// service.clearItemEvaluationRecalculateRowCache(saveData.ModifiedData);
					// treeStateHelperService.cleanNodesCache(commonService.constant.compareType.boqItem);
					// platformDataServiceModificationTrackingExtension.clearModificationsInRoot(mainDataService);

					if (!isNewVersion && !isFromNewVersion) {
						// TODO-DRIZZLE: To be checked.
						/*const children = service.getChildServices();
						_.forEach(children, function (childService) {
							childService.mergeInUpdateData(response.data);
						});*/

						// TODO-DRIZZLE: To be checked.
						/*const evaluationService = evaluationServiceCache.getService(evaluationServiceCache.serviceTypes.EVALUATION_DATA, '367c0031930d45d9a84cd866326702bc');
						if (evaluationService) {
							evaluationService.mergeInUpdateData(response.data);
						}*/

						if ((result.BillingSchemaTypeList && result.BillingSchemaTypeList.length) || (result.BillingSchemaToSave && result.BillingSchemaToSave.length)) {
							// TODO-DRIZZLE: To be checked.
							/*if (_.isEmpty(otherService.modifiedData)) {
								let billingSchemaService = $injector.get('priceComparisonBillingSchemaService');
								billingSchemaService.mergeInUpdateData(response.data);
								service.resetBillingSchemaValue(response.data['BillingSchemaTypeList'], service.selectedQuote, response.data.BillingSchemaToSave);
							} else {
								const exchangeRate = commonService.getExchangeRate(service.selectedQuote.RfqHeaderId, service.selectedQuote.Id);
								this.utilService.recalculateBillingSchema(service, service.selectedQuote.QtnHeaderId, exchangeRate, {}, {}, otherService.modifiedData, service.modifiedData);
							}*/
						}
					}
					const saveResult: ICompareDataSaveResult = {
						status: true,
						type: type,
						state: this.modifiedState,
						result: result,
						qtnSourceTarget: qtnSourceTarget,
						isFromNewVersion: isFromNewVersion,
						isSaveAll: isSaveAll,
						hasCommonChanged: Object.keys(this.modifiedState.commonData.modifiedData).length > 0
					};

					this.saveSuccess.next(saveResult);

					return saveResult;
				});
			} else {
				return {
					status: true,
					type: type,
					state: this.modifiedState,
					qtnSourceTarget: qtnSourceTarget,
					isFromNewVersion: isFromNewVersion,
					isSaveAll: isSaveAll,
					hasCommonChanged: false
				};
			}
		});
	}

	public getDataForGraphicalEvaluation(selectedItem: ICompositeItemEntity | ICompositeBoqEntity) {
		const translateSvc = ServiceLocator.injector.get(PlatformTranslateService);

		const datas: IChartDataEvaluationComparingValue[] = [];

		if (selectedItem != null) {
			_.map(this.compareCache.visibleColumns, visibleColumn => {
				const data: IChartDataEvaluationComparingValue = {
					columnTitle: this.utilService.translateTargetOrBaseBoqName(visibleColumn.Id) || visibleColumn.Description,
					columnField: visibleColumn.Id,
					comparingValues: []
				};

				// always has grand total values for chart container.
				const grandTotalItem = this.getTree()[0];
				if (grandTotalItem && grandTotalItem.totals && grandTotalItem.LineTypeFk === CompareRowTypes.grandTotal) {
					const comparingValue = {
						title: translateSvc.instant('procurement.pricecomparison.compareGrandTotal').text,
						value: grandTotalItem.totals[visibleColumn.Id]
					};
					data.comparingValues.push(comparingValue);
				}
				if (selectedItem.totals && selectedItem.LineTypeFk === CompareRowTypes.rfq) {
					const comparingValue1 = {
						title: translateSvc.instant('procurement.pricecomparison.compareRfqTotal').text,
						value: selectedItem.totals[visibleColumn.Id]
					};
					data.comparingValues.push(comparingValue1);
				} else if (selectedItem.totals && selectedItem.LineTypeFk === CompareRowTypes.requisition) {
					const comparingValue2 = {
						title: translateSvc.instant('procurement.pricecomparison.compareRequisitionTotal').text,
						value: selectedItem.totals[visibleColumn.Id]
					};
					data.comparingValues.push(comparingValue2);
				} else if (selectedItem.LineTypeFk === CompareRowTypes.prcItem && !this.isVerticalCompareRows()) {
					_.map(this.compareCache.summaryRows, function (summaryRow) {
						const comparingValue: IChartDataComparingValue = {
							title: summaryRow.DisplayName || '',
							value: 0
						};
						if (summaryRow.Field === CompareFields.percentage) {
							comparingValue.value = 0; // selectedItem.percentages[visibleColumn.Id] || '';
						} else if (summaryRow.Field === CompareFields.rank) {
							comparingValue.value = 0; // selectedItem.ranks[visibleColumn.Id] || '';
						} else {
							//const quoteItem = _.find(selectedItem.QuoteItems, { QuoteKey: visibleColumn.Id });
							comparingValue.value = ''; // quoteItem[summaryRow.Field] as string;
						}

						data.comparingValues.push(comparingValue);
					});
				}

				datas.push(data);
			});
		}
		return datas;
	}
}