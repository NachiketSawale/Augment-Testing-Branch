/*
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef, ControlContextInjectionToken, createLookup, FieldType, FieldValidationInfo, IFieldValueChangeInfo, IGridConfiguration, IMenuItemsList, ItemType, MenuListContent } from '@libs/ui/common';
import { IEstColumnConfigDetailEntity, IEstimateMainConfigComplete } from '@libs/estimate/interfaces';
import { ColumnConfigColumnIdLookupDataService } from '../../../lookups/column-config/column-config-column-id-lookup-data.service';
import { ColumnConfigLineTypeLookupDataService } from '../../../lookups/column-config/column-config-line-type-lookup-data.service';
import { BasicsSharedCostCodeLookupService } from '@libs/basics/shared';
import { EstimateMainColumnConfigDetailDataService } from '../../../common/services/config-dialog/column-config-detail/estimate-main-column-config-detail-data.service';
import { Subscription } from 'rxjs';
import { EstimateMainColumnConfigDetailValidationService } from '../../../common/services/config-dialog/column-config-detail/estimate-main-column-config-detail-validation.service';

/**
 * Column config detail component
 */
@Component({
	selector: 'estimate-shared-column-config-detail',
	templateUrl: './column-config-detail.component.html',
	styleUrls: ['./column-config-detail.component.scss'],
})
export class ColumnConfigDetailComponent implements OnInit, OnDestroy {
	protected configOption!: IGridConfiguration<IEstColumnConfigDetailEntity>;
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly columnConfigDetailDataService = inject(EstimateMainColumnConfigDetailDataService);
	private readonly columnConfigDetailValidationService = inject(EstimateMainColumnConfigDetailValidationService);

	private subscription: Subscription[] = [];
	private _entity?: IEstimateMainConfigComplete;
	private readonly toolbarContent = new MenuListContent();

	/**
	 * Constructor
	 * @param cdRef
	 */
	public constructor(private cdRef: ChangeDetectorRef) {
		const sub = this.columnConfigDetailDataService.listChanged$.subscribe((entities) => {
			this.refresh(entities);
			//this.cdRef.detectChanges();
		});

		this.subscription.push(sub);
	}

	/**
	 * On
	 */
	public ngOnInit(): void {
		this._entity = this.controlContext.entityContext.entity as IEstimateMainConfigComplete;
		this.columnConfigDetailDataService.setDataList(this._entity.estColumnConfigDetails ?? []);
		this.refresh(this._entity.estColumnConfigDetails ?? []);
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstColumnConfigDetailEntity[]): void {
		this.columnConfigDetailDataService.setSelectedEntities(event);
	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstColumnConfigDetailEntity>): void {
		this.columnConfigDetailDataService.setItemToSave(event.entity);
	}

	private refresh(entities: IEstColumnConfigDetailEntity[]): void {
		this.configOption = {
			uuid: 'a484374568e242cd8e6f220874c4f566',
			columns: this.columns,
			skipPermissionCheck: true,
			items: [...entities],
		};
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
	 * On destroy
	 */
	public ngOnDestroy() {
		this.subscription.forEach((sub) => sub.unsubscribe());
	}

	/**
	 * Get columns
	 */
	protected columns: ColumnDef<IEstColumnConfigDetailEntity>[] = [
		{
			id: 'ColumnId',
			model: 'ColumnId',
			label: {
				key: 'estimate.main.columnConfigDetails.ColumnId',
				text: 'Column ID',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ColumnConfigColumnIdLookupDataService,
				showClearButton: false,
			}),
			tooltip: { text: 'Column ID', key: 'estimate.main.columnConfigDetails.ColumnIdTooltip' },
			width: 110,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstColumnConfigDetailEntity>) => {
				return this.columnConfigDetailValidationService.validateColumnId({
					entity: info.entity,
					value: info.value,
					field: 'ColumnId',
				});
			},
		},
		{
			id: 'LineType',
			model: 'LineType',
			label: {
				key: 'estimate.main.columnConfigDetails.LineType',
				text: 'Type',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ColumnConfigLineTypeLookupDataService,
				showClearButton: true,
				displayMember: 'ShortKeyInfo.Translated',
			}),
			tooltip: { text: 'Type', key: 'estimate.main.columnConfigDetails.LineTypeTooltip' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstColumnConfigDetailEntity>) => {
				return this.columnConfigDetailValidationService.validateLineType({
					entity: info.entity,
					value: info.value,
					field: 'LineType',
				});
			},
		},
		{
			id: 'MdcCostCodeFk',
			model: 'MdcCostCodeFk',
			label: {
				key: 'estimate.main.columnConfigDetails.MdcCostCodeFk',
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
						key: 'estimate.main.columnConfigDetails.MdcCostCodeFkDescription',
					},
					column: true,
					singleRow: true,
				},
			],
			tooltip: { text: 'Code', key: 'estimate.main.columnConfigDetails.MdcCostCodeFkTooltip' },
			width: 80,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstColumnConfigDetailEntity>) => {
				return this.columnConfigDetailValidationService.validateMdcCostCodeFk({
					entity: info.entity,
					value: info.value,
					field: 'MdcCostCodeFk',
				});
			},
		},
		{
			id: 'MaterialLineId',
			model: 'MaterialLineId',
			label: {
				key: 'estimate.main.columnConfigDetails.MaterialLineId',
				text: 'Material ID',
			},
			type: FieldType.Integer,
			tooltip: { text: 'Material ID', key: 'estimate.main.columnConfigDetails.MaterialLineIdTooltip' },
			width: 60,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstColumnConfigDetailEntity>) => {
				return this.columnConfigDetailValidationService.validateMaterialLineId({
					entity: info.entity,
					value: info.value,
					field: 'MaterialLineId',
				});
			},
		},
		{
			id: 'DescriptionInfo',
			model: 'DescriptionInfo',
			label: {
				key: 'estimate.main.columnConfigDetails.Description',
				text: 'Column Header',
			},
			type: FieldType.Translation,
			tooltip: { text: 'Column Header', key: 'estimate.main.columnConfigDetails.DescriptionTooltip' },
			width: 160,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstColumnConfigDetailEntity>) => {
				return this.columnConfigDetailValidationService.validateDescriptionInfo({
					entity: info.entity,
					value: info.value,
					field: 'DescriptionInfo',
				});
			},
		},
	];

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
						this.columnConfigDetailDataService.createItem(this._entity?.columnConfigId ?? 0);
					},
					disabled: false,
				},
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.taskBarDeleteRecord', text: 'delete' },
					iconClass: 'tlb-icons ico-rec-delete',
					id: 'delete',
					fn: () => {
						this.columnConfigDetailDataService.delete();
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


}
