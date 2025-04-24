/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef, ControlContextInjectionToken, createLookup, FieldType, FieldValidationInfo, IFieldValueChangeInfo, IGridConfiguration, IMenuItemsList, ItemType, MenuListContent } from '@libs/ui/common';
import { IEstCostcodeAssignDetailEntity, IEstimateMainConfigComplete } from '@libs/estimate/interfaces';
import { Subscription } from 'rxjs';
import { BasicsSharedCostCodeLookupService, BasicsSharedCostCodeTypeLookupService, BasicsSharedCurrencyLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { CostCodeAssignmentDetailDataService } from '../../../common/services/config-dialog/cost-code-assignment-detail/cost-code-assignment-detail-data.service';
import { TotalsConfigStructureTypeLookupDataService } from '../../../lookups/totals-config/totals-config-structure-type-lookup-data.service';
import { ValidationResult } from '@libs/platform/data-access';

/**
 * Cost code assignment detail component
 */
@Component({
	selector: 'estimate-shared-cost-code-assignment-detail',
	templateUrl: './cost-code-assignment-detail.component.html',
	styleUrl: './cost-code-assignment-detail.component.css',
})
export class CostCodeAssignmentDetailComponent implements OnInit, OnDestroy {
	protected configOption!: IGridConfiguration<IEstCostcodeAssignDetailEntity>;
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly configDetailDataService = inject(CostCodeAssignmentDetailDataService);
	private readonly costCodeLookupService = inject(BasicsSharedCostCodeLookupService);
	/**
	 * Get columns
	 */
	protected columns: ColumnDef<IEstCostcodeAssignDetailEntity>[] = [
		{
			id: 'estMdcCostCodeFk',
			model: 'MdcCostCodeFk',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk',
				text: 'Code',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCostCodeLookupService,
				showClearButton: true,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: 'cloud.common.entityDescription',
						text: 'Description',
					},
					column: true,
					singleRow: true,
				},
			],
			tooltip: { text: 'Code', key: 'estimate.main.costCodeAssignmentDetails.MdcCostCodeFk' },
			width: 160,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstCostcodeAssignDetailEntity>) => {
				if (info.value) {
					this.costCodeLookupService.getItemByKey({ id: info.value as number }).subscribe((costCodeItem) => {
						if (costCodeItem) {
							info.entity.BasUomFk = costCodeItem.UomFk;
							info.entity.CurrencyFk = costCodeItem.CurrencyFk;
							info.entity.CostcodeTypeFk = costCodeItem.CostCodeTypeFk;
							if (costCodeItem.DescriptionInfo) {
								info.entity.Description = costCodeItem.DescriptionInfo.Description;
							}
						}
					});
				}
				return new ValidationResult();
			},
		},
		{
			id: 'Type',
			model: 'CostcodeTypeFk',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.Type',
				text: 'Type',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCostCodeTypeLookupService,
				showClearButton: true,
			}),
			tooltip: { text: 'Type', key: 'estimate.main.costCodeAssignmentDetails.Type' },
			width: 160,
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
				displayMember: 'Unit',
				showClearButton: true,
			}),
			tooltip: { text: 'UoM', key: 'estimate.main.totalsConfigDetails.BasUoMFk' },
			width: 80,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'currency',
			model: 'CurrencyFk',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.Currency',
				text: 'Currency',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCurrencyLookupService,
				showClearButton: true,
			}),
			tooltip: { text: 'Currency', key: 'estimate.main.costCodeAssignmentDetails.Currency' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'calculateway',
			model: 'Addorsubtract',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.AddandSubtract',
				text: '+/-',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: TotalsConfigStructureTypeLookupDataService,
				showClearButton: true,
			}),
			tooltip: { text: '+/-', key: 'estimate.main.costCodeAssignmentDetails.AddandSubtract' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isDirectRulesCost',
			model: 'IsDirectRulesCost',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.DirectRulesCost',
				text: 'DirectRulesCost',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'DirectRulesCost', key: 'estimate.main.costCodeAssignmentDetails.DirectRulesCost' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isDirectEnteredCost',
			model: 'IsDirectEnteredCost',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.DirectEnteredCost',
				text: 'DirectEnteredCost',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'DirectEnteredCost', key: 'estimate.main.costCodeAssignmentDetails.DirectEnteredCost' },
			width: 120,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isIndirectCost',
			model: 'IsIndirectCost',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.IsIndirectCost',
				text: 'IndirectCost',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'IndirectCost', key: 'estimate.main.costCodeAssignmentDetails.IsIndirectCost' },
			width: 100,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isCostRisk',
			model: 'IsCostRisk',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.IsCostRisk',
				text: 'CostRisk',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'CostRisk', key: 'estimate.main.costCodeAssignmentDetails.IsCostRisk' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'isNonCostRisk',
			model: 'IsNonCostRisk',
			label: {
				key: 'estimate.main.costCodeAssignmentDetails.IsNonCostRisk',
				text: 'Non CostRisk',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'Non CostRisk', key: 'estimate.main.costCodeAssignmentDetails.IsNonCostRisk' },
			width: 100,
			visible: true,
			sortable: true,
			readonly: false,
		},
	];
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
		this.configDetailDataService.setDataList(this._entity.costCodeAssignmentDetails ?? []);
		this.refresh(this._entity.costCodeAssignmentDetails ?? []);
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstCostcodeAssignDetailEntity[]): void {
		this.configDetailDataService.setSelectedEntities(event);
	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstCostcodeAssignDetailEntity>): void {
		this.configDetailDataService.setItemToSave(event.entity);
	}

	/**
	 * On destroy
	 */
	public ngOnDestroy() {
		this.subscription.forEach((sub) => sub.unsubscribe());
	}

	/**
	 * Tools
	 * @protected
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
						this.configDetailDataService.createItem(this._entity?.estTolConfigTypeFk ?? 0).subscribe();
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

	private refresh(entities: IEstCostcodeAssignDetailEntity[]): void {
		this.configOption = {
			uuid: '6a61b64e80a1478c991276b77c70484d',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...entities],
		};
	}
}
