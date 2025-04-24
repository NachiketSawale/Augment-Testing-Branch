/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ColumnDef, FieldType, FieldValidationInfo, IDialog, IGridConfiguration, IMenuItemsList, ItemType } from '@libs/ui/common';
import { IEstShareUrbConfigUrb2CostCode } from '../../model/urb-config-urb-cost-code.interface';
import { IUrb2CostCode } from '../../model/urb-config-entity.interface';
import { EstShareUrbConfigGridDataService } from './urb-config-grid-data.service';
import { CollectionHelper } from '@libs/platform/common';
import { ValidationResult } from '@libs/platform/data-access';
import { forEach } from 'lodash';

@Component({
	selector: 'estimate-shared-urb-config-grid',
	templateUrl: './urb-config-grid.component.html',
	styleUrl: './urb-config-grid.component.scss',
})
export class EstimateSharedUrbConfigGridComponent implements OnInit, OnDestroy{

	private readonly urbConfigGridDataService = inject(EstShareUrbConfigGridDataService);

	public constructor() {
	}

	@Input()
	public Urb2CostCodes?: IUrb2CostCode[];

	@Input()
	public ProjectId?: number | undefined;

	@Input()
	public CreateNewModel: boolean | undefined;

	/**
	 * Used to recreate and refresh Chart view after chart data is changed.
	 */
	public ngOnChanges(change: SimpleChanges): void {

		if (change['Urb2CostCodes'] && change['Urb2CostCodes'].currentValue) {
			this.refresh(false);
		}
	}

	private refresh(fouceReloadCostCode?: boolean | null){
		this.urbConfigGridDataService.load(this.ProjectId, this.Urb2CostCodes, fouceReloadCostCode).subscribe(list =>{
			this.configOption = {
				...this.configOption,
				items: list
			};
		});
	}

	public ngOnInit(): void {
		this.configOption = {
			uuid: 'a484374568e242cd8e6f220874c4f566',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [
			],
			treeConfiguration: {
				parent: entity => {
					const flatList = CollectionHelper.Flatten(this.configOption.items || [], item => item.CostCodes);
					if(entity.CostCodeParentFk){
						return flatList.find(item => item.Id === entity.CostCodeParentFk) || null;
					}
					return null;
				},
				children: entity => {
					return entity.CostCodes;
				}
			}
		};
		this.urbConfigGridDataService.setIsCreateNew(this.CreateNewModel || false);
	}

	protected get tools(): IMenuItemsList<IDialog> | undefined{
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.toolbarCollapse', text: 'Collapse'},
					iconClass: 'tlb-icons ico-tree-collapse',
					id:'Collapse',
					fn: () => {
						//platformGridAPI.rows.collapseNode($scope.gridId);
					}
				},
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.toolbarExpand', text: 'Expand'},
					iconClass: 'tlb-icons ico-tree-expand',
					id:'Expand',
					fn: () => {
						//platformGridAPI.rows.expandNode($scope.gridId);
					}
				},{
					type: ItemType.Item,
					caption: {key: 'cloud.common.toolbarExpandAll', text: 'Expand All'},
					iconClass: 'tlb-icons ico-tree-expand-all',
					id:'ExpandAll',
					fn: () => {
						// platformGridAPI.rows.expandAllSubNodes($scope.gridId);
					}
				},
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.toolbarCollapseAll', text: 'Collapse All'},
					iconClass: 'tlb-icons ico-tree-collapse-all',
					id:'CollapseAll',
					fn: () => {
						// platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
					}
				},
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.toolbarRefresh', text: 'Refresh'},
					iconClass: 'tlb-icons ico-refresh',
					id:'refreshAll',
					fn: () => {
						this.refresh(true);
					}
				}
			]
		};
	}

	protected configOption!: IGridConfiguration<IEstShareUrbConfigUrb2CostCode>;

	protected columns: ColumnDef<IEstShareUrbConfigUrb2CostCode>[] = [
		{
			id: 'Code',
			model: 'Code',
			type: FieldType.Code,
			label: {
				text: 'Code',
				key: 'cloud.common.entityCode'
			},
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id: 'Description',
			model: 'DescriptionInfo',
			type: FieldType.Translation,
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'uppId1',
			model: 'UppId1',
			type: FieldType.Boolean,
			label: {
				text: 'URB1',
				key: 'estimate.main.estUppId1'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 1)
		},
		{
			id: 'uppId2',
			model: 'UppId2',
			type: FieldType.Boolean,
			label: {
				text: 'URB2',
				key: 'estimate.main.estUppId2'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 2)
		},
		{
			id: 'uppId3',
			model: 'UppId3',
			type: FieldType.Boolean,
			label: {
				text: 'URB3',
				key: 'estimate.main.estUppId3'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 3)
		},
		{
			id: 'uppId4',
			model: 'UppId4',
			type: FieldType.Boolean,
			label: {
				text: 'URB4',
				key: 'estimate.main.estUppId4'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 4)
		},
		{
			id: 'uppId5',
			model: 'UppId5',
			type: FieldType.Boolean,
			label: {
				text: 'URB5',
				key: 'estimate.main.estUppId5'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 5)
		},
		{
			id: 'uppId6',
			model: 'UppId6',
			type: FieldType.Boolean,
			label: {
				text: 'URB6',
				key: 'estimate.main.estUppId6'
			},
			visible: true,
			sortable: false,
			readonly: true,
			validator: info => this.validateUrb(info, 6)
		},
		{
			id: 'Description2',
			model: 'Description2Info',
			type: FieldType.Translation,
			label: {
				text: 'Description2',
				key: 'basics.costcodes.description2'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
	];

	private validateUrb(info: FieldValidationInfo<IEstShareUrbConfigUrb2CostCode>, columnIdx: number){

		const entity = info.entity;
		entity.UppId = columnIdx;
		entity.UppId1 = entity.UppId === 1;
		entity.UppId2 = entity.UppId === 2;
		entity.UppId3 = entity.UppId === 3;
		entity.UppId4 = entity.UppId === 4;
		entity.UppId5 = entity.UppId === 5;
		entity.UppId6 = entity.UppId === 6;

		const children = info.entity.CostCodes;
		if(children && children.length){
			const flatChildren = CollectionHelper.Flatten(children, item => item.CostCodes);
			forEach(flatChildren, child=>{
				child.UppId = columnIdx;
				child.UppId1 = child.UppId === 1;
				child.UppId2 = child.UppId === 2;
				child.UppId3 = child.UppId === 3;
				child.UppId4 = child.UppId === 4;
				child.UppId5 = child.UppId === 5;
				child.UppId6 = child.UppId === 6;
			});
		}

		this.configOption = {
			...this.configOption,
			items: this.urbConfigGridDataService.getList()
		};

		return new ValidationResult();
	}

	public ngOnDestroy(): void {
		this.urbConfigGridDataService.clear();
	}
}
