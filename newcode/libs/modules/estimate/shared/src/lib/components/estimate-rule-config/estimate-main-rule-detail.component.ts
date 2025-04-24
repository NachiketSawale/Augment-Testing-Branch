/*
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
	ColumnDef,
	ControlContextInjectionToken,
	createLookup,
	FieldType, IFieldValueChangeInfo,
	IGridConfiguration,
	IMenuItemsList,
	ItemType, MenuListContent
} from '@libs/ui/common';
import {
	IEstMainConfigComplete,
	IEstRootAssignmentDetailEntity,
} from '@libs/estimate/interfaces';
import { Subscription } from 'rxjs';
import {
	EstimateMainRuleAssignRuleLookupService
} from '../../lookups/estimate-rule-config/estimate-main-rule-assign-rule-lookup.service';
import {
	EstimateMainRuleAssignDataService
} from '../../common/services/config-dialog/estimate-rule-config/estimate-main-rule-assign-data.service';
import {
	EstimateMainRuleAssignTypeLookupService
} from '../../lookups/estimate-rule-config/estimate-main-rule-assign-type-lookup.service';


@Component({
	templateUrl: 'estimate-main-rule-detail.component.html',
	styleUrl: 'estimate-main-rule-detail.component.scss',
})
export class EstimateMainRuleDetailComponent implements OnInit, OnDestroy{
	protected configOption!: IGridConfiguration<IEstRootAssignmentDetailEntity>;
	private readonly controlContext = inject(ControlContextInjectionToken);
	private currentEntity?: IEstMainConfigComplete;
	private subscription: Subscription[] = [];
	private readonly toolbarContent = new MenuListContent();
	private readonly  estimateMainRuleAssignDataService = inject(EstimateMainRuleAssignDataService);
	private readonly estimateMainRuleAssignTypeLookupService = inject(EstimateMainRuleAssignTypeLookupService);
	/**
	 * Constructor
	 * @param cdRef
	 */
	public constructor(private cdRef: ChangeDetectorRef) {
		const sub = this.estimateMainRuleAssignDataService.listChanged$.subscribe((entities) => {
			this.refresh(entities);
			this.cdRef.detectChanges();
		});

		this.subscription.push(sub);
	}
	public ngOnInit(): void {
		this.currentEntity = this.controlContext.entityContext.entity as IEstMainConfigComplete;
		this.refresh(this.estimateMainRuleAssignDataService.rootAssignmentDetails??[]);
	}

	private refresh(entities: IEstRootAssignmentDetailEntity[]): void {
		this.configOption = {
			uuid: 'a484374568e24bcd8e6f22d82ac4d566',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...entities],
		};
	}
	public get currentTools(): IMenuItemsList | undefined {
		if (!this.toolbarContent.items || !this.toolbarContent.items.items || this.toolbarContent.items.items.length === 0) {
			this.toolbarContent.addItems(this.tools()?.items ?? []);
		}
		return this.toolbarContent.items;
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstRootAssignmentDetailEntity[]): void {
		this.estimateMainRuleAssignDataService.setSelectedEntities(event);

	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstRootAssignmentDetailEntity>): void {
		this.estimateMainRuleAssignDataService.setItemToSave(event.entity);
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
						this.estimateMainRuleAssignDataService.createItem(this.estimateMainRuleAssignTypeLookupService.getSelectItemId()??0);
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
						this.estimateMainRuleAssignDataService.delete();
					},
					disabled: false
				}
			]
		};
	}
	protected columns: ColumnDef<IEstRootAssignmentDetailEntity>[] =[
		{
			id: 'rootAssignmentLevel',
			model: 'EstRootAssignmentLevelFk',
			type: FieldType.Code,
			label: {
				text: 'Estimate',
				key: 'estimate.main.estimate'
			},
			// formatter: function () {   TODD: Wait support formatter: function --- Jun
			// 	return 'Root';
			// },
			readonly: true,
			visible: true,
			sortable: false,
		},
		{
			id: 'rootAssignRules',
			model: 'EstRuleFk',
			type: FieldType.Lookup,
			label: {
				text: 'Rules',
				key: 'estimate.main.estRuleAssignmentConfigDetails.rules'
			},
			lookupOptions: createLookup({
				dataServiceToken: EstimateMainRuleAssignRuleLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			visible: true,
			sortable: false,
			readonly: false
		},
	];

	public ngOnDestroy(): void {
	}
}