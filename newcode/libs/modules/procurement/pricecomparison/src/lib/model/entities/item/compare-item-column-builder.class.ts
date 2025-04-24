/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable, from } from 'rxjs';
import { ServiceLocator } from '@libs/platform/common';
import { ConcreteFieldOverload, FieldType } from '@libs/ui/common';
import { CompareColumnBaseBuilder } from '../../classes/compare-column-base-builder.class';
import { ICompositeItemEntity } from './composite-item-entity.interface';
import { ICompareItemTreeResponse } from './compare-item-tree-response.interface';
import { CompareGridColumn } from '../compare-grid-column.interface';
import { ProcurementPricecomparisonCompareItemDataBaseService } from '../../../services/data/item/compare-item-data-base.service';
import { ProcurementPricecomparisonSingleQuoteContractWizardItemService } from '../../../services/wizard/single-quote-contract-wizard.service';
import { ICompareRowEntity } from '../compare-row-entity.interface';
import { CompareFields } from '../../constants/compare-fields';
import { CompareRowTypes } from '../../constants/compare-row-types';
import { Constants } from '../../constants/constants';
import { ICustomPrcItem } from './custom-prc-item.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { CompareItemColumnFormatter } from './compare-item-column-formatter.class';
import { ProcurementCommonItemStatusLookupService } from '@libs/procurement/common';
import {
	BasicsSharedItemType2LookupService,
	BasicsSharedItemTypeLookupService
} from '@libs/basics/shared';


export class CompareItemColumnBuilder extends CompareColumnBaseBuilder<ICompositeItemEntity, ICompareItemTreeResponse> {
	private colFormatter = new CompareItemColumnFormatter();
	public constructor(
		private itemDataSvc: ProcurementPricecomparisonCompareItemDataBaseService
	) {
		super(itemDataSvc, ServiceLocator.injector.get(ProcurementPricecomparisonSingleQuoteContractWizardItemService));
	}

	public get summaryTotalField(): string {
		return CompareFields.total;
	}

	private getBasicsColumns(): CompareGridColumn<ICompositeItemEntity>[] {
		return [
			// Compare Description Column
			super.getCompareDescriptionColumn(),
			// Common Columns
			super.createLookupColumn('StatusFk', 'StatusFk', {text: 'Status', key: 'cloud.common.entityStatus'}, 120, true, {
				dataServiceToken: ProcurementCommonItemStatusLookupService
			}),
			super.createColumn('ItemNo', 'ItemNo', {text: 'Item No.', key: 'procurement.common.prcItemItemNo'}, FieldType.Description, 120, true),
			super.createColumn('Description1', 'Description1', {text: 'Description 1', key: 'procurement.common.prcItemDescription1'}, FieldType.Description, 150, true),
			super.createColumn('budgetperunit', 'BudgetPerUnit', {text: 'Budget/Unit', key: 'boq.main.BudgetPerUnit'}, FieldType.Money, 80, true, this.colFormatter.price()),
			super.createColumn('budgettotal', 'BudgetTotal', {text: 'Budget/Unit', key: 'boq.main.BudgetTotal'}, FieldType.Money, 80, true, this.colFormatter.price()),
			// Common Columns2
			super.createLookupColumn('itemtypeid', 'ItemTypeFk', {text: 'Item Type', key: 'procurement.common.prcItemType'}, 100, true, {
				dataServiceToken: BasicsSharedItemTypeLookupService,
			}),
			super.createLookupColumn('itemtype2id', 'ItemType2Fk', {text: 'Item Type 2', key: 'procurement.common.prcItemType2'}, 100, true, {
				dataServiceToken: BasicsSharedItemType2LookupService
			}),
			super.createColumn('itemaltid', 'ItemAlt', {text: 'Item Alt', key: 'procurement.common.prcItemAlt'}, FieldType.Description, 80, true),
			super.createColumn('quantity', 'Quantity', {text: 'Quantity', key: 'cloud.common.entityQuantity'}, FieldType.Description, 80, true, this.colFormatter.quantity()),
			super.createColumn('Description2', 'Description2', {text: 'Description 2', key: 'procurement.common.prcItemFurtherDescription'}, FieldType.Description, 150, true),
			super.createColumn('Specification', 'Specification', {text: 'Specification', key: 'cloud.common.EntitySpec'}, FieldType.Description, 150, true),
			super.createColumn('DateRequired', 'DateRequired', {text: 'Required By', key: 'cloud.common.entityRequiredBy'}, FieldType.Description, 100, true),
			super.createColumn('OnHire', 'OnHire', {text: 'On Hire Date', key: 'procurement.common.prcItemOnHireDate'}, FieldType.Description, 100, true),
			super.createColumn('OffHire', 'OffHire', {text: 'Off Hire Date', key: 'procurement.common.prcItemOffHireDate'}, FieldType.Description, 100, true),
			super.createColumn('BasAddressFk', 'AddressFk', {text: 'Delivery Address', key: 'procurement.common.prcItemDeliveryAddress'}, FieldType.Description, 150, true),
			super.createColumn('PackageCode', 'PackageFk', {text: 'Package Code', key: 'procurement.common.prcItemPackageCode'}, FieldType.Description, 100, true),
			super.createColumn('PackageDescription', 'PackageFk', {text: 'Package Description', key: 'procurement.common.prcItemPackageDescription'}, FieldType.Description, 120, true),
			super.createColumn('StructureCode', 'StructureFk', {text: 'Structure Code', key: 'cloud.common.entityStructureCode'}, FieldType.Description, 100, true),
			super.createColumn('StructureDescription', 'StructureFk', {text: 'Structure Description', key: 'cloud.common.entityStructureDescription'}, FieldType.Description, 120, true),
			super.createColumn('MaterialCode', 'MdcMaterialFk', {text: 'Material No.', key: 'procurement.common.prcItemMaterialNo'}, FieldType.Description, 100, true),
			super.createColumn('UomFk', 'UomFk', {text: 'UoM', key: 'cloud.common.entityUoM'}, FieldType.Description, 100, true, this.colFormatter.uom()),
			super.createColumn('ControllingUnitCode', 'ControllingUnitFk', {text: 'Controlling Unit Code', key: 'cloud.common.entityControllingUnitCode'}, FieldType.Description, 120, true),
			super.createColumn('ControllingUnitDesc', 'ControllingUnitFk', {text: 'Controlling Unit Description', key: 'cloud.common.entityControllingUnitDesc'}, FieldType.Description, 150, true),
			super.createColumn('TaxCodeCode', 'TaxCodeFk', {text: 'Tax Code', key: 'cloud.common.entityTaxCode'}, FieldType.Description, 100, true),
			super.createColumn('TaxCodeDescription', 'TaxCodeFk', {text: 'Tax Code Description', key: 'cloud.common.entityTaxCodeDescription'}, FieldType.Description, 120, true),
			super.createColumn('PaymentTermFiCode', 'PaymentTermFiFk', {text: 'Payment Term (FI)', key: 'cloud.common.entityPaymentTermFI'}, FieldType.Description, 150, true),
			super.createColumn('PaymentTermFiDescription', 'PaymentTermFiFk', {text: 'Payment Term (FI) Description', key: 'cloud.common.entityPaymentTermFiDescription'}, FieldType.Description, 170, true),
			super.createColumn('PaymentTermPaCode', 'PaymentTermPaFk', {text: 'Payment Term (PA)', key: 'cloud.common.entityPaymentTermPA'}, FieldType.Description, 150, true),
			super.createColumn('PaymentTermPaDescription', 'PaymentTermPaFk', {text: 'Payment Term (PA) Description', key: 'cloud.common.entityPaymentTermPaDescription'}, FieldType.Description, 170, true),
			super.createColumn('PrcIncotermDesc', 'PrcIncotermFk', {text: 'Incoterms', key: 'cloud.common.entityIncoterms'}, FieldType.Description, 100, true),
			super.createColumn('externalcode', 'ExternalCode', {text: 'External Code', key: 'boq.main.ExternalCode'}, FieldType.Description, 80, true),
			super.createColumn('UserDefined1', 'UserDefined1', {text: 'User-Defined1', key: 'procurement.common.userDefined1'}, FieldType.Description, 100, true),
			super.createColumn('UserDefined2', 'UserDefined2', {text: 'User-Defined2', key: 'procurement.common.userDefined2'}, FieldType.Description, 100, true),
			super.createColumn('UserDefined3', 'UserDefined3', {text: 'User-Defined3', key: 'procurement.common.userDefined3'}, FieldType.Description, 100, true),
			super.createColumn('UserDefined4', 'UserDefined4', {text: 'User-Defined4', key: 'procurement.common.userDefined4'}, FieldType.Description, 100, true),
			super.createColumn('UserDefined5', 'UserDefined5', {text: 'User-Defined5', key: 'procurement.common.userDefined5'}, FieldType.Description, 100, true),
			super.createColumn('IsContracted', 'IsContracted', {text: 'IsContracted', key: 'procurement.common.entityIsContracted'}, FieldType.Description, 100, true, this.colFormatter.isContracted()),
		];
	}

	private getPriceColumns(): CompareGridColumn<ICompositeItemEntity>[] {
		return [
			// Common Columns3
			super.createColumn('Price', 'Price', {text: 'Price', key: 'cloud.common.entityPrice'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('PriceExtra', 'PriceExtra', {text: 'Price Extras', key: 'procurement.common.prcItemPriceExtras'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('TotalPrice', 'TotalPrice', {text: 'Total Price', key: 'procurement.common.prcItemTotalPrice'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('FactoredTotalPrice', 'FactoredTotalPrice', {text: 'Factored Total Price', key: 'procurement.common.item.prcItemFactoredTotalPrice'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('PriceUnit', 'PriceUnit', {text: 'Price Unit', key: 'cloud.common.entityPriceUnit'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('Total', 'Total', {text: 'Total', key: 'cloud.common.entityTotal'}, FieldType.Description, 100, true, this.colFormatter.price()),
			super.createColumn('UomPriceUnitFk', 'UomPriceUnitFk', {text: 'Price Unit UoM', key: 'cloud.common.entityPriceUnitUoM'}, FieldType.Description, 100, true),
		];
	}

	private isQuoteStatusReadonly(columnDef: CompareGridColumn<ICompositeItemEntity>, dataContext: ICompositeItemEntity) {
		const originalFields = this.utilService.isPrcItemRow(dataContext.LineTypeFk) ? dataContext.parentItem?.OriginalFields : dataContext.OriginalFields;
		const quoteId = this.utilService.getQuoteId(columnDef.id);
		const quote = originalFields?.find(e => e.QtnHeaderId === quoteId);
		const quoteStatus = quote ? this.dataSvc.compareCache.quoteStatus.find(e => e.Id === quote.StatusFk) : null;
		return quoteStatus && quoteStatus.IsReadonly;
	}

	private generateCreateQuoteAddItemWizardButtonTemplate(columnDef: CompareGridColumn<ICompositeItemEntity>, dataContext: ICompositeItemEntity, disabled?: boolean) {
		if (this.bidderSvc.isReference(columnDef.field)) {
			return '';
		}
		return this.utilService.createGridCellButtonTemplateAsNavigator(columnDef, dataContext, 'procurement.pricecomparison.wizard.createQuoteItem', () => {
			// TODO-DRIZZLE: To be checked.
			/*showAddOrInsertDialog(column, entity, {
				headerText: $translate.instant('procurement.pricecomparison.wizard.createQuoteItem')
			});*/
		}, {
			disabled: disabled,
			icon: 'ico-boq-item-new'
		});
	}

	private getReplacementItems(dataContext: ICompositeItemEntity, quoteKey: string) {
		// for quote item
		if (dataContext.LineTypeFk === CompareRowTypes.prcItem) {
			const originalQtnItem = dataContext.QuoteItems.find((item) => {
				return item.QuoteKey === quoteKey;
			});

			if (originalQtnItem && originalQtnItem.ReplacementItems && originalQtnItem.ReplacementItems.length) {
				return originalQtnItem.ReplacementItems;
			}
		}

		// for quote new item
		if (dataContext.LineTypeFk === CompareRowTypes.quoteNewItem) {
			if (dataContext && dataContext.ReplacementItems4QuoteNewItem && dataContext.ReplacementItems4QuoteNewItem.length) {
				return dataContext.ReplacementItems4QuoteNewItem;
			}
		}

		return [];
	}

	private onCreate(dataContext: ICompositeItemEntity, quoteKey: string, self: HTMLElement) {
		// TODO-DRIZZLE: To be checked.
		/*service.replacementItems = this.getReplacementItems(dataContext, quoteKey);
		let $scope = $rootScope.$new(true);
		$scope.dataInfo = {
			gridId: platformCreateUuid()
		};
		let popOptions = {
			// id: $scope.settings.lookupType,
			scope: $scope,
			controller: ['$scope', '$popupInstance', function ($scope, $popupInstance) {
				$popupInstance.onResizeStop.register(function () {
					platformGridAPI.grids.resize($scope.dataInfo.gridId);
				});
			}],
			// options: $scope.options,
			focusedElement: self,
			relatedTarget: self,
			width: 400,
			template: '<div data-procurement-price-comparison-item-replacement-directive data-grid-data = gridData class="grid-container" style="width: 96%; height:130px;"></div>'
		};

		if (popOptions.scope && !popOptions.scope.$close) {
			popupService.showPopup(popOptions);
		}*/
	}

	private addReplacementItemIcon(content: string, dataContext: ICompositeItemEntity, quoteKey: string) {
		const replacementItems = this.getReplacementItems(dataContext, quoteKey);
		if (replacementItems && replacementItems.length) {
			const popBtn = '<button title="" data-quote="' + quoteKey + '" class="btn btn-default control-icons priceCompareReplaceItemPopupHtmlBtn ico-input-lookup rib-fl" ></button>';
			// use timeout for do ui modify in cell after grid render.
			window.setTimeout(() => {
				// TODO-DRIZZLE: To be checked.
				/*$('.priceCompareReplaceItemPopupHtmlBtn').unbind('click').bind('click',  () =>{
					const quote = $(this).attr('data-quote');
					this.onCreate(dataContext, quote, $(this));
				});*/
			});
			return popBtn + content;
		} else {
			return content;
		}
	}

	public formatShowInSummaryRows(dataContext: ICompositeItemEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, quoteKey?: string, isVerticalCompareRows?: boolean): string {
		const quoteItem = dataContext.QuoteItems.find(e => e.QuoteKey === quoteKey);
		return this.dataSvc.compareCache.summaryRows.map((row) => {
			if (!quoteItem) {
				return Constants.tagForNoQuote;
			}
			if ([CompareFields.percentage, CompareFields.rank].includes(row.Field)) {
				return this.formatPercentageAndRank(row, dataContext, columnDef, quoteKey, isVerticalCompareRows);
			} else {
				let formattedValue: string = '';

				if (dataContext.LineTypeFk === CompareRowTypes.requisition && dataContext.totals) {
					formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, row.Field, dataContext.totals[quoteKey as string]);
					if (this.bidderSvc.isNotReference(columnDef.field) && dataContext.totals && dataContext.totals[quoteKey as string] !== Constants.tagForNoQuote) {
						const statisticValue = this.utilService.statisticValue(dataContext.totalValuesExcludeTarget as number[]);
						return this.utilService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, dataContext.totals[quoteKey as string] as number, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, isVerticalCompareRows);
					}
					return formattedValue;
				} else if (dataContext.LineTypeFk === CompareRowTypes.prcItem) {
					formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, row.Field, quoteItem[row.Field]);
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						const fieldValuesExcludeTarget: number[] = [];
						dataContext.QuoteItems.forEach((item) => {
							if (this.bidderSvc.isNotReference(item.QuoteKey)) {
								fieldValuesExcludeTarget.push(item[row.Field] as number);
							}
						});
						const statisticValue = this.utilService.statisticValue(fieldValuesExcludeTarget);
						return this.utilService.setStyleForCellValueUsingTagSpan(row.ConditionalFormat, quoteItem[row.Field] as number, formattedValue, columnDef, dataContext, statisticValue.minValue, statisticValue.maxValue, statisticValue.avgValue, isVerticalCompareRows);
					}
					return formattedValue;
				} else {
					return formattedValue;
				}
			}
		}).join(Constants.tagForValueSeparator);
	}

	public getAllColumns(): CompareGridColumn<ICompositeItemEntity>[] {
		return [
			...this.getBasicsColumns(),
			...super.getStatisticsColumns(),
			...this.getPriceColumns(),
			super.getBidderColumn(),
			super.getLineValueColumn()
		];
	}

	public getDefaultColumns(): CompareGridColumn<ICompositeItemEntity>[] {
		return [
			...this.getBasicsColumns(),
			...super.getStatisticsColumns(
				this.colFormatter.minValueIncludeTarget(),
				this.colFormatter.maxValueIncludeTarget(),
				this.colFormatter.averageValueIncludeTarget(),
				this.colFormatter.minValueExcludeTarget(),
				this.colFormatter.maxValueExcludeTarget(),
				this.colFormatter.averageValueExcludeTarget()),
			super.getLineValueColumn()
		];
	}

	public override getCreateContractOptions() {
		return {
			quoteGroupName: 'procurement.pricecomparison.wizard.create.contract.onlyItem',
			buttonName: 'procurement.pricecomparison.wizard.createContractForItem'
		};
	}

	public override customFormatQuoteColumnValue(row: number, cell: number, originalValue: unknown, formattedValue: unknown, columnDef: CompareGridColumn<ICompositeItemEntity>, dataContext: ICompositeItemEntity, quoteKey?: string, summaryTotalRow?: ICompareRowEntity, hasQuoteModulePermission?: boolean): string | null | undefined {
		switch (dataContext.LineTypeFk) {
			case CompareRowTypes.requisition: {
				if (columnDef.isVerticalCompareRows) {
					formattedValue = '';
				} else {
					let button = '';
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						if (this.permissionService.hasCreate('e5b91a61dbdd4276b3d92ddc84470162')) {
							button = this.generateCreateContractButtonTemplate(dataContext, columnDef) + ' ';
						}
						const disabled = this.isQuoteStatusReadonly(columnDef, dataContext) || columnDef.isIdealBidder;
						button += this.generateCreateQuoteAddItemWizardButtonTemplate(columnDef, dataContext, disabled) + ' ';
					}
					formattedValue = button + this.formatShowInSummaryRows(dataContext, columnDef, quoteKey, columnDef.isVerticalCompareRows);
				}
				break;
			}
			case CompareRowTypes.quoteNewItem:
				if (dataContext.QuoteKey === quoteKey) {
					originalValue = dataContext ? dataContext[CompareFields.total] : 0;
					formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, CompareFields.total, originalValue);
					return this.addReplacementItemIcon(formattedValue as string, dataContext, columnDef.id);
				} else {
					return Constants.tagForNoQuote;
				}
			case CompareRowTypes.quoteNewItemTotal: {
				const totals = dataContext.Children.filter(item => item['QuoteKey'] === quoteKey).map(item => item[CompareFields.total] as number);
				const sumValue = totals.reduce((result, curr) => {
					return result + curr;
				}, 0);
				formattedValue = this.dataSvc.rowReader.formatValue(dataContext, columnDef, CompareFields.total, sumValue);
				break;
			}
			case CompareRowTypes.prcItem: {
				if (columnDef.isVerticalCompareRows) {
					formattedValue = this.dataSvc.readMgr.readCellFormattedValue(row, cell, dataContext, columnDef);
				} else {
					let button = '';
					if (this.bidderSvc.isNotReference(columnDef.field)) {
						const disabled = this.isQuoteStatusReadonly(columnDef, dataContext) || columnDef.isIdealBidder || !dataContext.QuoteItems.some(s => s.QuoteKey === columnDef.field);
						button = this.createInsertItemButton(columnDef, dataContext, disabled, () => {
							const selectedItem = dataContext.QuoteItems.find(e => e.QuoteKey === columnDef.field);
							const children = dataContext.parentItem?.Children.filter((c) => c.LineTypeFk === CompareRowTypes.prcItem);
							const prcItems = children?.reduce<ICustomPrcItem[]>((result, curr) => {
								const quoteItem = curr.QuoteItems.find(e => e.QuoteKey === columnDef.field);
								if (quoteItem) {
									quoteItem.Id = quoteItem.PrcItemId;
									result.push(quoteItem);
								}
								return result;
							}, []) ?? [];

							return {
								SelectedItem: selectedItem ? Object.assign({}, selectedItem, {Id: selectedItem.PrcItemId}) : null,
								PrcItems: prcItems.sort((a, b) => {
									return a.ItemNo > b.ItemNo ? 1 : (a.ItemNo < b.ItemNo ? -1 : 0);
								}),
								InsertBefore: false
							};
						}, 'procurement.pricecomparison.wizard.insertNote');
					}
					const rawValue = this.formatShowInSummaryRows(dataContext, columnDef, quoteKey, columnDef.isVerticalCompareRows);
					formattedValue = button + this.addReplacementItemIcon(rawValue, dataContext, columnDef.id);
				}
				break;
			}
		}

		return this.toString(formattedValue);
	}

	public customQuoteColumnRowCellEditor(dataContext: ICompositeItemEntity, quoteColumn: ICustomCompareColumnEntity, columnDef: CompareGridColumn<ICompositeItemEntity>, columnDomainFn: unknown): Observable<ConcreteFieldOverload<ICompositeItemEntity>> {
		return from<ConcreteFieldOverload<ICompositeItemEntity>[]>([{
			label: columnDef.label,
			type: FieldType.Description
		}]);
		// TODO-DRIZZLE: updateQuoteColumnRowCellEditor
	}
}