import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef, ControlContextInjectionToken, createLookup, FieldType, FieldValidationInfo, GridContainerType, IFieldValueChangeInfo, IGridConfiguration } from '@libs/ui/common';
import { IEstimateMainConfigComplete, IEstMainConfigComplete, IEstRoundingConfigDetailEntity } from '@libs/estimate/interfaces';
import { Subscription } from 'rxjs';
import { RoundingConfigDetailDataService } from '../../../common/services/config-dialog/rounding-config-detail/rounding-config-detail-data.service';
import { BasicsSharedRoundingMethodLookupService, BasicsSharedRoundToLookupService } from '@libs/basics/shared';
import * as entities from '@libs/basics/interfaces';
import { RoundingConfigColumnIdLookupDataService } from '../../../lookups/rounding-config/rounding-config-column-id-lookup-data.service';
import { RoundingConfigDetailValidationService } from '../../../common/services/config-dialog/rounding-config-detail/rounding-config-detail-validation.service';

/**
 * Component for rounding config detail.
 */
@Component({
	selector: 'estimate-shared-rounding-config-detail',
	templateUrl: './rounding-config-detail.component.html',
	styleUrl: './rounding-config-detail.component.css',
})
export class RoundingConfigDetailComponent implements OnInit, OnDestroy {
	protected configOption!: IGridConfiguration<IEstRoundingConfigDetailEntity>;
	private readonly roundingConfigDetailValidationService = inject(RoundingConfigDetailValidationService);
	/**
	 * Get columns
	 */
	protected columns: ColumnDef<IEstRoundingConfigDetailEntity>[] = [
		{
			id: 'estRoundingColumnId',
			model: 'ColumnId',
			label: {
				key: 'estimate.main.columnConfigDetails.ColumnId',
				text: 'Column Id',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup<IEstRoundingConfigDetailEntity, IEstMainConfigComplete>({
				dataServiceToken: RoundingConfigColumnIdLookupDataService,
				valueMember: 'ColumnId',
				displayMember: 'Column',
				showClearButton: false,
			}),
			tooltip: { text: 'Column Id', key: 'estimate.main.columnConfigDetails.ColumnId' },
			width: 110,
			visible: true,
			sortable: true,
			readonly: true,
			validator: (info: FieldValidationInfo<IEstRoundingConfigDetailEntity>) => {
				return this.roundingConfigDetailValidationService.validateColumnId({
					entity: info.entity,
					value: info.value,
					field: 'ColumnId',
				});
			},
		},
		{
			id: 'uiDisplayTo',
			model: 'UiDisplayTo',
			label: {
				key: 'estimate.main.roundingConfigDialogForm.uiDisplayTo',
				text: 'UI Display To',
			},
			type: FieldType.Integer,
			tooltip: { text: 'UI Display To', key: 'estimate.main.roundingConfigDialogForm.uiDisplayTo' },
			width: 70,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstRoundingConfigDetailEntity>) => {
				return this.roundingConfigDetailValidationService.validateUiDisplayTo({
					entity: info.entity,
					value: info.value,
					field: 'UiDisplayTo',
				});
			},
		},
		{
			id: 'isWithoutRonding',
			model: 'IsWithoutRounding',
			label: {
				key: 'estimate.main.roundingConfigDialogForm.isWithoutRounding',
				text: 'Without Rounding',
			},
			type: FieldType.Boolean,
			tooltip: { text: 'Without Rounding', key: 'estimate.main.roundingConfigDialogForm.isWithoutRounding' },
			width: 100,
			visible: true,
			sortable: true,
			readonly: false,
		},
		{
			id: 'roundTo',
			model: 'RoundTo',
			label: {
				key: 'estimate.main.roundingConfigDialogForm.roundTo',
				text: 'Round To',
			},
			type: FieldType.Integer,
			tooltip: { text: 'Round To', key: 'estimate.main.roundingConfigDialogForm.roundTo' },
			width: 70,
			visible: true,
			sortable: true,
			readonly: false,
			validator: (info: FieldValidationInfo<IEstRoundingConfigDetailEntity>) => {
				return this.roundingConfigDetailValidationService.validateRoundTo({
					entity: info.entity,
					value: info.value,
					field: 'RoundTo',
				});
			},
		},
		{
			id: 'roundToFk',
			model: 'RoundToFk',
			label: {
				key: 'estimate.main.roundingConfigDialogForm.roundingTo',
				text: 'Rounding To',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup<IEstRoundingConfigDetailEntity, entities.IBasicsCustomizeRoundToEntity>({
				dataServiceToken: BasicsSharedRoundToLookupService,
				showClearButton: false,
			}),
			tooltip: { text: 'Rounding To', key: 'estimate.main.roundingConfigDialogForm.roundingTo' },
			width: 170,
			visible: true,
			sortable: true,
			readonly: true,
			validator: (info: FieldValidationInfo<IEstRoundingConfigDetailEntity>) => {
				return this.roundingConfigDetailValidationService.validateRoundToFk({
					entity: info.entity,
					value: info.value,
					field: 'RoundToFk',
				});
			},
		},
		{
			id: 'roundingMethodFk',
			model: 'RoundingMethodFk',
			label: {
				key: 'estimate.main.roundingConfigDialogForm.roundingMethodFk',
				text: 'Rounding Method',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup<IEstRoundingConfigDetailEntity, entities.IBasicsCustomizeRoundingMethodEntity>({
				dataServiceToken: BasicsSharedRoundingMethodLookupService,
				showClearButton: false,
			}),
			tooltip: { text: 'Rounding Method', key: 'estimate.main.roundingConfigDialogForm.roundingMethodFk' },
			width: 100,
			visible: true,
			sortable: true,
			readonly: true,
			validator: (info: FieldValidationInfo<IEstRoundingConfigDetailEntity>) => {
				return this.roundingConfigDetailValidationService.validateRoundingMethodFk({
					entity: info.entity,
					value: info.value,
					field: 'RoundingMethodFk',
				});
			},
		},
	];
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly configDetailDataService = inject(RoundingConfigDetailDataService);
	private subscription: Subscription[] = [];
	private _entity?: IEstimateMainConfigComplete;

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
	 * On Init
	 */
	public ngOnInit(): void {
		this._entity = this.controlContext.entityContext.entity as IEstimateMainConfigComplete;
		this.configDetailDataService.setDataList(this._entity.estRoundingConfigDetail ?? []);
	}

	/**
	 * Selection changed
	 * @param event
	 */
	public selectionChanged(event: IEstRoundingConfigDetailEntity[]): void {
		this.configDetailDataService.setSelectedEntities(event);
	}

	/**
	 * Value changed
	 * @param event
	 */
	public valueChanged(event: IFieldValueChangeInfo<IEstRoundingConfigDetailEntity>): void {
		this.configDetailDataService.setItemToSave(event.entity);
	}

	/**
	 * On destroy
	 */
	public ngOnDestroy() {
		this.subscription.forEach((sub) => sub.unsubscribe());
	}

	private refresh(entities: IEstRoundingConfigDetailEntity[]): void {
		this.configOption = {
			uuid: '45c8af263eada64468a351083bb7dc89',
			columns: this.columns,
			skipPermissionCheck: true,
			containerType: GridContainerType.Container,
			items: [...entities],
		};
	}
}
