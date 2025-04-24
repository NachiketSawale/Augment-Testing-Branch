/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef, ControlContextInjectionToken, createLookup, FieldType, IFieldValueChangeInfo, IGridConfiguration, IMenuItemsList, ItemType, MenuListContent } from '@libs/ui/common';
import { IEstimateMainConfigComplete, IEstTotalsConfigDetailEntity } from '@libs/estimate/interfaces';
import { Subscription } from 'rxjs';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { TotalsConfigDetailDataService } from '../../../common/services/config-dialog/totals-config-detail/totals-config-detail-data.service';
import { TotalsConfigLineTypeLookupDataService } from '../../../lookups/totals-config/totals-config-line-type-lookup-data.service';

/**
 * Component for totals config detail.
 */
@Component({
	selector: 'estimate-shared-totals-config-detail',
	templateUrl: './totals-config-detail.component.html',
	styleUrl: './totals-config-detail.component.css',
})
export class TotalsConfigDetailComponent implements OnInit, OnDestroy {
	protected configOption!: IGridConfiguration<IEstTotalsConfigDetailEntity>;
	/**
	 * Get columns
	 */
	protected columns: ColumnDef<IEstTotalsConfigDetailEntity>[] = [
		{
			id: 'description',
			model: 'DescriptionInfo',
			label: {
				key: 'cloud.common.entityDescription',
				text: 'Description',
			},
			type: FieldType.Translation,
			tooltip: { text: 'Description', key: 'cloud.common.entityDescription' },
			width: 160,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'LineType',
			model: 'LineType',
			label: {
				key: 'estimate.main.lineTypeStr',
				text: 'Line Type',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: TotalsConfigLineTypeLookupDataService<IEstTotalsConfigDetailEntity>,
				showClearButton: true,
				selectableCallback: function (entity, context) {
					//TODO-Walt: wait for <estimateMainEstTotalsConfigDetailDataService>.onLineTypeChange.fire(dataItem.Id);
					//entity.LineType = entity.Id;
					//$injector.get('estimateMainCostCodeAssignmentDetailDataService').readOnlyCostCodeAssignment.fire();
					//$injector.get('estimateMainEstTotalsConfigDetailDataService').onLineTypeChange.fire(dataItem.Id);
					return true;
				},
			}),
			tooltip: { text: 'Line Type', key: 'estimate.main.lineTypeStr' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'estBasUoMFk',
			model: 'BasUomFk',
			label: {
				key: 'estimate.main.totalsConfigDetails.BasUoMFk',
				text: 'UoM',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUomLookupService,
				showClearButton: true,
			}),
			tooltip: { text: 'UoM', key: 'estimate.main.totalsConfigDetails.BasUoMFk' },
			width: 80,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isLabour',
			model: 'IsLabour',
			label: {
				key: 'estimate.main.totalsConfigDetails.IsLabour',
				text: 'IsLabour',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'IsLabour', key: 'estimate.main.totalsConfigDetails.IsLabour' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isBold',
			model: 'IsBold',
			label: {
				key: 'estimate.main.totalsConfigDetails.IsBold',
				text: 'IsBold',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'IsBold', key: 'estimate.main.totalsConfigDetails.IsBold' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isItalic',
			model: 'IsItalic',
			label: {
				key: 'estimate.main.totalsConfigDetails.IsItalic',
				text: 'IsItalic',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'IsItalic', key: 'estimate.main.totalsConfigDetails.IsItalic' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isUnderLine',
			model: 'IsUnderline',
			label: {
				key: 'estimate.main.totalsConfigDetails.IsUnderline',
				text: 'IsUnderline',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'IsUnderline', key: 'estimate.main.totalsConfigDetails.IsUnderline' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'costTypes',
			model: 'EstTotalDetail2CostTypes',
			label: {
				key: 'basics.customize.costTypes',
				text: 'Cost Types',
			},
			type: FieldType.Integer,
			tooltip: { text: 'Cost Types', key: 'basics.customize.costTypes' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'resourceFlags',
			model: 'EstTotalDetail2ResourceFlags',
			label: {
				key: 'basics.customize.resourceFlags',
				text: 'Resource Flags',
			},
			type: FieldType.Integer,
			tooltip: { text: 'Resource Flags', key: 'basics.customize.resourceFlags' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
	];
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly configDetailDataService = inject(TotalsConfigDetailDataService);
	private subscription: Subscription[] = [];
	private _entity?: IEstimateMainConfigComplete;
	private readonly toolbarContent = new MenuListContent();

	/**
	 * Constructor
	 */
	public constructor() {
		const sub = this.configDetailDataService.listChanged$.subscribe((entities) => {
			this.refresh(entities);
		});

		this.subscription.push(sub);
	}

	/**
	 * Get current tools
	 */
	public get currentTools(): IMenuItemsList | undefined {
		if (!this.toolbarContent.items || !this.toolbarContent.items.items || this.toolbarContent.items.items.length === 0) {
			this.toolbarContent.addItems(this.tools()?.items ?? []);
		}
		return this.toolbarContent.items;
	}

	/**
	 * On Init
	 */
	public ngOnInit(): void {
		this._entity = this.controlContext.entityContext.entity as IEstimateMainConfigComplete;
		this.configDetailDataService.setDataList(this._entity.EstTotalsConfigDetails ?? []);
		this.refresh(this._entity.EstTotalsConfigDetails ?? []);
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstTotalsConfigDetailEntity[]): void {
		this.configDetailDataService.setSelectedEntities(event);
	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstTotalsConfigDetailEntity>): void {
		this.configDetailDataService.setItemToSave(event.entity);
	}

	/**
	 * On destroy
	 */
	public ngOnDestroy() {
		this.subscription.forEach((sub) => sub.unsubscribe());
	}

	/**
	 * Get tools
	 */
	protected tools(): IMenuItemsList | undefined {
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.taskBarNewRecord', text: 'create' },
					iconClass: 'tlb-icons ico-rec-new',
					id: 'create',
					fn: () => {
						this.configDetailDataService.createItem(this._entity?.estTolConfigTypeFk ?? 0);
					},
					disabled: false,
				},
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.taskBarDeleteRecord', text: 'delete' },
					iconClass: 'tlb-icons ico-rec-delete',
					id: 'delete',
					fn: () => {
						this.configDetailDataService.delete();
					},
				},
				{
					type: ItemType.Item,
					caption: { key: 'estimate.main.columnConfigDetails.toolsUp', text: 'move Up' },
					iconClass: 'tlb-icons ico-grid-row-up',
					id: 'moveUp',
					fn: () => {
						//TODO-Walt: wait for <estimateMainEstColumnConfigDetailDataService>.moveUp(1,$scope.gridId);
						// estimateMainEstColumnConfigDetailDataService.moveUp(1,$scope.gridId);
					},
				},
				{
					type: ItemType.Item,
					caption: { key: 'estimate.main.columnConfigDetails.toolsDown', text: 'move Down' },
					iconClass: 'tlb-icons ico-grid-row-down',
					id: 'moveDown',
					fn: () => {
						//TODO-Walt: wait for <estimateMainEstColumnConfigDetailDataService>.moveDown(3,$scope.gridId);
						// estimateMainEstColumnConfigDetailDataService.moveDown(3,$scope.gridId);
					},
				},
			],
		};
	}

	private refresh(entities: IEstTotalsConfigDetailEntity[]): void {
		this.configOption = {
			uuid: '45ab0291858441758fd1f9e818a34aca',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...entities],
		};
	}
}
