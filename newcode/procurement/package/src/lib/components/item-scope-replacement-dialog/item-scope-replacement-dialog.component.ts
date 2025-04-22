import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CellChangeEvent, ColumnDef, createLookup, FieldType, FieldValidationInfo, IGridConfiguration, IMenuItemsList, ItemType } from '@libs/ui/common';
import { IPackageItemEntity } from '../../model/entities/package-item-entity.interface';
import { ProcurementPackageItemDataService } from '../../services/procurement-package-item-data.service';
import { PROCUREMENT_PACKAGE_ITEM_ENTITY_INFO } from '../../model/entity-info/procurement-package-item-entity-info.model';
import { BasicsSharedDataValidationService, BasicsSharedMaterialLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { clone, find, forEach, map, sumBy } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { bignumber, round } from 'mathjs';

interface ReplacementItem {
	IsChecked: boolean;
	prcItem: IPackageItemEntity;
}

interface ISelectedGridColumn {
	Itemno: number;
	MdcMaterialFk?: number;
	Description1?: string;
	Quantity: number;
	BasUomFk: number;
	Price: number;
	TotalPrice: number;
	Total: number;
	BudgetTotal: number;
	Id: number;
}

@Component({
	selector: 'procurement-package-item-scope-replacement-dialog',
	templateUrl: './item-scope-replacement-dialog.component.html',
	styleUrls: ['item-scope-replacement-dialog.component.scss'],
})
export class ItemScopeReplacementDialogComponent implements OnInit, AfterViewInit {
	private readonly prcPackagePrcItemDataService = inject(ProcurementPackageItemDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	public cantEditDisableTargetItem: boolean = false;
	public disableTargetItem: boolean = true;
	public seletedGridConfig!: IGridConfiguration<ISelectedGridColumn>;
	public gridConfig!: IGridConfiguration<IPackageItemEntity>;
	private selectedGridList: ISelectedGridColumn[] = [];
	private gridList: IPackageItemEntity[] = [];
	private disableOk: boolean = true;
	private tempData: { id: number; isChecked: boolean; BudgetTotal: number }[] = [];
	public tools!: IMenuItemsList;

	private itemSelected: IPackageItemEntity;

	public constructor() {
		this.itemSelected = this.prcPackagePrcItemDataService.getSelectedEntity() as IPackageItemEntity;
	}

	public ngOnInit() {
		this.updateSeletedGridConfig();
		this.updateGrid();
	}

	private cols: ColumnDef<IPackageItemEntity>[] = [];
	public ngAfterViewInit() {
		setTimeout(async () => {
			this.cols = await PROCUREMENT_PACKAGE_ITEM_ENTITY_INFO.generateLookupColumns(ServiceLocator.injector);
			await this.loadItems();
			this.updateGridConfig(this.cols);
			this.updateGrid();
		});
	}

	private updateSeletedGridConfig() {
		this.seletedGridConfig = {
			uuid: 'c10dde19ed424a19af345abcd5785611',
			columns: [
				{
					type: FieldType.Code,
					id: 'Itemno',
					required: true,
					model: 'Itemno',
					label: {
						text: 'Item No.',
						key: 'procurement.common.prcItemItemNo',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true,
					}),
					id: 'MdcMaterialFk',
					model: 'MdcMaterialFk',
					label: {
						text: 'Material No.',
						key: 'procurement.common.prcItemMaterialNo',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Description1',
					type: FieldType.Description,
					model: 'Description1',
					label: {
						text: 'Description 1',
						key: 'procurement.common.prcItemDescription1',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'Quantity',
					model: 'Quantity',
					label: {
						text: 'Quantity',
						key: 'cloud.common.entityQuantity',
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
					required: true,
					readonly: true,
				},
				{
					id: 'BasUomFk',
					model: 'BasUomFk',
					label: {
						key: 'procurement.common.accassign.BasUom',
						text: 'Uom',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showClearButton: false,
						displayMember: 'Unit',
					}),
					visible: true,
					sortable: true,
					width: 100,
					required: true,
					readonly: true,
				},
				{
					id: 'Price',
					model: 'Price',
					label: {
						key: 'cloud.common.entityPrice',
						text: 'Price',
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
					required: true,
					readonly: true,
				},
				{
					id: 'TotalPrice',
					model: 'TotalPrice',
					label: {
						key: 'procurement.common.prcItemTotalPrice',
						text: 'Total Price',
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
					required: true,
					readonly: true,
				},
				{
					id: 'Total',
					model: 'Total',
					label: {
						key: 'cloud.common.entityTotal',
						text: 'Total',
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
					required: true,
					readonly: true,
				},
				{
					id: 'BudgetTotal',
					model: 'BudgetTotal',
					label: {
						key: 'procurement.common.entityBudgetTotal',
						text: 'Budget Total',
					},
					type: FieldType.Decimal,
					visible: true,
					sortable: true,
					required: true,
					readonly: true,
				},
			],
			items: this.selectedGridList,
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
		};
	}

	private updateGridConfig(cols: ColumnDef<IPackageItemEntity>[]) {
		forEach(cols, (item) => {
			if (!(item.id === 'budgettotal' || item.id === 'total')) {
				item.readonly = true;
			} else if (item.id === 'total') {
				item.readonly = false;
			} else if (item.id === 'budgettotal') {
				item.validator = this.validateBudgetTotal;
			}
		});
		const colDef: ColumnDef<IPackageItemEntity> = {
			type: FieldType.Boolean,
			id: 'IsChecked',
			model: 'IsChecked',
			label: {
				text: 'IsChecked',
				key: 'procurement.requisition.variant.check',
			},
			visible: true,
			sortable: true,
			width: 50,
			validator: (info) => {
				const result = new ValidationResult();
				result.apply = true;
				result.valid = true;
				if (info.value) {
					const otherItemList = this.gridList.filter((item) => {
						return item.IsChecked && item.Id !== info.entity.Id;
					});
					const otherBudgetTotal = sumBy(otherItemList, 'BudgetTotal');
					const allBudgetTotal = otherBudgetTotal + info.entity.BudgetTotal;
					if (this.itemSelected.BudgetTotal !== 0) {
						if (allBudgetTotal > this.itemSelected.BudgetTotal) {
							result.apply = false;
							result.valid = false;
							result.error = this.translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError').text;
							// this.validationUtils.applyValidationResult(this.prcPackagePrcItemDataService, {
							// 	entity: info.entity,
							// 	field: 'BudgetTotal',
							// 	result: result,
							// });
						} else {
							info.entity.BudgetPercent = (info.entity.BudgetTotal / this.itemSelected.BudgetTotal) * 100;
						}
						// this.prcPackagePrcItemDataService.setEntityReadOnlyFields(info.entity, [
						// 	{ field: 'BudgetTotal', readOnly: false },
						// 	{ field: 'BudgetPercent', readOnly: false },
						// ]);
					} else {
						info.entity.BudgetPercent = 0;
						// this.prcPackagePrcItemDataService.setEntityReadOnlyFields(info.entity, [
						// 	{ field: 'Total', readOnly: false },
						// 	{ field: 'BudgetTotal', readOnly: false },
						// 	{ field: 'BudgetPercent', readOnly: true },
						// ]);
					}
				} else {
					info.entity.BudgetPercent = 0;
					// this.prcPackagePrcItemDataService.setEntityReadOnlyFields(info.entity, [
					// 	{ field: 'Total', readOnly: true },
					// 	{ field: 'BudgetTotal', readOnly: true },
					// 	{ field: 'BudgetPercent', readOnly: true },
					// ]);

					info.entity.IsChecked = false;
					this.checkAllBudgetTotal();
				}
				return result;
			},
		};
		cols.unshift(colDef);
		const budgetPercent: ColumnDef<IPackageItemEntity> = {
			type: FieldType.Percent,
			id: 'BudgetPercent',
			model: 'BudgetPercent',
			label: {
				text: 'BudgetPercent',
				key: 'procurement.package.wizard.scopeReplacement.BudgetPercent',
			},
			visible: true,
			sortable: true,
			width: 50,
			validator: (info) => {
				const result = new ValidationResult();
				result.apply = true;
				result.valid = true;
				if (info.entity.IsChecked) {
					const otherItemList = this.gridList.filter((item) => {
						return item.IsChecked && item.Id !== info.entity.Id;
					});
					const otherPercent = sumBy(otherItemList, 'BudgetPercent');
					const allPercent = otherPercent + (info.value as number);
					if (allPercent > 100 && info.value !== 0) {
						result.apply = false;
						result.valid = false;
						result.error = this.translate.instant('procurement.package.wizard.scopeReplacement.sumPercentError').text;
						// this.validationUtils.applyValidationResult(this.prcPackagePrcItemDataService, {
						// 	entity: info.entity,
						// 	field: 'BudgetPercent',
						// 	result: result,
						// });
						info.entity.BudgetTotal = ((info.value as number) * this.itemSelected.BudgetTotal) / 100;
						info.entity.BudgetPercent = info.value as number;
						if (info.entity.Quantity !== 0) {
							info.entity.BudgetPerUnit = round(bignumber(info.entity.BudgetTotal).div(info.entity.Quantity)).toNumber();
						}
					}
				} else {
					if (this.itemSelected.BudgetTotal !== 0) {
						info.entity.BudgetTotal = ((info.value as number) * this.itemSelected.BudgetTotal) / 100;
						if (info.entity.Quantity !== 0) {
							info.entity.BudgetPerUnit = round(bignumber(info.entity.BudgetTotal).div(info.entity.Quantity)).toNumber();
						}
					} else {
						result.apply = false;
						result.valid = false;
						result.error = this.translate.instant('procurement.package.wizard.scopeReplacement.budgetTotalIsZero').text;
						// this.validationUtils.applyValidationResult(this.prcPackagePrcItemDataService, {
						// 	entity: info.entity,
						// 	field: 'BudgetPercent',
						// 	result: result,
						// });
						info.entity.BudgetPercent = info.value as number;
						this.checkAllBudgetTotal();
					}
				}
				return result;
			},
		};
		cols.push(budgetPercent);
		this.tools = {
			cssClass: 'tools',
			showImages: true,
			showTitles: true,
			items: [
				{
					id: 't4',
					caption: 'procurement.package.wizard.scopeReplacement.budgetSplit',
					type: ItemType.Check,
					iconClass: 'control-icons ico-recalculate',
					fn: this.recalculatedReplacementItem,
				},
			],
		};

		this.cols = cols;
	}

	private updateGrid() {
		this.gridConfig = {
			uuid: 'c10dde19ed424a19af345abcd5785688',
			columns: this.cols,
			items: this.gridList,
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			idProperty: 'Id',
		};
	}

	private async loadItems() {
		const resp = await this.http.get<ReplacementItem[]>('procurement/package/wizard/canReplacementPrcitemList', {
			params: {
				packageId: this.itemSelected.PrcPackageFk != null ? this.itemSelected.PrcPackageFk : -1,
				prcHeaderId: this.itemSelected.PrcHeaderFk,
				prcItemId: this.itemSelected.Id,
			},
		});
		const itemData = resp;
		const showPrcItemList: IPackageItemEntity[] = [];
		let noCheckNum = 0;
		forEach(itemData, (item) => {
			if (item) {
				item.prcItem.IsChecked = item.IsChecked;
				showPrcItemList.push(item.prcItem);
			}
			if (!item.IsChecked) {
				noCheckNum += 1;
			}
			if (item.IsChecked && this.itemSelected.BudgetTotal !== 0) {
				const info = new FieldValidationInfo<IPackageItemEntity>(item.prcItem, item.prcItem.BudgetTotal);
				this.validateBudgetTotal(info);
			} else {
				item.prcItem.BudgetPercent = 0;
			}
			//	TODO:readonly
			// if (this.itemSelected.BudgetTotal !== 0) {
			// 	if (!item.IsChecked) {
			// 		this.prcPackagePrcItemDataService.setEntityReadOnlyFields(item.prcItem, [
			// 			{ field: 'BudgetTotal', readOnly: true },
			// 			{ field: 'BudgetPercent', readOnly: true },
			// 		]);
			// 	} else {
			// 		this.prcPackagePrcItemDataService.setEntityReadOnlyFields(item.prcItem, [
			// 			{ field: 'BudgetTotal', readOnly: false },
			// 			{ field: 'BudgetPercent', readOnly: false },
			// 		]);
			// 	}
			// } else {
			// 	if (!item.IsChecked) {
			// 		this.prcPackagePrcItemDataService.setEntityReadOnlyFields(item.prcItem, [
			// 			{ field: 'Total', readOnly: true },
			// 			{ field: 'BudgetTotal', readOnly: true },
			// 			{ field: 'BudgetPercent', readOnly: true },
			// 		]);
			// 	} else {
			// 		this.prcPackagePrcItemDataService.setEntityReadOnlyFields(item.prcItem, [
			// 			{ field: 'Total', readOnly: false },
			// 			{ field: 'BudgetTotal', readOnly: false },
			// 			{ field: 'BudgetPercent', readOnly: false },
			// 		]);
			// 	}
			// }
		});
		if (noCheckNum > 0 && noCheckNum === itemData.length) {
			this.cantEditDisableTargetItem = true;
		} else {
			this.cantEditDisableTargetItem = false;
		}
		const defaultChecked = find(showPrcItemList, function (param) {
			return param.IsChecked;
		});
		if (defaultChecked) {
			this.disableOk = false;
		}
		this.gridList = showPrcItemList;
		this.tempData = map(showPrcItemList, (prcItem) => {
			return { id: prcItem.Id, isChecked: prcItem.IsChecked, BudgetTotal: prcItem.BudgetTotal };
		});
	}

	private validateBudgetTotal(info: FieldValidationInfo<IPackageItemEntity>): ValidationResult {
		const result = new ValidationResult();
		if (info.entity.IsChecked) {
			if (this.itemSelected.BudgetTotal !== 0) {
				const otherItemList = this.gridList.filter((item) => {
					return item.IsChecked && item.Id !== info.entity.Id;
				});
				const otherBudgetTotal = sumBy(otherItemList, 'BudgetTotal');
				const allBudgetTotal = otherBudgetTotal + (info.value as number);
				if (allBudgetTotal > this.itemSelected.BudgetTotal && info.value !== 0) {
					result.apply = false;
					result.valid = false;
					result.error = this.translate.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError').text;

					info.entity.BudgetPercent = ((info.value as number) / this.itemSelected.BudgetTotal) * 100;
					info.entity.BudgetTotal = info.value as number;
					if (info.entity.Quantity !== 0) {
						info.entity.BudgetPerUnit = round(bignumber(info.value as number).div(info.entity.Quantity)).toNumber();
					}
				} else {
					info.entity.BudgetPercent = ((info.value as number) / this.itemSelected.BudgetTotal) * 100;
					info.entity.BudgetTotal = info.value as number;
					if (info.entity.Quantity !== 0) {
						info.entity.BudgetPerUnit = round(bignumber(info.value as number).div(info.entity.Quantity)).toNumber();
					}
					this.checkAllBudgetTotal();
				}
			}
		}
		return result;
	}

	private checkAllBudgetTotal() {
		if (this.itemSelected.BudgetTotal !== 0) {
			const selectItemList = this.gridList.filter((item) => {
				return item.IsChecked;
			});
			const allBudgetTotal = sumBy(selectItemList, 'BudgetTotal');
			if (allBudgetTotal <= this.itemSelected.BudgetTotal) {
				forEach(selectItemList, (item) => {
					item.BudgetPercent = (item.BudgetTotal / this.itemSelected.BudgetTotal) * 100;
				});
			}
		}
	}

	public onCellModified(event: CellChangeEvent<IPackageItemEntity>) {
		if (this.tempData.length > 0) {
			//event.column.label && event.column.label.toString() === 'IsChecked' &&
			const gridData = clone(this.gridList);
			const unCheckList = gridData.filter((item) => {
				return !item.IsChecked;
			});
			if (unCheckList.length > 0 && unCheckList.length === gridData.length) {
				this.cantEditDisableTargetItem = true;
			} else {
				this.cantEditDisableTargetItem = false;
			}
		}
		this.checkAllData();
	}

	public checkAllData() {
		//TODO
	}

	public recalculatedReplacementItem() {
		const selectTotal = this.itemSelected.BudgetTotal;
		const checkedItems = this.gridList.filter((item) => {
			return item.IsChecked;
		});
		const total = sumBy(checkedItems, 'Total');
		const checkLen = checkedItems.length;
		forEach(checkedItems, (item) => {
			if (total > 0) {
				item.Weight = item.Total / total;
			} else {
				item.Weight = 1 / checkLen;
			}
		});
		const lastItem = checkedItems[checkedItems.length - 1];
		let notLastItemBudgetTotal = 0;
		forEach(checkedItems, (item) => {
			if (selectTotal !== 0) {
				if (lastItem.Id !== item.Id) {
					item.BudgetTotal = parseFloat((item.Weight * selectTotal).toFixed(2));
					item.BudgetPercent = (item.BudgetTotal / selectTotal) * 100;
					notLastItemBudgetTotal += item.BudgetTotal;
				} else {
					item.BudgetTotal = selectTotal - notLastItemBudgetTotal;
					item.BudgetPercent = (item.BudgetTotal / selectTotal) * 10;
				}
			} else {
				item.BudgetTotal = 0;
				item.BudgetPercent = 0;
			}
			if (item.Quantity !== 0) {
				item.BudgetPercent = round(bignumber(item.BudgetTotal).div(item.Quantity)).toNumber();
			}
		});
		this.checkAllData();
	}

	public async ok() {
		const ItemReplacementList: { IsChecked: boolean; PrcItemId: number; BudgetTotal: number; Total: number }[] = [];
		forEach(this.gridList, (item) => {
			ItemReplacementList.push({
				IsChecked: item.IsChecked,
				PrcItemId: item.Id,
				BudgetTotal: item.BudgetTotal,
				Total: item.Total,
			});
		});
		const params = {
			PackageId: this.prcPackagePrcItemDataService.parentService.getSelectedEntity()?.Id,
			DisableTargetItem: this.disableTargetItem,
			BasePrcItemId: this.itemSelected.Id,
			ItemReplacementList: ItemReplacementList,
		};
		await this.http.post('procurement/package/wizard/createItemScopeReplacement', params);
	}
}
