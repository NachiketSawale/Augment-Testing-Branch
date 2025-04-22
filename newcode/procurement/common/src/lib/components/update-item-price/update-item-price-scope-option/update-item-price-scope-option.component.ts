/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject} from '@angular/core';
import {getMultiStepDialogDataToken} from '@libs/ui/common';
import { ProcurementUpdatePriceWizardOption } from '../../../model/enums/procurement-update-item-price-option.enum';
import { IProcurementCommonUpdatePriceDataComplete } from '../../../model/entities/procurement-common-upate-item-price-entity.interface';
@Component({
  selector: 'procurement-common-update-item-price-scope-option',
  templateUrl: './update-item-price-scope-option.component.html',
  styleUrl: './update-item-price-scope-option.component.scss'
})
export class UpdateItemPriceScopeOptionComponent {
	private readonly dialogData = inject(getMultiStepDialogDataToken<IProcurementCommonUpdatePriceDataComplete>());
	public basicOption: number = this.dialogData.dataItem.basicOption;
	protected scopeOptions = [
		{
			value: ProcurementUpdatePriceWizardOption.CurrentLeadRecordItems,
			label: 'procurement.common.wizard.updateItemPrice.itemUnderLeadRecordOption',
			isActive: true
		},
		{
			value: ProcurementUpdatePriceWizardOption.SelectItems,
			label: 'procurement.common.wizard.updateItemPrice.selectItemOption',
			isActive: this.dialogData.dataItem.selectedItems.length > 0
		}
	];
}
