/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { DeliveryScheduleRadioSelect } from '../../../model/enums/procurement-delivery-schedule-select.enum';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { getMultiStepDialogDataToken } from '@libs/ui/common';
import { IGenerateDeliveryScheduleDataComplete, IGenerateDeliverySchedulePrepareItemScope } from '../../../model/interfaces/wizard/prc-common-generate-delivery-schedule-wizard.interface';

@Component({
	selector: 'procurement-common-generate-delivery-schedule-choose-item-scope',
	standalone: true,
	templateUrl: './delivery-schedule-choose-item-scope.component.html',
	styleUrls: ['./delivery-schedule-choose-item-scope.component.scss'],
	imports: [PlatformCommonModule, FormsModule, CommonModule],
})
export class ProcurementCommonGenerateDeliveryScheduleChooseItemScopeComponent {
	@Input()
	protected optionItem!: IGenerateDeliverySchedulePrepareItemScope;
	private readonly dialogData = inject(getMultiStepDialogDataToken<IGenerateDeliveryScheduleDataComplete>());
	public scopeOptions = [
		{
			value: DeliveryScheduleRadioSelect.CurrentSubPackage,
			label: 'procurement.common.wizard.generateDeliverySchedule.fromCurrentSubPackage',
			isActive: !!this.dialogData.dataItem.prepareItemScope.optionItem.PrcHeaderId, //subPackage is selected
		},
		{
			value: DeliveryScheduleRadioSelect.CurrentAllSubPackages,
			label: 'procurement.common.wizard.generateDeliverySchedule.fromAllSubPackages',
			isActive: true,
		},
	];
}
