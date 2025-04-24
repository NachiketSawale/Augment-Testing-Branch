/*
 * Copyright(c) RIB Software GmbH
 */


import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
	ColumnDef, ControlContextInjectionToken, createLookup,
	FieldType, IFieldValueChangeInfo,
	IGridConfiguration,
	IMenuItemsList,
	ItemType, MenuListContent
} from '@libs/ui/common';
import {
	IEstMainConfigComplete,
	IEstStructureDetailEntity
} from '@libs/estimate/interfaces';
import { EstimateMainStructureDataService } from '../../common/services/config-dialog/estimate-structure/estimate-main-structure-data.service';
import {
	EstimateMainConfigQuantityRelLookupService
} from '../../lookups/estimate-structure/estimate-main-config-quantity-rel-lookup.service';
import {
	EstimateMainConfigStructureLookupService
} from '../../lookups/estimate-structure/estimate-main-config-structure-lookup.service';
import {
	EstimateMainConfigStructureTypeLookupService
} from '../../lookups/estimate-structure/estimate-main-config-structure-type-lookup.service';
import { Subscription } from 'rxjs';


@Component({
	templateUrl: 'estimate-structure-grid.component.html',
	styleUrl: 'estimate-structure-grid.component.scss',
})
export class EstimateStructureGridComponent implements OnInit, OnDestroy {
	protected configOption!: IGridConfiguration<IEstStructureDetailEntity>;
	private readonly controlContext = inject(ControlContextInjectionToken);
	private currentEntity?: IEstMainConfigComplete;
	private subscription: Subscription[] = [];
	private readonly toolbarContent = new MenuListContent();
	private readonly estimateStructureGridDataService = inject(EstimateMainStructureDataService);
	private  estimateMainConfigStructureTypeLookupService = inject(EstimateMainConfigStructureTypeLookupService);
	public  ngOnDestroy(): void {
	}

	/**
	 * Constructor
	 * @param cdRef
	 */
	public constructor(private cdRef: ChangeDetectorRef) {
		const sub = this.estimateStructureGridDataService.listChanged$.subscribe((entities) => {
			this.refresh(entities);
			//this.cdRef.detectChanges();
		});

		this.subscription.push(sub);
	}
	public ngOnInit(): void {
		this.currentEntity = this.controlContext.entityContext.entity as IEstMainConfigComplete;
		this.refresh(this.estimateStructureGridDataService.structureData??[]);
	}
	public get currentTools(): IMenuItemsList | undefined {
		if (!this.toolbarContent.items || !this.toolbarContent.items.items || this.toolbarContent.items.items.length === 0) {
			this.toolbarContent.addItems(this.tools()?.items ?? []);
		}
		return this.toolbarContent.items;
	}
	private refresh(entities: IEstStructureDetailEntity[]): void {
		this.configOption = {
			uuid: 'a484374568e242cd8e6f22d87ac42566',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...entities],
		};
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstStructureDetailEntity[]): void {
		this.estimateStructureGridDataService.setSelectedEntities(event);
	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstStructureDetailEntity>): void {
		this.estimateStructureGridDataService.setItemToSave(event.entity);
	}
	protected tools(): IMenuItemsList | undefined{
		return {
			cssClass: 'tools',
			items:[
				{
					id: 'create',
					sort: 0,
					caption: 'cloud.common.taskBarNewRecord',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-new',
					fn: ()=>{
						this.estimateStructureGridDataService.createItem(this.estimateMainConfigStructureTypeLookupService.getSelectId()??0);
					},
					disabled: false
				},
				{
					id: 'delete',
					sort: 10,
					caption: 'cloud.common.taskBarDeleteRecord',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-rec-delete',
					fn: ()=>{
						this.estimateStructureGridDataService.delete();
					},
					disabled: false
				}
			]
		};
	}
	private  CreateStructure():IEstStructureDetailEntity{

		return  Object();
	}
	protected columns: ColumnDef<IEstStructureDetailEntity>[] =[
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
			id: 'estStructure',
			model: 'EstStructureFk',
			type: FieldType.Lookup,
			label: {
				text: 'Structure',
				key: 'estimate.main.estStructureConfigDetails.structure'
			},
			lookupOptions: createLookup({
				dataServiceToken: EstimateMainConfigStructureLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id: 'quantityRel',
			model: 'EstQuantityRelFk',
			type: FieldType.Lookup,
			label: {
				text: 'Est Quantity Rel',
				key: 'estimate.main.estStructureConfigDetails.estQuantRel'
			},
			lookupOptions: createLookup({
				dataServiceToken: EstimateMainConfigQuantityRelLookupService,
			displayMember: 'DescriptionInfo.Translated'
		}),
			visible: true,
			sortable: false,
			readonly: false
		},
		{
			id: 'sort',
			model: 'Sorting',
			type: FieldType.Integer,
			label: {
				text: 'Sorting',
				key: 'estimate.main.estStructureConfigDetails.sorting'
			},
			visible: true,
			sortable: false,
			readonly: false
		}
	];

}