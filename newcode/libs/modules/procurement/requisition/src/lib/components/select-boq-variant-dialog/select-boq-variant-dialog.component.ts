/*
 * Copyright(c) RIB Software GmbH
 */

import {Component, Inject, inject} from '@angular/core';
import {ProcurementRequisitionBoqHeaderLookupService} from '../../services/lookups/prc-boq-header-lookup.service';
import {ISelectVariantData, SELECT_VARIANT_DATA_TOKEN} from '../../model/select-variant/select-variant-data.interface';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import {
	CellChangeEvent,
	ColumnDef,
	FieldType,
	GridApiService,
	IGridConfiguration,
	IMenuItemsList, ItemType,
	LookupEvent
} from '@libs/ui/common';
import {IBoqItemEntity} from '@libs/boq/interfaces';
import {IReqBoqVariantEntity} from '../../model/entities/req-boq-variant-entity.interface';
import {RequisitionBoqVariantDataService} from '../../services/requisition-boq-variant-data.service';
import {EntityContainerCommand} from '@libs/ui/business-base';
import {get, set, isNumber, forEach} from 'lodash';

@Component({
	selector: 'procurement-requisition-select-boq-variant-dialog',
	templateUrl: './select-boq-variant-dialog.component.html',
	styleUrls: ['./select-boq-variant-dialog.component.scss'],
})
export class SelectBoqVariantDialogComponent {
	// todo chi: boq layout is not available.
	protected readonly boqHeaderLookupService = inject(ProcurementRequisitionBoqHeaderLookupService);
	private readonly boqVariantService = inject(RequisitionBoqVariantDataService);
	private readonly gridApiService = inject(GridApiService);

	private readonly gridUuid = 'c10dde19ed424a19af345abcd5782456';
	protected currentItem!: {
		boqHeaderFk?: number | null
	};
	protected selectedItems: IBoqItemEntity[] = [];
	protected list: IBoqItemEntity[] = [];
	public configuration!: IGridConfiguration<IBoqItemEntity>;
	private readonly columns: ColumnDef<IBoqItemEntity>[];
	protected readonly boqHeaderLookupOptions = {
		descriptionMember: 'BoqRootItem.BriefInfo.Translated',
	};

	public constructor(@Inject(SELECT_VARIANT_DATA_TOKEN) public variantData: ISelectVariantData) {
		this.currentItem = {};
		// todo chi: boq item layout is not ready.
		this.columns = [{
			id: 'IsChecked',
			model: 'IsChecked',
			label: 'procurement.requisition.variant.check',
			type: FieldType.Boolean,
			width: 50,
			sortable: true,
			visible: true,
		}];
		this.updateBoqGrid();
	}

	private async loadBoqHeader() {
		const data: IPrcBoqExtendedEntity[] = []; // todo chi: common service is not available. procurementCommonPrcBoqService.getService().getList();
		if (data.length > 0) {
			this.currentItem = {
				boqHeaderFk: data[0]?.BoqRootItem?.BoqHeaderFk,
			};
			await this.loadBoqItems();
			this.updateBoqGrid();
		}
	}

	protected async onBoqHeaderLookupSelectionChanged(event: LookupEvent<IPrcBoqExtendedEntity, object>) {
		const selected = event.selectedItem as IPrcBoqExtendedEntity;
		this.currentItem = {
			boqHeaderFk: selected.BoqRootItem?.BoqHeaderFk,
		};
		await this.loadBoqItems();
	}

	protected onGridSelectionChanged(selection: IBoqItemEntity[]) {
		this.selectedItems = selection || [];
	}

	protected onGridCellChanged(event: CellChangeEvent<IBoqItemEntity>) {
		const selected = this.selectedItems.length > 0 ? this.selectedItems[0] : null;
		if (selected) {
			const col = event.column.model as string;
			if (col === 'IsChecked') {
				const isChecked = get(selected, 'IsChecked', false) as boolean;
				this.checkChildren(selected, isChecked);
				this.checkParent(this.list, selected, isChecked);
			}
		}
	}

	private checkChildren(item: IBoqItemEntity, flg: boolean) {
		if (item.BoqItems && item.BoqItems.length > 0) {
			forEach(item.BoqItems, boqItem => {
				this.checkChildren(boqItem, flg);
			});
		}
		// item.IsChecked = flg;
		set(item, 'IsChecked', flg);
	}

	private checkParent(allitems: IBoqItemEntity[], entity: IBoqItemEntity, flg: boolean) {
		if (entity.BoqItemFk && entity.BoqItemFk > 0) {
			const parentId = entity.BoqItemFk;
			const parent = allitems.find((item) => {
				return item.Id === parentId;
			});
			if (parent) {
				if (flg) {
					// parent.IsChecked = flg;
					set(parent, 'IsChecked', flg);

					this.checkParent(allitems, parent, flg);
				} else {
					const brothers = allitems.filter((item) => {
						return item.BoqItemFk === parentId && item.Id !== entity.Id;
					});
					const brothersChecked = brothers.filter((item) => {
						const isChecked = get(item, 'IsChecked', false) as boolean;
						return isChecked; // item.IsChecked;
					});
					if (brothersChecked && brothersChecked.length > 0) {
						return;
					} else {
						// parent.IsChecked = flg;
						set(parent, 'IsChecked', flg);
						this.checkParent(allitems, parent, flg);
					}
				}
			}
		}
	}

	private insertImagesAndChecked(boqItem: IBoqItemEntity | null | undefined, boqItemInVariantList: IBoqItemEntity[]) {
		if (!boqItem) {
			return;
		}
		// todo chi: logic is not available
		// boqMainImageProcessor.processItem(boqItem);
		const hasItemVariant = boqItemInVariantList.find((boqItemInVariant) => {
			return boqItem.Id === boqItemInVariant.Id;
		});
		if (hasItemVariant) {
			// boqItem.IsChecked = true;
			set(boqItem, 'IsChecked', true);
		}
		if (Array.isArray(boqItem.BoqItems)) {
			forEach(boqItem.BoqItems, boqItem => {
				this.insertImagesAndChecked(boqItem, boqItemInVariantList);
			});
		}
	}

	public async ok() {
		const boqHeaderId = this.currentItem.boqHeaderFk;
		const selectedData = this.list.filter((item) => {
			const isChecked = get(item, 'IsChecked', false) as boolean;
			return isChecked; // item.IsChecked;
		});
		const items: IReqBoqVariantEntity[] = [];
		selectedData.forEach((item) => {
			items.push({
				Id: 0,
				ReqVariantFk: this.variantData.variantId,
				BoqHeaderFk: item.BoqHeaderFk,
				BoqItemFk: item.Id
			});
		});
		await this.boqVariantService.saveBoqVariant({
			BoqHeaderfk: boqHeaderId,
			ReqVariantFk: this.variantData.variantId,
			BoqVariantDtoList: items
		});
		const parentSelected = this.boqVariantService.reqVariantDataService.getSelectedEntity();
		this.boqVariantService.load({id: 0, pKey1: parentSelected?.Id});
	}

	public get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					caption: {key: 'cloud.common.toolbarCollapse'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-collapse',
					id: 'collapse',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridUuid);
						if (gridApi && gridApi.selection.length > 0) {
							gridApi.collapse(gridApi.selection[0]);
						}
					},
					sort: 60,
					type: ItemType.Item,
				},
				{
					caption: {key: 'cloud.common.toolbarExpand'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand',
					id: 'expand',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridUuid);
						if (gridApi && gridApi.selection.length > 0) {
							gridApi.expand(gridApi.selection[0]);
						}
					},
					sort: 70,
					type: ItemType.Item,
				},
				{
					caption: {key: 'cloud.common.toolbarCollapseAll'},
					hideItem: false,
					iconClass: ' tlb-icons ico-tree-collapse-all',
					id: EntityContainerCommand.CollapseAll,
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridUuid);
						if (gridApi) {
							gridApi.collapseAll();
						}
					},
					sort: 80,
					type: ItemType.Item,
				},
				{
					caption: {key: 'cloud.common.toolbarExpandAll'},
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand-all',
					id: EntityContainerCommand.ExpandAll,
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridUuid);
						if (gridApi) {
							gridApi.expandAll();
						}
					},
					sort: 90,
					type: ItemType.Item,
				},
			]
		};
	}

	private async loadBoqItems() {
		if (this.variantData.reqHeader && isNumber(this.currentItem.boqHeaderFk)) {
			const boqHeaderId = this.currentItem.boqHeaderFk;
			const boqItemInVariantList = await this.boqVariantService.loadBoqVariant(this.variantData.variantId);
			const reqHeader = this.variantData.reqHeader;
			const boqItems = await this.boqVariantService.loadBoqStructure(boqHeaderId, reqHeader);

			boqItems.forEach((item) => {
				this.insertImagesAndChecked(item, boqItemInVariantList);
			});
			this.list = boqItems;
			this.updateBoqGrid();
		}
	}

	private updateBoqGrid() {
		this.configuration = {
			uuid: this.gridUuid,
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...this.list],
			treeConfiguration: {
				parent: entity => {
					if (entity.BoqItemFk) {
						return this.list.find(item => item.Id === entity.BoqItemFk && item.BoqHeaderFk === entity.BoqHeaderFk) || null;
					}
					return null;
				},
				children: entity => entity.BoqItems ?? []
			}
		};
	}
}
