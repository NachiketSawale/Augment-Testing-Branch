/*
 * Copyright(c) RIB Software GmbH
 */

import {AfterViewInit, Component, inject, Inject} from '@angular/core';
import {ISelectVariantData, SELECT_VARIANT_DATA_TOKEN} from '../../model/select-variant/select-variant-data.interface';
import {ColumnDef, FieldType, IGridConfiguration, IMenuItemsList, ItemType} from '@libs/ui/common';
import {RequisitionItemVariantDataService} from '../../services/requisition-item-variant-data.service';
import {RequisitionItemsDataService} from '../../services/requisition-items-data.service';
import {PRC_ITEMS_ENTITY_INFO} from '../../model/entitiy-info/prc-items-entity-info.class';
import {ServiceLocator} from '@libs/platform/common';
import {EntityContainerCommand} from '@libs/ui/business-base';
import {IReqItemVariantEntity} from '../../model/entities/req-item-variant-entity.interface';
import {IReqItemEntity} from '../../model/entities/req-item-entity.interface';

@Component({
	selector: 'procurement-requisition-select-item-variant-dialog',
	templateUrl: './select-item-variant-dialog.component.html',
	styleUrls: ['./select-item-variant-dialog.component.scss'],
})
export class SelectItemVariantDialogComponent implements AfterViewInit {
	private readonly itemVariantService = inject(RequisitionItemVariantDataService);
	private readonly itemService = inject(RequisitionItemsDataService);

	private readonly gridUuid = '9313561132c1445980dee0b787613a86';
	private list: IReqItemEntity[] = [];
	public configuration!: IGridConfiguration<IReqItemEntity>;
	private columns: ColumnDef<IReqItemEntity>[] = [];

	public constructor(@Inject(SELECT_VARIANT_DATA_TOKEN) public variantData: ISelectVariantData) {
		this.updateGrid();
	}

	public ngAfterViewInit() {
		setTimeout(async () => {
			this.columns = await PRC_ITEMS_ENTITY_INFO.generateLookupColumns(ServiceLocator.injector);
			await this.loadItemVariant();
			this.updateGrid();
		});
	}

	private async loadItemVariant() {
		const itemVariantData = await this.itemVariantService.loadItemVariant(this.variantData.variantId);

		const itemList = this.itemService.getList();
		itemList.forEach((item) => {
			const hasItemVariant = itemVariantData.find((itemVariant) => {
				return item.Id === itemVariant.Id;
			});
			item.IsChecked = !!hasItemVariant;
		});
		this.list = itemList;
	}

	public async ok() {
		const selectedData = this.list.filter((item) => {
			return item.IsChecked;
		});
		const items: IReqItemVariantEntity[] = [];
		selectedData.forEach((item) => {
			items.push({
				Id: 0,
				ReqVariantFk: this.variantData.variantId,
				PrcItemFk: item.Id,
			});
		});
		await this.itemVariantService.saveChangedItems({
			ReqVariantFk: this.variantData.variantId,
			ItemVariantDtoList: items,
		});
		const parentSelected = this.itemVariantService.reqVariantDataService.getSelectedEntity();
		this.itemVariantService.load({id: 0, pKey1: parentSelected?.Id});
	}

	protected get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: EntityContainerCommand.Grouping,
					caption: 'cloud.common.taskBarGrouping',
					type: ItemType.Check,
					sort: 10,
					iconClass: 'tlb-icons ico-group-columns',
					fn: function () {
						// todo chi: do it later
						//	platformGridAPI.grouping.toggleGroupPanel($scope.currentItemGridId, this.value);
					},
					// value: platformGridAPI.grouping.toggleGroupPanel($scope.currentItemGridId),
					disabled: false,
				},
				{
					id: EntityContainerCommand.Print,
					sort: 111,
					caption: 'cloud.common.print',
					iconClass: 'tlb-icons ico-print-preview',
					type: ItemType.Item,
					fn: function () {
						// todo chi: do it later
						// reportingPrintService.printGrid($scope.currentItemGridId);
					},
				},
				{
					id: EntityContainerCommand.SearchOptions,
					caption: 'cloud.common.taskBarSearch',
					type: ItemType.Check,
					// value: platformGridAPI.filters.showSearch($scope.currentItemGridId),
					iconClass: 'tlb-icons ico-search-all',
					fn: function () {
						// todo chi: do it later
						// platformGridAPI.filters.showSearch($scope.currentItemGridId, this.value);
					},
				},
				{
					id: EntityContainerCommand.Settings,
					sort: 112,
					caption: 'cloud.common.gridlayout',
					iconClass: 'tlb-icons ico-settings',
					type: ItemType.Item,
					fn: function () {
						// todo chi: do it later
						// platformGridAPI.configuration.openConfigDialog($scope.currentItemGridId);
					},
				},
			],
		};
	}

	private updateGrid() {
		if (!this.columns.find(e => e.id === 'IsChecked')) {
			const selectCol: ColumnDef<IReqItemEntity> = {
				id: 'IsChecked',
				model: 'IsChecked',
				label: 'procurement.requisition.variant.check',
				type: FieldType.Boolean,
				width: 50,
				sortable: true,
				visible: true,
			};

			this.columns.forEach((col) => {
				col.readonly = true;
			});

			this.columns.unshift(selectCol);
		}

		this.configuration = {
			uuid: this.gridUuid,
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...this.list],
			enableDraggableGroupBy: true,
			enableColumnSort: true,
			enableModuleConfig: true,
		};
	}
}
