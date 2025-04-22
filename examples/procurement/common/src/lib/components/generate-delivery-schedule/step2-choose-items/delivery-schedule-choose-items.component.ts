/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { ColumnDef, createLookup, FieldType, getMultiStepDialogDataToken, GridComponent, IGridConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { FormsModule } from '@angular/forms';
import { BasicsSharedMaterialLookupService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { PlatformCommonModule } from '@libs/platform/common';
import { IPrcItemEntity } from '../../../model/entities/prc-item-entity.interface';
import { IGenerateDeliveryScheduleDataComplete, IGenerateDeliverySchedulePrepareItems, IPrcItemEntitySelectable } from '../../../model/interfaces/wizard/prc-common-generate-delivery-schedule-wizard.interface';
import { DeliveryScheduleSourceStatus } from '../../../model/enums/procurement-delivery-schedule-select.enum';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'procurement-common-generate-delivery-schedule-choose-items',
	standalone: true,
	templateUrl: './delivery-schedule-choose-items.component.html',
	styleUrls: ['./delivery-schedule-choose-items.component.scss'],
	imports: [GridComponent, PlatformCommonModule, FormsModule,CommonModule],
})
export class ProcurementCommonGenerateDeliveryScheduleChooseItemsComponent {
	@Input()
	protected optionItem!: IGenerateDeliverySchedulePrepareItems;
	@Input()
	protected prcItems!: IPrcItemEntitySelectable[];

	private lookupFactory = inject(UiCommonLookupDataFactoryService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IGenerateDeliveryScheduleDataComplete>());
	protected readonly multipleOptions = this.dialogData.dataItem.multipleOptions;
	private excludedModels = this.multipleOptions ? [] : ['SourceStatus', 'SafetyLeadTime'];

	private sourceLookupService = this.lookupFactory.fromSimpleItemClass(
		[
			{
				id: DeliveryScheduleSourceStatus.EstLinkedWithSCHD,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.estlinkedwithSCHD',
				},
			},
			{
				id: DeliveryScheduleSourceStatus.EstNotLinkedWithSCHD,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.estnotlinkedwithSCHD',
				},
			},
			{
				id: DeliveryScheduleSourceStatus.Package,
				desc: {
					key: 'procurement.common.wizard.generateDeliverySchedule.package',
				},
			},
		],
		{
			uuid: '',
			valueMember: 'id',
			displayMember: 'desc',
			translateDisplayMember: true,
		},
	);
	private baseColumns: ColumnDef<IPrcItemEntitySelectable>[] = [
		{
			id: 'Selected',
			model: 'isSelected',
			width: 100,
			type: FieldType.Boolean,
			label: { key: 'procurement.common.entityIsSelected' },
			sortable: true,
			visible: true,
			readonly: false,
			headerChkbox: true,
		},
		{
			id: 'Source',
			model: 'SourceStatus',
			width: 100,
			type: FieldType.Lookup,
			label: { key: 'procurement.common.wizard.generateDeliverySchedule.source' },
			readonly: true,
			sortable: true,
			visible: true,
			lookupOptions: createLookup({
				dataService: this.sourceLookupService,
			}),
		},
		{
			id: 'MaterialCode',
			model: 'MdcMaterialFk',
			width: 100,
			type: FieldType.Lookup,
			label: { key: 'basics.common.entityMaterialCode' },
			sortable: true,
			visible: true,
			readonly: true,
			lookupOptions: createLookup<IPrcItemEntity, IMaterialSearchEntity>({
				dataServiceToken: BasicsSharedMaterialLookupService,
			}),
		},
		{
			id: 'MaterialDescription',
			model: 'Description1',
			width: 120,
			type: FieldType.Description,
			label: { key: 'basics.common.entityMaterialDescription' },
			sortable: true,
			visible: true,
			readonly: true,
		},
		{
			id: 'Quantity',
			model: 'Quantity',
			type: FieldType.Quantity,
			label: { key: 'basics.common.Quantity' },
			width: 100,
			sortable: true,
			visible: true,
			readonly: true,
		},
		{
			id: 'BasUomFk',
			model: 'BasUomFk',
			type: FieldType.Lookup,
			label: { key: 'cloud.common.entityUoM' },
			lookupOptions: createLookup<IPrcItemEntity, IBasicsUomEntity>({
				dataServiceToken: BasicsSharedUomLookupService,
			}),
			sortable: true,
			visible: true,
			readonly: true,
		},
		{
			id: 'dateRequired',
			model: 'DateRequired',
			type: FieldType.Date,
			label: { key: 'cloud.common.entityRequiredBy' },
			width: 100,
			sortable: true,
			visible: true,
			readonly: true,
		},
		{
			id: 'SafetyLeadTime',
			model: 'SafetyLeadTime',
			type: FieldType.Decimal,
			label: { key: 'procurement.common.safetyLeadTime' },
			width: 100,
			sortable: true,
			visible: true,
			readonly: true,
		},
	];

	public gridConfig: IGridConfiguration<IPrcItemEntitySelectable> = {
		uuid: '850284d1e74b450ebb5e8d5307b420aa',
		columns: filterColumns(this.baseColumns, this.excludedModels),
		globalEditorLock: false,
		skipPermissionCheck: true,
	};

	protected linkedEstLineItemCheck() {
		const hasActivity = this.optionItem.HasActivity;
		const linkedEstLineItem = this.optionItem.LinkedEstLineItem;
		const maxSafetyLeadTime = this.prcItems.reduce((prevMax, item) => Math.max(prevMax, item.SafetyLeadTime), 0);
		const dialogData = this.dialogData.dataItem.prepareSpecifyDetails.optionItem;

		if (hasActivity) {
			this.optionItem.LinkedActivityAction = linkedEstLineItem;
			this.optionItem.LinkedActivity = false;
		}

		if (linkedEstLineItem) {
			dialogData.UseTempSafetyLeadTimeAction = false;
			dialogData.UseTempSafetyLeadTime = maxSafetyLeadTime;
		} else {
			dialogData.UseTempSafetyLeadTimeAction = true;
			dialogData.UseTempSafetyLeadTime = null;
		}
	}

	protected linkedActivityCheck() {
		const linkedActivity = this.optionItem.LinkedActivity;

		const maxSafetyLeadTime = this.prcItems.reduce((prevMax, item) => Math.max(prevMax, item.SafetyLeadTime), 0);
		const dialogData = this.dialogData.dataItem.prepareSpecifyDetails.optionItem;
		if (!this.optionItem.LinkedEstLineItemAction) {
			this.optionItem.LinkedEstLineItem = linkedActivity;
		}
		if (linkedActivity) {
			dialogData.UseTempSafetyLeadTimeAction = false;
			dialogData.UseTempSafetyLeadTime = maxSafetyLeadTime;
		} else {
			dialogData.UseTempSafetyLeadTimeAction = true;
			dialogData.UseTempSafetyLeadTime = null;
		}
	}
}

function filterColumns(columns: ColumnDef<IPrcItemEntitySelectable>[], excludeModels: string[]) {
	return columns.filter((column) => !excludeModels.includes(<string>column.model));
}
