/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input } from '@angular/core';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { createLookup, FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { CommonModule } from '@angular/common';
import { IGenerateDeliveryScheduleWarningResult } from '../../../model/interfaces/wizard/prc-common-generate-delivery-schedule-wizard.interface';

@Component({
	selector: 'procurement-common-generate-delivery-schedule-show-result-items',
	standalone: true,
	templateUrl: './delivery-schedule-show-result-items.component.html',
	styleUrls: ['./delivery-schedule-show-result-items.component.scss'],
	imports: [PlatformCommonModule, FormsModule, GridComponent, CommonModule],
})
export class ProcurementCommonGenerateDeliveryScheduleShowResultItemsComponent {
	@Input()
	protected isSuccess!: boolean;
	@Input()
	protected warningItems!: IGenerateDeliveryScheduleWarningResult[];
	protected warnGridConfig: IGridConfiguration<IGenerateDeliveryScheduleWarningResult> = {
		uuid: 'e2ba3f2439ad41fabc651c73a7d4168d',
		columns: [
			{
				id: 'MaterialCode',
				model: 'MdcMaterialFk',
				width: 100,
				type: FieldType.Integer,
				label: { key: 'basics.common.entityMaterialCode' },
				sortable: true,
				visible: true,
			},
			{
				id: 'MaterialDescription',
				model: 'Description1',
				width: 100,
				type: FieldType.Description,
				label: { key: 'basics.common.entityMaterialDescription' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'PackageQuantity',
				model: 'PackageQuantity',
				width: 120,
				type: FieldType.Quantity,
				label: { key: 'procurement.common.wizard.generateDeliverySchedule.packageQuantity' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'EstimateQuantity',
				model: 'EstimateQuantity',
				width: 120,
				type: FieldType.Quantity,
				label: { key: 'procurement.common.wizard.generateDeliverySchedule.estimateQuantity' },
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'Difference',
				model: 'Difference',
				type: FieldType.Quantity,
				label: { key: 'procurement.common.wizard.generateDeliverySchedule.difference' },
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
				lookupOptions: createLookup<IGenerateDeliveryScheduleWarningResult, IBasicsUomEntity>({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				sortable: true,
				visible: true,
				readonly: true,
			},
		],
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
	};
}
