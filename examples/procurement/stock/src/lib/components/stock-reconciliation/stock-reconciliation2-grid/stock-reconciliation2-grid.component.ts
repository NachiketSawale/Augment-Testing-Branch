/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, ConcreteMenuItem, FieldType, ItemType } from '@libs/ui/common';
import { ProcurementStockHeaderDataService } from '../../../services/procurement-stock-header-data.service';
import { IStockHeaderVEntity } from '../../../model';
import { IStockReconcilition2Entity } from '../../../model/entities/stock-reconcilition.interface';

import { EntityContainerCommand } from '@libs/ui/business-base';
import { of } from 'rxjs';
import { BasicsSharedReadOnlyGridComponent } from '@libs/basics/shared';

/**
 * Component represents Stock Reconciliation2 Grid Component
 */
@Component({
	selector: 'procurement-stock-stock-reconciliation2-grid',
	templateUrl: './stock-reconciliation2-grid.component.html',
	styleUrl: './stock-reconciliation2-grid.component.css',
})
export class StockReconciliation2GridComponent extends BasicsSharedReadOnlyGridComponent<IStockReconcilition2Entity, IStockHeaderVEntity> {
	private readonly translateService = inject(PlatformTranslateService);
	public stockHeaderService = inject(ProcurementStockHeaderDataService);
	public gridId :string ='ca2124f6e99e494591df3b5892a0a30a';
	public stockColumns: ColumnDef<IStockReconcilition2Entity>[] = [
		{
			id: 'ReconName',
			label: { text: 'Type', key: 'procurement.stock.header.type' },
			type: FieldType.Text,
			model: 'Type',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'TotalValue',
			label: { text: 'Receipt', key: 'procurement.stock.header.receipt' },
			type: FieldType.Money,
			model: 'Receipt',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'TotalProvision',
			label: { text: 'Consumed', key: 'procurement.stock.header.consumed' },
			type: FieldType.Money,
			model: 'Consumed',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
		{
			id: 'Expenses',
			label: { text: 'Difference', key: 'procurement.stock.header.difference' },
			type: FieldType.Money,
			model: 'Difference',
			readonly: true,
			visible: true,
			width: 120,
			sortable: true,
		},
	];

	public constructor(){
		super();
		this.uiAddOns.toolbar.addItems(this.menuItem);
	}

	public getStockReconciliationData = (selected: IStockHeaderVEntity) =>{
		const list: IStockReconcilition2Entity[] = this.getList(selected);
		return of(list);
	};

	public getList(selected: IStockHeaderVEntity) {
		let index = 0;
		const list: IStockReconcilition2Entity[] = [];

		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.stock.header.totalvalue'),
			Receipt: selected.TotalReceipt,
			Consumed: selected.TotalConsumed,
			Difference: selected.TotalValue,
		});

		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.stock.header.totalprovision'),
			Receipt: selected.ProvisionReceipt,
			Consumed: selected.ProvisionConsumed,
			Difference: selected.TotalProvision,
		});

		list.push({
			Id: ++index,
			Type: this.translateService.instant('procurement.stock.header.expenses'),
			Receipt: selected.ExpenseTotal,
			Consumed: selected.ProvisionReceipt,
			Difference: selected.Expenses,
		});
		return list;
	}

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
}
