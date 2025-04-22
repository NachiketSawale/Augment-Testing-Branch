/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';

import { of } from 'rxjs';
import { ColumnDef, ConcreteMenuItem, FieldType, ItemType } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

import { ProcurementStockTotalDataService } from '../../services/procurement-stock-total-data.service';

import { IStockTotalReconciliationVEntity } from '../../model/entities/stock-total-reconciliation-ventity.interface';
import { IStockTotalVEntity } from '../../model';
import { EntityContainerCommand } from '@libs/ui/business-base';
import { BasicsSharedReadOnlyGridComponent } from '@libs/basics/shared';

/**
 * Procurement Stock Total Reconciliation Component Class
 */
@Component({
	selector: 'procurement-stock-total-reconciliation',
	templateUrl: './total-reconciliation.component.html',
	styleUrls: ['./total-reconciliation.component.scss'],
})
export class ProcurementStockTotalReconciliationComponent extends BasicsSharedReadOnlyGridComponent<IStockTotalReconciliationVEntity, IStockTotalVEntity> {
	/**
	 * Inject PlatformTranslateService
	 */
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Inject ProcurementStockTotalDataService
	 */
	public stockTotalService = inject(ProcurementStockTotalDataService);

	/**
	 * Property gridId to hold grid id
	 */
	public gridId: string = '0780abf4d0174c8cb9827ebd6907ac83';

	/**
	 * Array of stockColumns
	 */
	public stockColumns: ColumnDef<IStockTotalReconciliationVEntity>[] = [
		{
			id: 'ReconName',
			model: 'Type',
			label: { text: 'Type' },
			type: FieldType.Money,
			//TODO:Required support formatter function
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'TotalValue',
			model: 'Receipt',
			label: { text: 'Receipt' },
			type: FieldType.Money,
			formatterOptions: {
				decimalPlaces: 2,
			},
			//TODO:Required support formatter function
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'TotalProvision',
			model: 'Consumed',
			label: { text: 'Consumed' },
			type: FieldType.Money,
			//TODO:Required support formatter function
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'Expenses',
			model: 'Difference',
			label: { text: 'Difference' },
			type: FieldType.Money,
			//TODO:Required support formatter function
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
	];
	/**
	 * To add toolbar items
	 */
	public menuItem: ConcreteMenuItem[] = [
		{
			type: ItemType.Check,
			caption: { key: 'cloud.common.taskBarGrouping' },
			iconClass: 'tlb-icons ico-group-columns',
			id: 'group',
			fn: () => {
				// todo toolbar button is not working well now
			},
			disabled: false,
		},
		{
			type: ItemType.Item,
			caption: { key: 'cloud.common.taskBarSearch', text: 'Search' },
			iconClass: 'tlb-icons ico-search-all',
			id: 'create',
		},
		{
			type: ItemType.Item,
			caption: { key: 'cloud.common.taskBarColumnFilter', text: 'Column Filter' },
			iconClass: 'tlb-icons ico-search-column',
			id: 'delete',
			disabled: () => {
				return false;
			},
		},
		{
			caption: { key: 'cloud.common.exportClipboard' },
			groupId: 'dropdown-btn-t199',
			iconClass: 'tlb-icons ico-clipboard',
			id: EntityContainerCommand.Clipboard,
			type: ItemType.DropdownBtn,
			list: {
				cssClass: 'dropdown-menu-right',
				showImages: false,
				showTitles: true,
				items: [
					{
						caption: { key: 'cloud.common.exportArea' },
						id: EntityContainerCommand.CopyCellArea,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						caption: { key: 'cloud.common.exportCopy' },
						id: EntityContainerCommand.Copy,
						type: ItemType.Item,
						fn: () => {
							throw new Error('This method is not implemented');
						},
					},
					{
						id: EntityContainerCommand.ExportOptions,
						type: ItemType.Sublist,
						list: {
							items: [
								{
									caption: { key: 'cloud.common.exportWithHeader' },
									id: EntityContainerCommand.CopyWithHeader,
									type: ItemType.Item,
									fn: () => {
										throw new Error('This method is not implemented');
									},
								},
							],
						},
					},
				],
			},
		},
		{
			id: 't200',
			caption: 'gridSettings',
			type: ItemType.DropdownBtn,
			cssClass: 'tlb-icons ico-settings',
			list: {
				showImages: false,
				showTitles: true,
				cssClass: 'dropdown-menu-right',
				items: [
					{
						id: 't111',
						caption: { key: 'cloud.common.gridlayout' },
						permission: '91c3b3b31b5d4ead9c4f7236cb4f2bc0',
						type: ItemType.Item,
					},
					{
						id: 't155',
						caption: { key: 'cloud.common.showStatusbar' },
						type: ItemType.Check,
						value: true,
					},
					{
						id: 't255',
						caption: { key: 'cloud.common.markReadonlyCells' },
						type: ItemType.Check,
						value: true,
					},
				],
			},
			iconClass: 'tlb-icons ico-settings',
			hideItem: false,
		},
	];

	/**
	 * The Constructor
	 */
	public constructor() {
		super();
		this.uiAddOns.toolbar.addItems(this.menuItem);
	}

	/**
	 * To get stock total reconciliation data
	 */
	public getStockTotalReconciliationData = (selected: IStockTotalVEntity) => {
		const list: IStockTotalReconciliationVEntity[] = this.getList(selected);
		return of(list);
	};

	/**
	 * This method generates a list of stock total reconciliation entries
	 * @param {IStockTotalVEntity} selected
	 * @returns {IStockTotalReconciliationVEntity[]}
	 */
	public getList(selected?: IStockTotalVEntity): IStockTotalReconciliationVEntity[] {
		const list: IStockTotalReconciliationVEntity[] = [];
		let index = 0;

		list.push({
			Id: index++,
			Type: this.translateService.instant('procurement.stock.header.totalquantity'),
			Receipt: selected!.QuantityReceipt,
			Consumed: selected!.QuantityConsumed,
			Difference: selected!.TotalQuantity,
		});

		list.push({
			Id: index++,
			Type: this.translateService.instant('procurement.stock.header.totalvalue'),
			Receipt: selected!.TotalReceipt,
			Consumed: selected!.TotalConsumed,
			Difference: selected!.TotalValue,
		});
		list.push({
			Id: index++,
			Type: this.translateService.instant('procurement.stock.header.totalprovision'),
			Receipt: selected!.ProvisionReceipt,
			Consumed: selected!.ProvisionConsumed,
			Difference: selected!.TotalProvision,
		});
		list.push({
			Id: index++,
			Type: this.translateService.instant('procurement.stock.header.expenses'),
			Receipt: selected!.ExpenseTotal,
			Consumed: selected!.ProvisionReceipt,
			Difference: selected!.Expenses,
		});
		return list;
	}
}
