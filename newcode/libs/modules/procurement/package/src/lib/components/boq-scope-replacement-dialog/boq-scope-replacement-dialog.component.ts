/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, inject, Inject} from '@angular/core';
import {
	BOQ_SCOPE_REPLACEMENT_DATA_TOKEN,
	IBoqScopeReplacementData,
	IGetReplacementBoqsResponse
} from '../../model/entities/boq-scope-replacement-info.interface';
import {PlatformHttpService, PlatformTranslateService} from '@libs/platform/common';
import {ProcurementPackageItemAssignmentDataService} from '../../services/item-assignment-data.service';
import {ProcurementPackageHeaderDataService} from '../../services/package-header-data.service';
import {ProcurementPackageTotalDataService} from '../../services/package-total-data.service';
import {
	ColumnDef,
	FieldType,
	FieldValidationInfo,
	IGridConfiguration,
	IMenuItemsList,
	ItemType,
	StandardDialogButtonId,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {IPackageBoqItemEntity} from '../../model/entities/package-boq-item-entity.interface';
import {isEqual, sumBy} from 'lodash';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';

@Component({
	selector: 'procurement-package-boq-scope-replacement-dialog',
	templateUrl: './boq-scope-replacement-dialog.component.html',
	styleUrls: ['./boq-scope-replacement-dialog.component.scss'],
})
export class ProcurementPackageBoqScopeReplacementDialogComponent implements AfterViewInit{
	private readonly translateService = inject(PlatformTranslateService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly packageService = inject(ProcurementPackageHeaderDataService);
	private readonly itemAssignmentService = inject(ProcurementPackageItemAssignmentDataService);
	private readonly totalService = inject(ProcurementPackageTotalDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	protected isDisableTargetBoqAfterReplacement = true;
	protected isRunning = true;
	protected targetTreeConfiguration!: IGridConfiguration<IPackageBoqItemEntity>;
	protected sourceSelectionConfiguration!: IGridConfiguration<IPackageBoqItemEntity>;
	private sourceSelectionGridId = '2d38fb5d51564004b9c20f65d8a65b8d'; // boq items to replace
	private targetTreeGridId = '8392589AE22E46749BE92369001BC256'; // tree structure of boq selected in container
	private readonly targetTreeColumns: ColumnDef<IPackageBoqItemEntity>[];
	private readonly sourceSelectionColumns: ColumnDef<IPackageBoqItemEntity>[];

	// data for boq replacement
	private originalSelectedIds: number[] = [];
	private replacementBoqItems: IPackageBoqItemEntity[] = [];
	private boqLineTypes = [0, 203]; // boq position(0) and surcharge(203) can be checked --.200, 201, 202,
	
	public constructor(@Inject(BOQ_SCOPE_REPLACEMENT_DATA_TOKEN) protected data: IBoqScopeReplacementData) {
		// todo chi: the columns should use the common boq columns.
		this.targetTreeColumns = [
			{
				id: 'reference',
				model: 'Reference',
				label: 'Reference',
				type: FieldType.Description,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'brief',
				model: 'BriefInfo.Translated',
				label: 'Outline Specification',
				type: FieldType.Description,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'quantity',
				model: 'Quantity',
				label: 'Quantity',
				type: FieldType.Quantity,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'price',
				model: 'Price',
				label: 'Price',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'finalprice',
				model: 'Finalprice',
				label: 'Final Price',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'budgettotal',
				model: 'BudgetTotal',
				label: 'Budget Total',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true
			}
		];

		// todo chi: the columns should use the common boq columns.
		this.sourceSelectionColumns = [
			{ // additional column
				id: 'selection',
				model: 'isSelect',
				label: 'basics.company.importContent.columnSelection',
				type: FieldType.Boolean,
				sortable: false,
				visible: true,
				width: 100,
				validator: this.validateisSelect
			},
			{
				id: 'reference',
				model: 'Reference',
				label: 'Reference',
				type: FieldType.Description,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'brief',
				model: 'BriefInfo.Translated',
				label: 'Outline Specification',
				type: FieldType.Description,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'quantity',
				model: 'Quantity',
				label: 'Quantity',
				type: FieldType.Quantity,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'price',
				model: 'Price',
				label: 'Price',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'finalprice',
				model: 'Finalprice',
				label: 'Final Price',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true
			},
			{
				id: 'budgettotal',
				model: 'BudgetTotal',
				label: 'Budget Total',
				type: FieldType.Money,
				readonly: true,
				visible: true,
				sortable: true,
				validator: this.validateBudgetTotal
			},
			{ // additional column
				id: 'budgetPercent',
				model: 'BudgetPercent',
				label: 'procurement.package.boqScopeReplacement.budgetPercent',
				type: FieldType.Percent,
				width: 80,
				visible: true,
				sortable: true,
				validator: this.validateBudgetPercent
			}
		];

		this.updateTargetTreeGrid();
		this.updateSelectionGrid();
	}

	public ngAfterViewInit() {
		setTimeout(async () => {
			await this.loadBoqReplacements();
			this.updateSelectionGrid();
		});
	}

	public async update() {
		const canUpdate = this.canUpdate();
		if (!canUpdate) {
			this.messageBoxService.showMsgBox({
				headerText: this.translateService.instant('procurement.package.boqScopeReplacement.title').text,
				bodyText: 'procurement.package.boqScopeReplacement.noChange',
				iconClass: 'ico-warning',
				buttons: [{id: StandardDialogButtonId.Ok}]
			});
			return Promise.resolve(false);
		}
		const selectedData = this.getSelectedData();
		const unselectedData = this.getUnselectedData();

		const selectedDataInfoList = selectedData.map((item) => {
			return {
				Id: item.Id,
				BudgetTotal: item.BudgetTotal,
				BudgetPerUnit: item.BudgetPerUnit
			};
		});
		const unselectedDataIds = unselectedData.map((item) => {
			return item.Id;
		});
		const request = {
			PackageId: this.data.packageItem.Id,
			TargetBoqHeaderId: this.data.targetBoqItem.BoqHeaderFk,
			TargetBoqItemId: this.data.targetBoqItem.Id,
			IsDisableTargetBoqAfterReplacement: this.isDisableTargetBoqAfterReplacement,
			ReplacementBoqInfoList: selectedDataInfoList,
			DropReplacementBoqIds: unselectedDataIds
		};
		this.isRunning = true;
		return this.httpService.post('procurement/package/wizard/updateitemassignmentforboqreplacement', request)
			.then(() => {
				this.messageBoxService.showMsgBox({
					headerText: this.translateService.instant('procurement.package.boqScopeReplacement.title').text,
					bodyText: 'procurement.package.boqScopeReplacement.updateSuccessfully',
					iconClass: 'ico-info',
					buttons: [{id: StandardDialogButtonId.Ok}]
				});
				return true;
			})
			.finally(() => {
				this.isRunning = false;
				// todo chi: common service is not available
				// let boqItemService = prcBoqMainService.getService(procurementContextService.getMainService());
				// let commonBoqService = procurementCommonPrcBoqService.getService(procurementContextService.getMainService(), boqItemService);
				const selectedPackage = this.packageService.getSelectedEntity();
				if (selectedPackage) {
					this.itemAssignmentService.load({id: 0, pKey1: selectedPackage.Id});
					// commonBoqService.load();
					this.totalService.load({id: 0, pKey1: selectedPackage.Id});
				}
			});
	}

	private updateTargetTreeGrid() {
		this.targetTreeConfiguration = {
			uuid: this.targetTreeGridId,
			columns: this.targetTreeColumns,
			skipPermissionCheck: true,
			items: [this.data.targetBoqTree],
			treeConfiguration: {
				parent: entity => {
					if (entity.BoqItemFk) {
						return this.replacementBoqItems.find(item => item.Id === entity.BoqItemFk && item.BoqHeaderFk === entity.BoqHeaderFk) || null;
					}
					return null;
				},
				children: entity => entity.BoqItems ?? [],
				collapsed: false
			}
		};
	}

	private updateSelectionGrid() {
		this.sourceSelectionConfiguration = {
			uuid: this.sourceSelectionGridId,
			columns: this.sourceSelectionColumns,
			skipPermissionCheck: true,
			items: [...this.replacementBoqItems],
			treeConfiguration: {
				parent: entity => {
					if (entity.BoqItemFk) {
						return this.replacementBoqItems.find(item => item.Id === entity.BoqItemFk && item.BoqHeaderFk === entity.BoqHeaderFk) || null;
					}
					return null;
				},
				children: entity => entity.BoqItems ?? [],
				collapsed: false
			}
		};
	}

	public get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: 't4',
					caption: 'procurement.package.wizard.scopeReplacement.budgetSplit',
					type: ItemType.Check,
					iconClass: 'control-icons ico-recalculate',
					fn: () => {
						this.recalculateReplacementItem();
					},
					disabled: () => {
						return this.data.targetBoqItem.BudgetTotal === 0;
					}
				}
			]
		};
	}

	private toList(items: IPackageBoqItemEntity[], children: IPackageBoqItemEntity[],
				   filter?: (item: IPackageBoqItemEntity) => boolean): void {

		items.forEach((item) => {
			if (filter ? filter(item) : true) {
				children.push(item);
			}
			const list = item.BoqItems || []; // todo chi: original is item.ChildItems
			this.toList(list, children, filter);
		});
	}

	private validateisSelect(info: FieldValidationInfo<IPackageBoqItemEntity>) {
		const entity = info.entity;
		const value = info.value ? info.value as boolean : false;
		const result = this.validationService.createSuccessObject();
		// todo chi: do it later
		// platformRuntimeDataService.readonly(entity, [
		// 	{field: 'BudgetPercent', readonly: !value || !$scope.data.targetBoqItem.BudgetTotal},
		// 	{field: 'BudgetTotal', readonly: !value}
		// ]);
		if (!value) {
			entity.BudgetPercent = 0;
		}
		if (this.data.targetBoqItem.BudgetTotal !== 0) {
			const selectedData = this.getSelectedData();
			let sumBudgetTotal = sumBy(selectedData, 'BudgetTotal');

			if (value) {
				sumBudgetTotal += entity.BudgetTotal;
			} else {
				sumBudgetTotal -= entity.BudgetTotal;
			}

			if (sumBudgetTotal > this.data.targetBoqItem.BudgetTotal) {
				const budgetValidResult = this.validationService.createSuccessObject();
				budgetValidResult.apply = true;
				budgetValidResult.valid = false;
				budgetValidResult.error = this.translateService.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError').text;
				// todo chi: do it later
				// platformRuntimeDataService.applyValidationResult(budgetValidResult, entity, 'BudgetTotal');
				selectedData.forEach((item) => {
					// todo chi: do it later
					// platformRuntimeDataService.applyValidationResult(budgetValidResult, item, 'BudgetTotal');
				});
			} else {
				if (value) {
					entity.BudgetPercent = (entity.BudgetTotal / this.data.targetBoqItem.BudgetTotal) * 100;
				}
				selectedData.forEach((item) => {
					// todo chi: do it later
					// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
					// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
				});
			}
		} else {
			entity.BudgetPercent = null;
		}

		if (!value) {
			// todo chi: do it later
			// platformRuntimeDataService.applyValidationResult(result, entity, 'BudgetTotal');
			// platformRuntimeDataService.applyValidationResult(result, entity, 'BudgetPercent');
		}
		return result;
	}

	private validateBudgetPercent(info: FieldValidationInfo<IPackageBoqItemEntity>) {
		const entity = info.entity;
		const value = info.value ? info.value as number : 0;
		const result = this.validationService.createSuccessObject();
		if (this.data.targetBoqItem.BudgetTotal !== 0) {
			const selectedData = this.getSelectedData();
			let sumBudgetPercent = 0;
			selectedData.forEach((item) => {
				if (item.Id !== entity.Id) {
					sumBudgetPercent += item.BudgetPercent || 0;
				}
			});
			sumBudgetPercent += value;
			entity.BudgetTotal = (value * this.data.targetBoqItem.BudgetTotal) / 100;
			entity.BudgetPerUnit = entity.Quantity > 0 ? entity.BudgetTotal / entity.Quantity : entity.BudgetPerUnit;
			if (sumBudgetPercent > 100) {
				result.valid = false;
				result.error = this.translateService.instant('procurement.package.wizard.scopeReplacement.budgetTotalIsZero').text;
				return result;
			} else {
				selectedData.forEach((item) => {
					// todo chi: do it later
					// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
					if (item.Id !== entity.Id) {
						// todo chi: do it later
						// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
					}
				});
			}
		}

		return result;
	}

	private validateBudgetTotal(info: FieldValidationInfo<IPackageBoqItemEntity>) {
		const entity = info.entity;
		const value = info.value ? info.value as number : 0;
		const result = this.validationService.createSuccessObject();
		entity.BudgetPerUnit  = entity.Quantity > 0 ? value / entity.Quantity : entity.BudgetPerUnit;
		if (this.data.targetBoqItem.BudgetTotal !== 0) {
			const selectedData = this.getSelectedData();
			let sumBudgetTotal = 0;
			selectedData.forEach((item) => {
				if (item.Id !== entity.Id) {
					sumBudgetTotal += item.BudgetTotal;
				}
			});
			sumBudgetTotal += value;
			entity.BudgetPercent = (value / this.data.targetBoqItem.BudgetTotal) * 100;
			if (sumBudgetTotal > this.data.targetBoqItem.BudgetTotal) {
				result.valid = false;
				result.error = this.translateService.instant('procurement.package.wizard.scopeReplacement.sumBudgetTotalError').text;
				return result;
			} else {
				selectedData.forEach((item) => {
					// todo chi: do it later
					// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetPercent');
					if (item.Id !== entity.Id) {
						// todo chi: do it later
						// platformRuntimeDataService.applyValidationResult(result, item, 'BudgetTotal');
					}
				});
			}
		}

		return result;
	}

	// ------------ funcitons for boq replacements ----------------
	private async loadBoqReplacements() {
		this.isRunning = true;
		const response = await this.httpService.get<IGetReplacementBoqsResponse>('procurement/package/wizard/getreplacementboqs', {
			params: {
				packageId: this.data.packageItem.Id,
				targetBoqHeaderId: this.data.targetBoqItem.BoqHeaderFk,
				targetBoqItemId: this.data.targetBoqItem.Id
			}
		});

		const flatten: IPackageBoqItemEntity[] = [];
		const boqList = response.boqItems || [];
		this.originalSelectedIds = response.replacementBoqItemIds || [];
		this.toList(boqList, flatten);
		this.replacementBoqItems = boqList;

		flatten.forEach((item) => {
			if (this.originalSelectedIds.indexOf(item.Id) > -1) {
				item.isSelect = true;
				if (this.data.targetBoqItem.BudgetTotal !== 0) {
					item.BudgetPercent = (item.BudgetTotal / this.data.targetBoqItem.BudgetTotal) * 100;
				} else {
					item.BudgetPercent = 0;
					// todo chi: do it later
					// platformRuntimeDataService.readonly(item, [{field: 'BudgetPercent', readonly: true}]);
				}
			} else {
				item.isSelect = false;
				item.BudgetPercent = 0;
				// todo chi: do it later
				// platformRuntimeDataService.readonly(item, [{field: 'BudgetPercent', readonly: true}, {field: 'BudgetTotal', readonly: true}]);
			}
			if (item && this.boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
				// todo chi: do it later
				// platformRuntimeDataService.readonly(item, [{field: 'isSelect', readonly: true}]);
			}
		});

		this.isRunning = false;
	}

	private getSelectedData() {
		return this.replacementBoqItems.filter((item) => {
			return item.isSelect;
		});
	}

	private getUnselectedData() {
		return this.replacementBoqItems.filter((item) => {
			return this.boqLineTypes.indexOf(item.BoqLineTypeFk) > -1 && !item.isSelect;
		});
	}

	public canUpdate() {
		const selectedIds: number[] = [];
		const hasError = false;
		this.replacementBoqItems.forEach((item) => {
			if (item.isSelect) {
				selectedIds.push(item.Id);
			}
			// todo chi: do it later
			// hasError |= platformRuntimeDataService.hasError(item, 'BudgetPercent');
			// hasError |= platformRuntimeDataService.hasError(item, 'BudgetTotal');
		});

		const hasDifference = !isEqual(selectedIds, this.originalSelectedIds);
		return hasDifference && !hasError;
	}

	private recalculateReplacementItem() {
		const targetBudgetTotal = this.data.targetBoqItem.BudgetTotal;
		if (targetBudgetTotal !== 0) {
			const selectedData = this.getSelectedData();
			const total = sumBy(selectedData, 'Finalprice');
			const selectedLength = selectedData.length;
			selectedData.forEach((item) => {
				if (total !== 0) {
					item.weight = item.Finalprice / total;
				} else {
					item.weight = 1 / selectedLength;
				}
			});
			const lastItem = selectedData[selectedLength - 1];
			let notLastItemBudgetTotal = 0;
			let notLastSumPercent = 0;
			selectedData.forEach((item) => {
				if (lastItem.Id !== item.Id) {
					item.BudgetTotal = parseFloat((item.weight * targetBudgetTotal).toFixed(2));
					item.BudgetPercent = item.weight * 100;
					item.BudgetPerUnit  = item.Quantity > 0 ? item.BudgetTotal / item.Quantity : item.BudgetPerUnit;
					notLastItemBudgetTotal += item.BudgetTotal;
					notLastSumPercent += item.BudgetPercent;
				} else {
					item.BudgetTotal = targetBudgetTotal - notLastItemBudgetTotal;
					item.BudgetPercent = 100 - notLastSumPercent;
					item.BudgetPerUnit  = item.Quantity > 0 ? item.BudgetTotal / item.Quantity : item.BudgetPerUnit;
				}
			});
			selectedData.forEach((item) => {
				// todo chi: do it later
				// platformRuntimeDataService.applyValidationResult(true, item, 'BudgetPercent');
				// platformRuntimeDataService.applyValidationResult(true, item, 'BudgetTotal');
			});
		}
	}
}
